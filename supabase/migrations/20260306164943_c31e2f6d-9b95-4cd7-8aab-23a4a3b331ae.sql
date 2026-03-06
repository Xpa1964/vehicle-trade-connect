-- FIX 1: Create dedicated company-logos bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('company-logos', 'company-logos', true, 2097152);

-- Allow public read access
CREATE POLICY "Public read access for company logos"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'company-logos');

-- Allow anyone to upload (registration happens before auth)
CREATE POLICY "Anyone can upload company logos"
  ON storage.objects
  FOR INSERT
  TO public
  WITH CHECK (bucket_id = 'company-logos');