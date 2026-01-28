-- Clean up all existing announcement-files policies and recreate them properly
DROP POLICY IF EXISTS "Users can upload files to announcement-files bucket" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload to their own folder in announcement-files" ON storage.objects;
DROP POLICY IF EXISTS "Users can view announcement files" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own announcement files" ON storage.objects;

-- Simple policy like vehicle system: user can upload files to their own folder
CREATE POLICY "announcement_files_upload" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'announcement-files' 
  AND auth.uid()::text = (string_to_array(name, '/'))[1]
);

-- Allow users to view files in announcement-files bucket
CREATE POLICY "announcement_files_select" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'announcement-files');

-- Allow users to delete their own files
CREATE POLICY "announcement_files_delete" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'announcement-files' 
  AND auth.uid()::text = (string_to_array(name, '/'))[1]
);