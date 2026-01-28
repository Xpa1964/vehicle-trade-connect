-- Eliminar políticas RLS incorrectas existentes para announcement attachments
DROP POLICY IF EXISTS "Anyone can upload announcement attachments" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view announcement attachments" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own announcement attachments" ON storage.objects;

-- Eliminar bucket duplicado con espacios
DELETE FROM storage.buckets WHERE name = 'Announcement Attachments';

-- Asegurar que el bucket announcement_attachments existe y está configurado correctamente
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('announcement_attachments', 'announcement_attachments', true, 52428800, 
        ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
              'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
              'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
              'text/plain', 'text/csv', 'image/jpeg', 'image/png', 'image/gif', 'image/webp'])
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Crear políticas RLS correctas para el bucket announcement_attachments
CREATE POLICY "Users can upload to announcement_attachments"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'announcement_attachments' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Anyone can view announcement_attachments"
ON storage.objects FOR SELECT
USING (bucket_id = 'announcement_attachments');

CREATE POLICY "Users can delete their own files in announcement_attachments"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'announcement_attachments' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);