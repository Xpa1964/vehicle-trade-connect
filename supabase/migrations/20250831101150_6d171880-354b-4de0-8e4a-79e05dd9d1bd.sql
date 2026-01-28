-- Volver el bucket announcement-files privado para mayor seguridad
UPDATE storage.buckets 
SET public = false 
WHERE id = 'announcement-files';

-- Agregar política para lectura autenticada del bucket announcement-files
CREATE POLICY "Users can view announcement files" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'announcement-files' 
  AND auth.role() = 'authenticated'::text
);