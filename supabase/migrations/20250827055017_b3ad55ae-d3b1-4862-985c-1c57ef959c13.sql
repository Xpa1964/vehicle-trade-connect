-- Simplify RLS policies for announcement-files bucket to match vehicle system
DROP POLICY IF EXISTS "Users can upload files to announcement-files bucket" ON storage.objects;

-- Simple policy like vehicle system: user can upload files to their own folder
CREATE POLICY "Users can upload to their own folder in announcement-files" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'announcement-files' 
  AND auth.uid()::text = (string_to_array(name, '/'))[1]
);

-- Allow users to view files in announcement-files bucket
CREATE POLICY "Users can view announcement files" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'announcement-files');

-- Allow users to delete their own files
CREATE POLICY "Users can delete their own announcement files" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'announcement-files' 
  AND auth.uid()::text = (string_to_array(name, '/'))[1]
);