-- Clean up ALL announcement-files storage policies and recreate them properly
DROP POLICY IF EXISTS "Upload announcement files" ON storage.objects;
DROP POLICY IF EXISTS "Temporary public upload for debugging" ON storage.objects;  
DROP POLICY IF EXISTS "Update announcement files" ON storage.objects;
DROP POLICY IF EXISTS "Delete announcement files" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own announcement files" ON storage.objects;
DROP POLICY IF EXISTS "announcement_files_insert" ON storage.objects;
DROP POLICY IF EXISTS "announcement_files_update" ON storage.objects;
DROP POLICY IF EXISTS "announcement_files_delete" ON storage.objects;
DROP POLICY IF EXISTS "announcement_files_select" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view announcement files" ON storage.objects;
DROP POLICY IF EXISTS "Public can view announcement files" ON storage.objects;

-- Create new clean policies for announcement-files bucket

-- Allow authenticated users to upload files to their own user folder
CREATE POLICY "announcement_upload_own_folder" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'announcement-files' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow authenticated users to update files in their own folder  
CREATE POLICY "announcement_update_own_folder" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'announcement-files' 
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow authenticated users to delete files in their own folder
CREATE POLICY "announcement_delete_own_folder" ON storage.objects  
FOR DELETE USING (
  bucket_id = 'announcement-files'
  AND auth.role() = 'authenticated' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow everyone to read announcement files
CREATE POLICY "announcement_public_read" ON storage.objects
FOR SELECT USING (
  bucket_id = 'announcement-files'
);