-- Create table for tracking vehicle visits
CREATE TABLE public.user_vehicle_visits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  vehicle_id UUID NOT NULL,
  visited_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  visit_duration INTEGER DEFAULT 0, -- seconds spent viewing
  interaction_type TEXT DEFAULT 'view', -- view, click, search, filter
  source_page TEXT DEFAULT 'gallery' -- gallery, detail, search
);

-- Create table for caching recommendations
CREATE TABLE public.recommendation_cache (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  recommended_vehicles JSONB NOT NULL DEFAULT '[]'::jsonb,
  algorithm_version TEXT NOT NULL DEFAULT '1.0',
  confidence_score NUMERIC DEFAULT 0,
  generated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + INTERVAL '1 hour'),
  reasoning JSONB DEFAULT '{}'::jsonb
);

-- Enable RLS
ALTER TABLE public.user_vehicle_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recommendation_cache ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_vehicle_visits
CREATE POLICY "Users can insert their own visits"
ON public.user_vehicle_visits
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own visits"
ON public.user_vehicle_visits
FOR SELECT
USING (auth.uid() = user_id);

-- RLS policies for recommendation_cache
CREATE POLICY "Users can view their own recommendations"
ON public.recommendation_cache
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "System can manage recommendation cache"
ON public.recommendation_cache
FOR ALL
USING (true)
WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX idx_user_vehicle_visits_user_id ON public.user_vehicle_visits(user_id);
CREATE INDEX idx_user_vehicle_visits_vehicle_id ON public.user_vehicle_visits(vehicle_id);
CREATE INDEX idx_user_vehicle_visits_visited_at ON public.user_vehicle_visits(visited_at DESC);
CREATE INDEX idx_recommendation_cache_user_id ON public.recommendation_cache(user_id);
CREATE INDEX idx_recommendation_cache_expires_at ON public.recommendation_cache(expires_at);