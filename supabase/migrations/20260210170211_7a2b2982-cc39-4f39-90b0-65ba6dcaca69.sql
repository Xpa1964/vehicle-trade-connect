
-- Create the announcement_attachments storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('announcement_attachments', 'announcement_attachments', true)
ON CONFLICT (id) DO NOTHING;

-- Public read access
CREATE POLICY "Public read access for announcement attachments"
ON storage.objects FOR SELECT
USING (bucket_id = 'announcement_attachments');

-- Authenticated users can upload
CREATE POLICY "Authenticated users can upload announcement attachments"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'announcement_attachments');

-- Users can update their own attachments
CREATE POLICY "Users can update own announcement attachments"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'announcement_attachments' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Users can delete their own attachments
CREATE POLICY "Users can delete own announcement attachments"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'announcement_attachments' AND auth.uid()::text = (storage.foldername(name))[1]);
