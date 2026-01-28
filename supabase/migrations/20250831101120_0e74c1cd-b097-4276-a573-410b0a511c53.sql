-- 6. Autenticación en Edge Function: Ya se está usando JWT del usuario, pero agregamos validación adicional
-- 7. Límite de tamaño y bucket privado (opcional)
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

-- Agregar política para eliminación basada en propiedad del archivo
CREATE POLICY "Users can delete their own announcement files" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'announcement-files' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);