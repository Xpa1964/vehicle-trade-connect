-- Drop the problematic policy that causes conflicts
DROP POLICY IF EXISTS "announcement_files_insert" ON storage.objects;

-- Create correct policy for authenticated users (matching vehicles pattern)
CREATE POLICY "Authenticated users can upload announcement files"
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'announcement-files');

-- Ensure proper SELECT policy exists for public access
DROP POLICY IF EXISTS "announcement_files_select" ON storage.objects;
CREATE POLICY "Anyone can view announcement files"
ON storage.objects FOR SELECT 
TO public 
USING (bucket_id = 'announcement-files');

-- Ensure proper UPDATE policy for file owners
CREATE POLICY "Users can update their own announcement files"
ON storage.objects FOR UPDATE 
TO authenticated 
USING (bucket_id = 'announcement-files' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Ensure proper DELETE policy for file owners  
CREATE POLICY "Users can delete their own announcement files"
ON storage.objects FOR DELETE 
TO authenticated 
USING (bucket_id = 'announcement-files' AND auth.uid()::text = (storage.foldername(name))[1]);