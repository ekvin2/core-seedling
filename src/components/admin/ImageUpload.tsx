import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, Image as ImageIcon, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { uploadImageToSupabase, deleteImageFromSupabase } from '@/lib/imageUpload';

interface ImageUploadProps {
  value?: string | null;
  onChange: (url: string | null) => void;
  bucketName?: string;
  folder?: string;
  maxSizeMB?: number;
  disabled?: boolean;
  aspectRatio?: string;
  label?: string;
}

/**
 * ImageUpload Component
 * 
 * A comprehensive image upload component with:
 * - Drag-and-drop or click to upload
 * - Image preview
 * - Upload progress indicator
 * - Replace and remove functionality
 * - File validation (size, type)
 * - Accessibility features (ARIA labels, keyboard navigation)
 * - Seamless Supabase Storage integration
 * 
 * @example
 * ```tsx
 * <ImageUpload
 *   value={serviceImageUrl}
 *   onChange={(url) => setServiceImageUrl(url)}
 *   folder="services"
 *   label="Service Image"
 * />
 * ```
 */
export const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  bucketName = 'images',
  folder = 'services',
  maxSizeMB = 5,
  disabled = false,
  aspectRatio,
  label = 'Upload Image',
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [preview, setPreview] = useState<string | null>(value || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const validateFile = useCallback((file: File): boolean => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file type',
        description: 'Please select an image file (JPG, PNG, GIF, WebP).',
        variant: 'destructive',
      });
      return false;
    }

    // Validate file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      toast({
        title: 'File too large',
        description: `Please select an image smaller than ${maxSizeMB}MB. Current size: ${(file.size / 1024 / 1024).toFixed(2)}MB`,
        variant: 'destructive',
      });
      return false;
    }

    return true;
  }, [maxSizeMB, toast]);

  const handleFileUpload = useCallback(async (file: File) => {
    if (!validateFile(file)) return;

    // Create preview immediately
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload to Supabase
    setUploading(true);
    setUploadStatus('uploading');
    setUploadProgress(0);

    // Simulate progress (since Supabase doesn't provide upload progress)
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    try {
      const result = await uploadImageToSupabase(file, bucketName, folder);
      
      clearInterval(progressInterval);
      setUploadProgress(100);

      if (result.success && result.url) {
        setUploadStatus('success');
        onChange(result.url);
        
        toast({
          title: 'Upload successful',
          description: 'Image uploaded successfully!',
        });

        // Reset status after animation
        setTimeout(() => {
          setUploadStatus('idle');
          setUploadProgress(0);
        }, 2000);
      } else {
        throw new Error(result.error || 'Upload failed');
      }
    } catch (error) {
      clearInterval(progressInterval);
      setUploadStatus('error');
      setPreview(null);
      
      toast({
        title: 'Upload failed',
        description: error instanceof Error ? error.message : 'Failed to upload image',
        variant: 'destructive',
      });

      // Reset status
      setTimeout(() => {
        setUploadStatus('idle');
        setUploadProgress(0);
      }, 3000);
    } finally {
      setUploading(false);
    }
  }, [validateFile, bucketName, folder, onChange, toast]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragging(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (disabled) return;

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, [disabled, handleFileUpload]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, [handleFileUpload]);

  const handleRemove = useCallback(async () => {
    if (value) {
      try {
        await deleteImageFromSupabase(value, bucketName);
        toast({
          title: 'Image removed',
          description: 'Image deleted successfully.',
        });
      } catch (error) {
        // Silent fail for delete errors
        console.error('Failed to delete image:', error);
      }
    }

    setPreview(null);
    onChange(null);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [value, bucketName, onChange, toast]);

  const handleReplace = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleClick = useCallback(() => {
    if (!disabled && !preview) {
      fileInputRef.current?.click();
    }
  }, [disabled, preview]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  }, [handleClick]);

  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      
      <div
        className={`
          relative rounded-lg border-2 border-dashed transition-all duration-200
          ${isDragging ? 'border-primary bg-primary/5 scale-[1.02]' : 'border-border'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-primary/50 hover:bg-accent/5'}
          ${preview ? 'border-solid' : ''}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        tabIndex={disabled ? -1 : 0}
        role="button"
        aria-label={preview ? 'Change image' : 'Upload image'}
        aria-disabled={disabled}
        style={aspectRatio ? { aspectRatio } : { minHeight: '200px' }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          disabled={disabled}
          aria-label="File input"
        />

        {!preview ? (
          <div className="flex flex-col items-center justify-center p-8 text-center h-full">
            <div className={`
              rounded-full p-4 mb-4 transition-colors
              ${isDragging ? 'bg-primary/10' : 'bg-muted'}
            `}>
              <Upload className={`w-8 h-8 ${isDragging ? 'text-primary' : 'text-muted-foreground'}`} />
            </div>
            
            <p className="text-sm font-medium text-foreground mb-1">
              {isDragging ? 'Drop image here' : 'Click to upload or drag and drop'}
            </p>
            
            <p className="text-xs text-muted-foreground">
              PNG, JPG, GIF or WebP (max {maxSizeMB}MB)
            </p>
          </div>
        ) : (
          <div className="relative group h-full">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover rounded-lg"
            />
            
            {/* Overlay with actions */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={(e) => {
                  e.stopPropagation();
                  handleReplace();
                }}
                disabled={disabled || uploading}
                aria-label="Replace image"
              >
                <ImageIcon className="w-4 h-4 mr-1" />
                Replace
              </Button>
              
              <Button
                type="button"
                size="sm"
                variant="destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove();
                }}
                disabled={disabled || uploading}
                aria-label="Remove image"
              >
                <X className="w-4 h-4 mr-1" />
                Remove
              </Button>
            </div>

            {/* Upload status indicator */}
            {uploadStatus !== 'idle' && (
              <div className="absolute top-2 right-2">
                {uploadStatus === 'uploading' && (
                  <div className="bg-background/90 backdrop-blur-sm rounded-full p-2">
                    <Loader2 className="w-5 h-5 text-primary animate-spin" />
                  </div>
                )}
                {uploadStatus === 'success' && (
                  <div className="bg-background/90 backdrop-blur-sm rounded-full p-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  </div>
                )}
                {uploadStatus === 'error' && (
                  <div className="bg-background/90 backdrop-blur-sm rounded-full p-2">
                    <AlertCircle className="w-5 h-5 text-destructive" />
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Upload progress bar */}
        {uploading && (
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="bg-background/90 backdrop-blur-sm rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-foreground font-medium">Uploading...</span>
                <span className="text-muted-foreground">{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="h-1" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
