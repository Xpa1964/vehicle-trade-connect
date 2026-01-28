-- Fix storage policies for announcement-files bucket

-- Delete conflicting policies first
DROP POLICY IF EXISTS "Anyone can view announcement files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload announcement files" ON storage.objects;

-- Create correct policies for announcement files
CREATE POLICY "Public can view announcement files" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'announcement-files');

CREATE POLICY "Users can upload their own announcement files" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'announcement-files' 
  AND auth.uid() IS NOT NULL
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can update their own announcement files" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'announcement-files' 
  AND auth.uid() IS NOT NULL
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete their own announcement files" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'announcement-files' 
  AND auth.uid() IS NOT NULL
  AND (storage.foldername(name))[1] = auth.uid()::text
);