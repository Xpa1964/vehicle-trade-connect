-- Final batch of missing columns, tables and functions

-- 1. Add content_manager role
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'content_manager';

-- 2. Add accepts_exchange to vehicles
ALTER TABLE public.vehicles
ADD COLUMN IF NOT EXISTS accepts_exchange BOOLEAN DEFAULT false;

-- 3. Add verified and other columns to ratings
ALTER TABLE public.ratings
ADD COLUMN IF NOT EXISTS from_user_id UUID,
ADD COLUMN IF NOT EXISTS to_user_id UUID,
ADD COLUMN IF NOT EXISTS verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS transaction_type TEXT;

-- 4. Performance metrics table
CREATE TABLE IF NOT EXISTS public.performance_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_name TEXT NOT NULL,
  metric_value DECIMAL,
  metric_unit TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.performance_metrics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read metrics" ON public.performance_metrics FOR SELECT USING (true);
CREATE POLICY "Authenticated can insert metrics" ON public.performance_metrics FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- 5. Performance alerts table
CREATE TABLE IF NOT EXISTS public.performance_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_type TEXT NOT NULL,
  severity TEXT DEFAULT 'warning',
  message TEXT,
  resolved BOOLEAN DEFAULT false,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.performance_alerts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read alerts" ON public.performance_alerts FOR SELECT USING (true);
CREATE POLICY "Authenticated can insert alerts" ON public.performance_alerts FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- 6. Generate API key function
CREATE OR REPLACE FUNCTION public.generate_api_key(p_user_id UUID, p_name TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_key TEXT;
BEGIN
  v_key := 'sk_' || encode(gen_random_bytes(32), 'hex');
  INSERT INTO public.api_keys (user_id, name, api_key, key_hash, key_prefix)
  VALUES (p_user_id, p_name, v_key, encode(digest(v_key, 'sha256'), 'hex'), 'sk_');
  RETURN v_key;
END;
$$;

-- 7. Get user rating summary function
CREATE OR REPLACE FUNCTION public.get_user_rating_summary(p_user_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_result JSONB;
BEGIN
  SELECT jsonb_build_object(
    'average_rating', COALESCE(AVG(rating), 0),
    'total_ratings', COUNT(*),
    'rating_distribution', jsonb_build_object(
      '5', COUNT(*) FILTER (WHERE rating = 5),
      '4', COUNT(*) FILTER (WHERE rating = 4),
      '3', COUNT(*) FILTER (WHERE rating = 3),
      '2', COUNT(*) FILTER (WHERE rating = 2),
      '1', COUNT(*) FILTER (WHERE rating = 1)
    )
  ) INTO v_result
  FROM public.ratings
  WHERE rated_id = p_user_id;
  
  RETURN v_result;
END;
$$;