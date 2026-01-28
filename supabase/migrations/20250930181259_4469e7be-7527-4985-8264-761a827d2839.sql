-- Create performance_optimizations table
CREATE TABLE IF NOT EXISTS public.performance_optimizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  optimization_type TEXT NOT NULL UNIQUE,
  is_enabled BOOLEAN NOT NULL DEFAULT false,
  level TEXT CHECK (level IN ('moderate', 'aggressive')),
  applied_by UUID REFERENCES auth.users(id),
  applied_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.performance_optimizations ENABLE ROW LEVEL SECURITY;

-- Admin only access
CREATE POLICY "Admins can view optimizations"
  ON public.performance_optimizations
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'::app_role
    )
  );

CREATE POLICY "Admins can manage optimizations"
  ON public.performance_optimizations
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'::app_role
    )
  );

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_performance_optimizations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_performance_optimizations_timestamp
  BEFORE UPDATE ON public.performance_optimizations
  FOR EACH ROW
  EXECUTE FUNCTION update_performance_optimizations_updated_at();

-- Insert default optimization types
INSERT INTO public.performance_optimizations (optimization_type, is_enabled, level)
VALUES 
  ('react_query', false, 'moderate'),
  ('realtime', false, 'moderate'),
  ('database', false, 'moderate')
ON CONFLICT (optimization_type) DO NOTHING;