# Image Upload Feature for Admin Panel

## Overview
The admin panel now includes image upload functionality for service images. Images are uploaded to a Supabase storage bucket named "images" and stored in a "services" folder.

## Features
- **File Upload**: Select image files from your device
- **Image Preview**: See a preview of the selected image before uploading
- **File Validation**: 
  - Only image files are accepted
  - Maximum file size: 5MB
- **Supabase Storage**: Images are automatically uploaded to the "images" bucket
- **Image Management**: 
  - Upload new images
  - Remove existing images
  - View current image URLs

## How to Use

### For Service Images:
1. Navigate to the Admin Panel
2. Go to the Services tab
3. In the service form, find the "Service Image" section
4. Click "Choose File" to select an image
5. Click "Upload" to upload the image to Supabase storage
6. The image URL will be automatically populated in the service_image_url field
7. Save the service to apply the changes

### Database Requirements
Make sure your Supabase database has the following fields in the `services` table:
- `service_image_url` (TEXT, nullable)
- `youtube_video_url` (TEXT, nullable)

### Storage Bucket Setup
The "images" bucket should be created in Supabase Storage with the following policies:
- Public read access for displaying images
- Authenticated user upload/update/delete access

## Technical Details

### File Structure
- `src/lib/imageUpload.ts` - Contains upload/delete utility functions
- `src/pages/Admin.tsx` - Updated with image upload UI components
- `src/integrations/supabase/types.ts` - Updated with new database field types

### Upload Process
1. User selects an image file
2. File is validated (type and size)
3. Image preview is generated
4. User clicks upload button
5. File is uploaded to Supabase storage bucket "images/services/"
6. Public URL is returned and stored in the service record

### Error Handling
- File type validation
- File size limits (5MB)
- Upload error handling with user feedback
- Network error handling

## Migration
If you need to add the database fields manually, run this SQL in your Supabase SQL editor:

```sql
-- Add service_image_url and youtube_video_url fields to services table
ALTER TABLE public.services 
ADD COLUMN service_image_url TEXT,
ADD COLUMN youtube_video_url TEXT;

-- Create storage bucket for images
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies (if not already created)
CREATE POLICY "Images are publicly accessible"
ON storage.objects
FOR SELECT
USING (bucket_id = 'images');

CREATE POLICY "Authenticated users can upload images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'images');

CREATE POLICY "Authenticated users can update images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'images');

CREATE POLICY "Authenticated users can delete images"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'images');
```


