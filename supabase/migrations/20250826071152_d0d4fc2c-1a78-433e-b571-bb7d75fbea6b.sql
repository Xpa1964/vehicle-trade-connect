-- Make announcement-files bucket public so uploaded files are accessible
UPDATE storage.buckets 
SET public = true 
WHERE name = 'announcement-files';

-- Create storage policies for public access to announcement files
CREATE POLICY "Anyone can view announcement files" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'announcement-files');

CREATE POLICY "Authenticated users can upload announcement files" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'announcement-files' AND auth.uid() IS NOT NULL);