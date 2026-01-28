-- Arreglar el search_path de la función que acabamos de crear
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;