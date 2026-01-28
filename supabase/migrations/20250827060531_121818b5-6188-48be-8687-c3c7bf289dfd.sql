-- Clean up all existing announcement-files policies and recreate them properly
DROP POLICY IF EXISTS "Users can upload files to announcement-files bucket" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload to their own folder in announcement-files" ON storage.objects;
DROP POLICY IF EXISTS "Users can view announcement files" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own announcement files" ON storage.objects;
DROP POLICY IF EXISTS "announcement_files_insert_policy" ON storage.objects;
DROP POLICY IF EXISTS "announcement_files_upload" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own announcement files" ON storage.objects;

-- Simple policies like vehicle system: only check bucket and auth
CREATE POLICY "announcement_files_insert" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'announcement-files' 
  AND auth.uid() IS NOT NULL
);

-- Allow public access to view announcement files
CREATE POLICY "announcement_files_select" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'announcement-files');

-- Allow authenticated users to delete their own files
CREATE POLICY "announcement_files_delete" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'announcement-files' 
  AND auth.uid()::text = (string_to_array(name, '/'))[1]
);