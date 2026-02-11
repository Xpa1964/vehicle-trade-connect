
-- Create vehicles storage bucket for vehicle images
INSERT INTO storage.buckets (id, name, public)
VALUES ('vehicles', 'vehicles', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload to their own vehicle folders
CREATE POLICY "Users can upload vehicle images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'vehicles'
  AND auth.role() = 'authenticated'
);

-- Allow public read access
CREATE POLICY "Vehicle images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'vehicles');

-- Allow users to update their own uploads
CREATE POLICY "Users can update vehicle images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'vehicles'
  AND auth.role() = 'authenticated'
);

-- Allow users to delete their own uploads
CREATE POLICY "Users can delete vehicle images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'vehicles'
  AND auth.role() = 'authenticated'
);
