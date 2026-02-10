
-- Add missing columns to announcements table that the form expects
ALTER TABLE public.announcements 
  ADD COLUMN IF NOT EXISTS is_featured boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS featured_until timestamp with time zone,
  ADD COLUMN IF NOT EXISTS priority integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS type text DEFAULT 'offer',
  ADD COLUMN IF NOT EXISTS view_count integer DEFAULT 0;
