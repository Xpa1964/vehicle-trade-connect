-- Limpiar URLs inválidas primero
UPDATE public.announcements 
SET attachment_url = NULL 
WHERE attachment_url IS NOT NULL 
AND attachment_url NOT LIKE '%/storage/v1/object/public/announcement-files/%';

-- 1. Política de bucket: Cambiar INSERT para exigir la carpeta del UID
DROP POLICY IF EXISTS "Users can upload announcement files" ON storage.objects;

CREATE POLICY "Users can upload announcement files" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'announcement-files' 
  AND auth.uid()::text = (storage.foldername(name))[1]
  AND array_length(storage.foldername(name), 1) >= 1
);

-- 2. Trigger user_id: Asegurar que user_id nunca sea NULL en announcements
ALTER TABLE public.announcements ALTER COLUMN user_id SET NOT NULL;

-- 3. Validación de URL: CHECK que la URL apunte al bucket y a la carpeta correcta
ALTER TABLE public.announcements 
ADD CONSTRAINT valid_attachment_url 
CHECK (
  attachment_url IS NULL OR 
  (
    attachment_url LIKE '%/storage/v1/object/public/announcement-files/%' AND
    attachment_url NOT LIKE '%/../%' AND
    attachment_url NOT LIKE '%/./%'
  )
);

-- 4. Índice user_id: Mejora de rendimiento en escrituras
CREATE INDEX IF NOT EXISTS idx_announcements_user_id ON public.announcements(user_id);

-- 5. Trigger de borrado de archivo: Elimina el objeto al borrar el anuncio
CREATE OR REPLACE FUNCTION public.delete_announcement_file()
RETURNS TRIGGER AS $$
DECLARE
  file_path TEXT;
BEGIN
  IF OLD.attachment_url IS NOT NULL THEN
    file_path := regexp_replace(
      OLD.attachment_url, 
      '.*/storage/v1/object/public/announcement-files/', 
      ''
    );
    
    PERFORM storage.delete_object('announcement-files', file_path);
  END IF;
  
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER delete_announcement_file_trigger
  BEFORE DELETE ON public.announcements
  FOR EACH ROW
  EXECUTE FUNCTION public.delete_announcement_file();