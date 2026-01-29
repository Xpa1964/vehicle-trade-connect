-- Create dispute-related enums and tables
DO $$ BEGIN
  CREATE TYPE public.dispute_status AS ENUM ('open', 'in_progress', 'resolved', 'closed');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE public.dispute_priority AS ENUM ('low', 'medium', 'high', 'urgent');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE public.dispute_type AS ENUM ('vehicle_issue', 'payment', 'communication', 'fraud', 'other');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Create dispute_cases table
CREATE TABLE IF NOT EXISTS public.dispute_cases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_number text UNIQUE,
  complainant_id uuid,
  defendant_id uuid,
  vehicle_id uuid REFERENCES public.vehicles(id),
  transaction_id uuid,
  dispute_type text,
  priority text DEFAULT 'medium',
  status text DEFAULT 'open',
  title text,
  description text,
  resolution text,
  resolved_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.dispute_cases ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own disputes" ON public.dispute_cases;
CREATE POLICY "Users can view own disputes" ON public.dispute_cases
  FOR SELECT USING (complainant_id = auth.uid() OR defendant_id = auth.uid() OR EXISTS (
    SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'
  ));

DROP POLICY IF EXISTS "Users can create disputes" ON public.dispute_cases;
CREATE POLICY "Users can create disputes" ON public.dispute_cases
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Create dispute_messages table
CREATE TABLE IF NOT EXISTS public.dispute_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dispute_id uuid REFERENCES public.dispute_cases(id) ON DELETE CASCADE,
  sender_id uuid,
  content text NOT NULL,
  is_internal boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.dispute_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view dispute messages" ON public.dispute_messages;
CREATE POLICY "Users can view dispute messages" ON public.dispute_messages
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM dispute_cases dc WHERE dc.id = dispute_id AND (dc.complainant_id = auth.uid() OR dc.defendant_id = auth.uid())
  ) OR EXISTS (
    SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'
  ));

DROP POLICY IF EXISTS "Users can send dispute messages" ON public.dispute_messages;
CREATE POLICY "Users can send dispute messages" ON public.dispute_messages
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Create vehicle_report_deliveries table
CREATE TABLE IF NOT EXISTS public.vehicle_report_deliveries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id uuid REFERENCES public.vehicle_report_requests(id) ON DELETE CASCADE,
  delivery_type text,
  file_url text,
  file_name text,
  notes text,
  delivered_by uuid,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.vehicle_report_deliveries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own deliveries" ON public.vehicle_report_deliveries;
CREATE POLICY "Users can view own deliveries" ON public.vehicle_report_deliveries
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM vehicle_report_requests vrr WHERE vrr.id = request_id AND vrr.user_id = auth.uid()
  ) OR EXISTS (
    SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'
  ));

DROP POLICY IF EXISTS "Admins can insert deliveries" ON public.vehicle_report_deliveries;
CREATE POLICY "Admins can insert deliveries" ON public.vehicle_report_deliveries
  FOR INSERT WITH CHECK (EXISTS (
    SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'
  ));

-- Create premium_report_batches table
CREATE TABLE IF NOT EXISTS public.premium_report_batches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_number text UNIQUE,
  report_ids jsonb DEFAULT '[]',
  status text DEFAULT 'pending',
  processed_at timestamptz,
  created_by uuid,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.premium_report_batches ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can manage batches" ON public.premium_report_batches;
CREATE POLICY "Admins can manage batches" ON public.premium_report_batches
  FOR ALL USING (EXISTS (
    SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'
  ));

-- Add missing columns to vehicle_report_requests
ALTER TABLE public.vehicle_report_requests ADD COLUMN IF NOT EXISTS vehicle_location text;
ALTER TABLE public.vehicle_report_requests ADD COLUMN IF NOT EXISTS observations text;
ALTER TABLE public.vehicle_report_requests ADD COLUMN IF NOT EXISTS base_price numeric;
ALTER TABLE public.vehicle_report_requests ADD COLUMN IF NOT EXISTS final_price numeric;

-- Create workshop_services table if not exists
CREATE TABLE IF NOT EXISTS public.workshop_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workshop_id uuid NOT NULL,
  service_name text NOT NULL,
  description text,
  price numeric,
  duration_minutes integer,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.workshop_services ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view services" ON public.workshop_services;
CREATE POLICY "Anyone can view services" ON public.workshop_services
  FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Workshops can manage own services" ON public.workshop_services;
CREATE POLICY "Workshops can manage own services" ON public.workshop_services
  FOR ALL USING (workshop_id = auth.uid());

-- Create workshop_bookings table if not exists
CREATE TABLE IF NOT EXISTS public.workshop_bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workshop_id uuid NOT NULL,
  service_id uuid REFERENCES public.workshop_services(id),
  customer_id uuid NOT NULL,
  vehicle_id uuid REFERENCES public.vehicles(id),
  scheduled_date date,
  scheduled_time time,
  status text DEFAULT 'pending',
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.workshop_bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own bookings" ON public.workshop_bookings;
CREATE POLICY "Users can view own bookings" ON public.workshop_bookings
  FOR SELECT USING (customer_id = auth.uid() OR workshop_id = auth.uid());

DROP POLICY IF EXISTS "Users can create bookings" ON public.workshop_bookings;
CREATE POLICY "Users can create bookings" ON public.workshop_bookings
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);