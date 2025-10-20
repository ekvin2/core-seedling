-- Add service_image_url and youtube_video_url fields to services table
ALTER TABLE public.services 
ADD COLUMN service_image_url TEXT,
ADD COLUMN youtube_video_url TEXT;

-- Create storage bucket for images
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policy for public read access to images
CREATE POLICY "Images are publicly accessible"
ON storage.objects
FOR SELECT
USING (bucket_id = 'images');

-- Create storage policy for authenticated users to upload images
CREATE POLICY "Authenticated users can upload images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'images');

-- Create storage policy for authenticated users to update images
CREATE POLICY "Authenticated users can update images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'images');

-- Create storage policy for authenticated users to delete images
CREATE POLICY "Authenticated users can delete images"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'images');


