-- Update the INSERT policy for announcement-files bucket to support multi-level paths
DROP POLICY IF EXISTS "Users can upload files to announcement-files bucket" ON storage.objects;

CREATE POLICY "Users can upload files to announcement-files bucket" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'announcement-files' 
  AND auth.uid()::text = (string_to_array(name, '/'))[1]
);