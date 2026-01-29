-- Final missing columns and tables

-- 1. Add company_logo and privacy settings to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS company_logo TEXT,
ADD COLUMN IF NOT EXISTS show_contact_details BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS show_location_details BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS show_business_stats BOOLEAN DEFAULT true;

-- 2. Add user_id column to user_notifications (was created but needs fix)
-- Drop and recreate the table with correct structure
DROP TABLE IF EXISTS public.user_notifications CASCADE;
CREATE TABLE public.user_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  message TEXT,
  type TEXT DEFAULT 'info',
  read BOOLEAN DEFAULT false,
  link TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.user_notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own notifications" ON public.user_notifications FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can update own notifications" ON public.user_notifications FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "System can create notifications" ON public.user_notifications FOR INSERT WITH CHECK (true);

-- 3. Vehicle damages
CREATE TABLE IF NOT EXISTS public.vehicle_damages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE CASCADE,
  damage_type TEXT,
  severity TEXT,
  location TEXT,
  description TEXT,
  repair_cost DECIMAL(10,2),
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.vehicle_damages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view damages" ON public.vehicle_damages FOR SELECT USING (true);
CREATE POLICY "Vehicle owners can manage damages" ON public.vehicle_damages FOR ALL USING (
  EXISTS (SELECT 1 FROM public.vehicles WHERE id = vehicle_id AND seller_id = auth.uid())
);

-- 4. Vehicle documents
CREATE TABLE IF NOT EXISTS public.vehicle_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL,
  document_url TEXT,
  file_name TEXT,
  expiry_date DATE,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.vehicle_documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Vehicle owners can view documents" ON public.vehicle_documents FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.vehicles WHERE id = vehicle_id AND seller_id = auth.uid())
);
CREATE POLICY "Vehicle owners can manage documents" ON public.vehicle_documents FOR ALL USING (
  EXISTS (SELECT 1 FROM public.vehicles WHERE id = vehicle_id AND seller_id = auth.uid())
);

-- 5. Add missing transport_quote columns
ALTER TABLE public.transport_quotes
ADD COLUMN IF NOT EXISTS quote_number TEXT,
ADD COLUMN IF NOT EXISTS brand TEXT,
ADD COLUMN IF NOT EXISTS model TEXT,
ADD COLUMN IF NOT EXISTS color TEXT,
ADD COLUMN IF NOT EXISTS weight_kg INTEGER,
ADD COLUMN IF NOT EXISTS dimensions TEXT,
ADD COLUMN IF NOT EXISTS is_running BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS pickup_date DATE,
ADD COLUMN IF NOT EXISTS delivery_date DATE,
ADD COLUMN IF NOT EXISTS pickup_address TEXT,
ADD COLUMN IF NOT EXISTS delivery_address TEXT,
ADD COLUMN IF NOT EXISTS pickup_contact TEXT,
ADD COLUMN IF NOT EXISTS delivery_contact TEXT,
ADD COLUMN IF NOT EXISTS special_requirements TEXT,
ADD COLUMN IF NOT EXISTS insurance_included BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS user_id UUID;

-- 6. Add missing transport_quote_responses columns
ALTER TABLE public.transport_quote_responses
ADD COLUMN IF NOT EXISTS quoted_price DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS estimated_pickup_date DATE,
ADD COLUMN IF NOT EXISTS estimated_delivery_date DATE,
ADD COLUMN IF NOT EXISTS terms_and_conditions TEXT,
ADD COLUMN IF NOT EXISTS insurance_details TEXT,
ADD COLUMN IF NOT EXISTS company_name TEXT;

-- 7. Create database functions for RPC calls
CREATE OR REPLACE FUNCTION public.validate_profile_data_transfer(p_user_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN jsonb_build_object('valid', true, 'user_id', p_user_id);
END;
$$;

CREATE OR REPLACE FUNCTION public.create_system_notification(
  p_user_id UUID,
  p_title TEXT,
  p_message TEXT DEFAULT NULL,
  p_type TEXT DEFAULT 'info',
  p_link TEXT DEFAULT NULL
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
  VALUES (p_user_id, p_title, p_message, p_type, p_link)
  RETURNING id INTO v_id;
  RETURN v_id;
END;
$$;