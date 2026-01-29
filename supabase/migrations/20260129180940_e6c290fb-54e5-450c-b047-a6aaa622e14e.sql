-- Last batch of missing tables and columns

-- 1. Add remaining columns to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS registration_date TIMESTAMPTZ DEFAULT now(),
ADD COLUMN IF NOT EXISTS total_operations INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS rating DECIMAL(3,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS verified BOOLEAN DEFAULT false;

-- 2. Vehicle equipment
CREATE TABLE IF NOT EXISTS public.vehicle_equipment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT,
  is_standard BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.vehicle_equipment ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view vehicle equipment" ON public.vehicle_equipment FOR SELECT USING (true);
CREATE POLICY "Vehicle owners can manage equipment" ON public.vehicle_equipment FOR ALL USING (
  EXISTS (SELECT 1 FROM public.vehicles WHERE id = vehicle_id AND seller_id = auth.uid())
);

-- 3. Vehicle metadata
CREATE TABLE IF NOT EXISTS public.vehicle_metadata (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE CASCADE UNIQUE,
  first_registration_date DATE,
  itv_expiry DATE,
  last_service_date DATE,
  next_service_km INTEGER,
  insurance_company TEXT,
  financing_available BOOLEAN DEFAULT false,
  warranty_details TEXT,
  additional_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.vehicle_metadata ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view vehicle metadata" ON public.vehicle_metadata FOR SELECT USING (true);
CREATE POLICY "Vehicle owners can manage metadata" ON public.vehicle_metadata FOR ALL USING (
  EXISTS (SELECT 1 FROM public.vehicles WHERE id = vehicle_id AND seller_id = auth.uid())
);

-- 4. Add mileage_unit and other missing columns to vehicles
ALTER TABLE public.vehicles
ADD COLUMN IF NOT EXISTS mileage_unit TEXT DEFAULT 'km',
ADD COLUMN IF NOT EXISTS origin_city TEXT,
ADD COLUMN IF NOT EXISTS origin_country TEXT DEFAULT 'España',
ADD COLUMN IF NOT EXISTS destination_city TEXT,
ADD COLUMN IF NOT EXISTS destination_country TEXT,
ADD COLUMN IF NOT EXISTS first_registration_date DATE,
ADD COLUMN IF NOT EXISTS itv_expiry DATE,
ADD COLUMN IF NOT EXISTS needs_repairs BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS reserved BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS sold BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS sold_date TIMESTAMPTZ;

-- 5. Add remaining transport_quote columns
ALTER TABLE public.transport_quotes
ADD COLUMN IF NOT EXISTS license_plate TEXT,
ADD COLUMN IF NOT EXISTS origin_city TEXT,
ADD COLUMN IF NOT EXISTS origin_country TEXT DEFAULT 'España',
ADD COLUMN IF NOT EXISTS destination_city TEXT,
ADD COLUMN IF NOT EXISTS destination_country TEXT,
ADD COLUMN IF NOT EXISTS contact_name TEXT,
ADD COLUMN IF NOT EXISTS contact_phone TEXT,
ADD COLUMN IF NOT EXISTS contact_email TEXT,
ADD COLUMN IF NOT EXISTS vehicle_year INTEGER,
ADD COLUMN IF NOT EXISTS vehicle_condition TEXT;

-- 6. Add missing transport_quote_responses columns
ALTER TABLE public.transport_quote_responses
ADD COLUMN IF NOT EXISTS admin_notes TEXT,
ADD COLUMN IF NOT EXISTS response_status TEXT DEFAULT 'pending';

-- 7. Update validate_profile_data_transfer function to accept registration_id
DROP FUNCTION IF EXISTS public.validate_profile_data_transfer(UUID);
CREATE OR REPLACE FUNCTION public.validate_profile_data_transfer(p_user_id UUID, p_registration_id UUID DEFAULT NULL)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN jsonb_build_object('valid', true, 'user_id', p_user_id, 'registration_id', p_registration_id);
END;
$$;

-- 8. Update create_system_notification to accept subject
DROP FUNCTION IF EXISTS public.create_system_notification(UUID, TEXT, TEXT, TEXT, TEXT);
CREATE OR REPLACE FUNCTION public.create_system_notification(
  p_user_id UUID,
  p_title TEXT,
  p_message TEXT DEFAULT NULL,
  p_type TEXT DEFAULT 'info',
  p_link TEXT DEFAULT NULL,
  p_subject TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id UUID;
BEGIN
  INSERT INTO public.user_notifications (user_id, title, message, type, link)
  VALUES (p_user_id, COALESCE(p_subject, p_title), p_message, p_type, p_link)
  RETURNING id INTO v_id;
  RETURN v_id;
END;
$$;

-- 9. Fix search_path for update_updated_at_column
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Recreate triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_user_roles_updated_at BEFORE UPDATE ON public.user_roles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_vehicles_updated_at BEFORE UPDATE ON public.vehicles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON public.conversations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();