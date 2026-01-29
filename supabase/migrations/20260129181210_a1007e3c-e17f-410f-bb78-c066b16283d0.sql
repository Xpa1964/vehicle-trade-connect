-- More missing tables and columns

-- 1. Add missing auction columns
ALTER TABLE public.auctions
ADD COLUMN IF NOT EXISTS increment_minimum DECIMAL(10,2) DEFAULT 50,
ADD COLUMN IF NOT EXISTS start_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS end_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS terms_accepted BOOLEAN DEFAULT false;

-- 2. Blog posts table
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE,
  content TEXT,
  excerpt TEXT,
  author_id UUID NOT NULL,
  status TEXT DEFAULT 'draft',
  featured_image TEXT,
  category TEXT,
  tags JSONB DEFAULT '[]',
  views_count INTEGER DEFAULT 0,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view published posts" ON public.blog_posts FOR SELECT USING (status = 'published' OR author_id = auth.uid());
CREATE POLICY "Authors can manage own posts" ON public.blog_posts FOR ALL USING (author_id = auth.uid());

-- 3. Add user_id to announcement_attachments
ALTER TABLE public.announcement_attachments
ADD COLUMN IF NOT EXISTS user_id UUID;

-- 4. Create approve/reject API key request functions
CREATE OR REPLACE FUNCTION public.approve_api_key_request(p_request_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.api_key_requests SET status = 'approved', updated_at = now() WHERE id = p_request_id;
  RETURN FOUND;
END;
$$;

CREATE OR REPLACE FUNCTION public.reject_api_key_request(p_request_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.api_key_requests SET status = 'rejected', updated_at = now() WHERE id = p_request_id;
  RETURN FOUND;
END;
$$;

-- 5. Add analyst role to app_role enum
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'analyst';