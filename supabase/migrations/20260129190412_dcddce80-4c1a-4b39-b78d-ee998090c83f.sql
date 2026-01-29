-- Create the static-images storage bucket for product UI assets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'static-images',
  'static-images',
  true,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
);

-- Public read access
CREATE POLICY "Public read access for static images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'static-images');

-- Admin-only write access
CREATE POLICY "Admins can upload static images"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'static-images' 
  AND public.is_admin(auth.uid())
);

CREATE POLICY "Admins can update static images"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'static-images' 
  AND public.is_admin(auth.uid())
);

CREATE POLICY "Admins can delete static images"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'static-images' 
  AND public.is_admin(auth.uid())
);