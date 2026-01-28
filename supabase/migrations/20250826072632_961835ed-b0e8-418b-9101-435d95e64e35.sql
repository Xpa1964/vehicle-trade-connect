-- Fix storage policies for announcement-files bucket (handle existing policies)

-- Drop all existing policies for announcement-files bucket on storage.objects
DO $$ 
DECLARE
    policy_name text;
BEGIN
    FOR policy_name IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE schemaname = 'storage' 
        AND tablename = 'objects' 
        AND qual LIKE '%announcement-files%'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', policy_name);
    END LOOP;
END $$;

-- Create clean policies for announcement files
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