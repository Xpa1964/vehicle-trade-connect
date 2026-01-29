-- Final fixes for remaining issues

-- 1. Add remaining transport_quotes columns
ALTER TABLE public.transport_quotes
ADD COLUMN IF NOT EXISTS origin_contact TEXT,
ADD COLUMN IF NOT EXISTS origin_phone TEXT,
ADD COLUMN IF NOT EXISTS origin_email TEXT,
ADD COLUMN IF NOT EXISTS destination_contact TEXT,
ADD COLUMN IF NOT EXISTS destination_phone TEXT,
ADD COLUMN IF NOT EXISTS destination_email TEXT,
ADD COLUMN IF NOT EXISTS transport_date DATE;

-- 2. Add vehicle_metadata columns
ALTER TABLE public.vehicle_metadata
ADD COLUMN IF NOT EXISTS mileage_unit TEXT DEFAULT 'km',
ADD COLUMN IF NOT EXISTS units INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS iva_status TEXT DEFAULT 'included',
ADD COLUMN IF NOT EXISTS coc_status BOOLEAN DEFAULT false;

-- 3. Vehicle information table
CREATE TABLE IF NOT EXISTS public.vehicle_information (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE CASCADE UNIQUE,
  technical_specs JSONB DEFAULT '{}',
  additional_notes TEXT,
  maintenance_history JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.vehicle_information ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view vehicle info" ON public.vehicle_information FOR SELECT USING (true);
CREATE POLICY "Vehicle owners can manage info" ON public.vehicle_information FOR ALL USING (
  EXISTS (SELECT 1 FROM public.vehicles WHERE id = vehicle_id AND seller_id = auth.uid())
);

-- 4. Add user_id to vehicles (if not exists)
ALTER TABLE public.vehicles
ADD COLUMN IF NOT EXISTS user_id UUID;