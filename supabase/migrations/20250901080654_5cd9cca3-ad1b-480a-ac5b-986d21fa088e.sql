-- Fix conflicting RLS policies for announcement-files storage bucket

-- First, drop all existing policies for announcement-files bucket to clean up conflicts
DROP POLICY IF EXISTS "Authenticated users can upload announcement files" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload announcement files" ON storage.objects;
DROP POLICY IF EXISTS "Users can view announcement files" ON storage.objects;
DROP POLICY IF EXISTS "Users can update announcement files" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete announcement files" ON storage.objects;

-- Create clean, non-conflicting policies for announcement-files bucket

-- Allow authenticated users to view announcement files
CREATE POLICY "View announcement files" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'announcement-files');

-- Allow users to upload files to their own folder in announcement-files bucket
CREATE POLICY "Upload announcement files" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'announcement-files' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to update their own announcement files
CREATE POLICY "Update announcement files" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'announcement-files' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to delete their own announcement files
CREATE POLICY "Delete announcement files" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'announcement-files' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);