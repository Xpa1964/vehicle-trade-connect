-- Final remaining tables

-- 1. Announcement attachments
CREATE TABLE IF NOT EXISTS public.announcement_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  announcement_id UUID REFERENCES public.announcements(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_type TEXT,
  file_size INTEGER,
  storage_path TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.announcement_attachments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view attachments" ON public.announcement_attachments FOR SELECT USING (true);
CREATE POLICY "Announcement owners can manage" ON public.announcement_attachments FOR ALL USING (
  EXISTS (SELECT 1 FROM public.announcements WHERE id = announcement_id AND user_id = auth.uid())
);

-- 2. Add fuel column to vehicles (was fuel_type, now add fuel as well)
ALTER TABLE public.vehicles
ADD COLUMN IF NOT EXISTS fuel TEXT;