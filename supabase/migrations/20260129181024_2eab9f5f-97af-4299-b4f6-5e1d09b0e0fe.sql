-- Equipment tables and remaining fixes

-- 1. Equipment categories
CREATE TABLE IF NOT EXISTS public.equipment_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.equipment_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view equipment categories" ON public.equipment_categories FOR SELECT USING (true);
CREATE POLICY "Admins can manage categories" ON public.equipment_categories FOR ALL USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

-- 2. Equipment items
CREATE TABLE IF NOT EXISTS public.equipment_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category_id UUID REFERENCES public.equipment_categories(id) ON DELETE CASCADE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.equipment_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view equipment items" ON public.equipment_items FOR SELECT USING (true);
CREATE POLICY "Admins can manage items" ON public.equipment_items FOR ALL USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

-- 3. Add transport_quote_id to transport_quote_responses
-- First check if column exists before adding
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_schema = 'public' 
                 AND table_name = 'transport_quote_responses' 
                 AND column_name = 'transport_quote_id') THEN
    ALTER TABLE public.transport_quote_responses ADD COLUMN transport_quote_id UUID REFERENCES public.transport_quotes(id) ON DELETE CASCADE;
  END IF;
END $$;