-- Eliminar las políticas de INSERT conflictivas para announcement-files
DROP POLICY IF EXISTS "Authenticated users can upload announcement files" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload announcement files" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own announcement files" ON storage.objects;

-- Crear una sola política de INSERT clara y funcional
CREATE POLICY "announcement_files_insert_policy" ON storage.objects
FOR INSERT 
TO public
WITH CHECK (
  bucket_id = 'announcement-files' AND
  auth.uid() IS NOT NULL AND
  (storage.foldername(name))[1] = (auth.uid())::text
);