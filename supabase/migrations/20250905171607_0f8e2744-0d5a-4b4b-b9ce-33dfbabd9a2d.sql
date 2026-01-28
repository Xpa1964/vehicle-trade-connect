-- Add missing columns to announcements table
ALTER TABLE public.announcements ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'active';
ALTER TABLE public.announcements ADD COLUMN IF NOT EXISTS category text NOT NULL DEFAULT 'business_opportunities';
ALTER TABLE public.announcements ADD COLUMN IF NOT EXISTS type text NOT NULL DEFAULT 'offer';
ALTER TABLE public.announcements ADD COLUMN IF NOT EXISTS is_featured boolean DEFAULT false;
ALTER TABLE public.announcements ADD COLUMN IF NOT EXISTS featured_until timestamp with time zone;
ALTER TABLE public.announcements ADD COLUMN IF NOT EXISTS view_count integer DEFAULT 0;
ALTER TABLE public.announcements ADD COLUMN IF NOT EXISTS priority integer DEFAULT 0;
ALTER TABLE public.announcements ADD COLUMN IF NOT EXISTS attachment_url text;
ALTER TABLE public.announcements ADD COLUMN IF NOT EXISTS attachment_name text;
ALTER TABLE public.announcements ADD COLUMN IF NOT EXISTS attachment_size integer;
ALTER TABLE public.announcements ADD COLUMN IF NOT EXISTS original_language text DEFAULT 'es';

-- Enable RLS on announcements table
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "announcements_select_all" ON public.announcements;
DROP POLICY IF EXISTS "announcements_insert_owner" ON public.announcements;
DROP POLICY IF EXISTS "announcements_delete_owner" ON public.announcements;

-- Create RLS policies for announcements
CREATE POLICY "announcements_select_all" ON public.announcements
  FOR SELECT USING (true);

CREATE POLICY "announcements_insert_owner" ON public.announcements
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "announcements_update_owner" ON public.announcements
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "announcements_delete_owner" ON public.announcements
  FOR DELETE USING (auth.uid() = user_id);