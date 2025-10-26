import React, { useState } from 'react';
import { ImageUpload } from './ImageUpload';

/**
 * ImageUpload Component Examples
 * 
 * Demonstrates various configurations and use cases for the ImageUpload component
 */

export default {
  title: 'Admin/ImageUpload',
  component: ImageUpload,
};

/**
 * Example 1: Basic Usage
 * Simple image upload with default settings
 */
export function BasicUsage() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  return (
    <div className="p-6 max-w-2xl">
      <h2 className="text-2xl font-bold mb-4">Basic Image Upload</h2>
      <ImageUpload
        value={imageUrl}
        onChange={setImageUrl}
        label="Upload Image"
      />
      {imageUrl && (
        <div className="mt-4">
          <p className="text-sm text-muted-foreground">Current URL:</p>
          <code className="text-xs bg-muted p-2 rounded block mt-1 break-all">
            {imageUrl}
          </code>
        </div>
      )}
    </div>
  );
}

/**
 * Example 2: With Custom Aspect Ratio
 * Upload with 16:9 aspect ratio for hero images
 */
export function WithAspectRatio() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  return (
    <div className="p-6 max-w-2xl">
      <h2 className="text-2xl font-bold mb-4">Hero Image Upload (16:9)</h2>
      <ImageUpload
        value={imageUrl}
        onChange={setImageUrl}
        label="Hero Banner"
        aspectRatio="16/9"
        folder="banners"
      />
    </div>
  );
}

/**
 * Example 3: Square Images
 * Upload with 1:1 aspect ratio for profile pictures or thumbnails
 */
export function SquareImages() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  return (
    <div className="p-6 max-w-md">
      <h2 className="text-2xl font-bold mb-4">Profile Picture (1:1)</h2>
      <ImageUpload
        value={imageUrl}
        onChange={setImageUrl}
        label="Profile Image"
        aspectRatio="1/1"
        folder="profiles"
      />
    </div>
  );
}

/**
 * Example 4: With Larger File Size Limit
 * Allow uploads up to 10MB
 */
export function LargeFileSize() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  return (
    <div className="p-6 max-w-2xl">
      <h2 className="text-2xl font-bold mb-4">Large File Upload (10MB)</h2>
      <ImageUpload
        value={imageUrl}
        onChange={setImageUrl}
        label="High Resolution Image"
        maxSizeMB={10}
        folder="high-res"
      />
    </div>
  );
}

/**
 * Example 5: Disabled State
 * Upload component in disabled state
 */
export function DisabledState() {
  const [imageUrl, setImageUrl] = useState<string | null>(
    'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800'
  );

  return (
    <div className="p-6 max-w-2xl">
      <h2 className="text-2xl font-bold mb-4">Disabled Upload</h2>
      <ImageUpload
        value={imageUrl}
        onChange={() => {}}
        label="Locked Image"
        disabled={true}
      />
    </div>
  );
}

/**
 * Example 6: Multiple Uploads in Form
 * Demonstrates using multiple ImageUpload components in a form context
 */
export function MultipleUploads() {
  const [featuredImage, setFeaturedImage] = useState<string | null>(null);
  const [thumbnailImage, setThumbnailImage] = useState<string | null>(null);
  const [galleryImage, setGalleryImage] = useState<string | null>(null);

  return (
    <div className="p-6 max-w-4xl">
      <h2 className="text-2xl font-bold mb-6">Service Creation Form</h2>
      <form className="space-y-6">
        <div>
          <ImageUpload
            value={featuredImage}
            onChange={setFeaturedImage}
            label="Featured Image"
            aspectRatio="16/9"
            folder="featured"
          />
        </div>
        <div className="grid grid-cols-2 gap-6">
          <ImageUpload
            value={thumbnailImage}
            onChange={setThumbnailImage}
            label="Thumbnail"
            aspectRatio="4/3"
            folder="thumbnails"
          />
          <ImageUpload
            value={galleryImage}
            onChange={setGalleryImage}
            label="Gallery Image"
            aspectRatio="4/3"
            folder="gallery"
          />
        </div>
        <button
          type="button"
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
          onClick={() => {
            console.log('Form data:', {
              featuredImage,
              thumbnailImage,
              galleryImage,
            });
          }}
        >
          Save Service
        </button>
      </form>
    </div>
  );
}

/**
 * Example 7: With Pre-loaded Image
 * Shows component with an existing image URL
 */
export function WithPreloadedImage() {
  const [imageUrl, setImageUrl] = useState<string | null>(
    'https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?w=800'
  );

  return (
    <div className="p-6 max-w-2xl">
      <h2 className="text-2xl font-bold mb-4">Edit Mode with Existing Image</h2>
      <ImageUpload
        value={imageUrl}
        onChange={setImageUrl}
        label="Service Image"
        folder="services"
      />
      <div className="mt-4 flex gap-2">
        <button
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm"
          onClick={() => console.log('Save:', imageUrl)}
        >
          Save Changes
        </button>
        <button
          className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md text-sm"
          onClick={() => setImageUrl(null)}
        >
          Clear Image
        </button>
      </div>
    </div>
  );
}
