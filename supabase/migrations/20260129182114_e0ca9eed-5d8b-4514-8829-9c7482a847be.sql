-- Add missing columns to vehicles table
ALTER TABLE public.vehicles 
ADD COLUMN IF NOT EXISTS registration_date date,
ADD COLUMN IF NOT EXISTS vehicle_type text,
ADD COLUMN IF NOT EXISTS transaction_type text DEFAULT 'national',
ADD COLUMN IF NOT EXISTS engine_power integer;

-- Add missing columns to vehicle_information table
ALTER TABLE public.vehicle_information
ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT now();

-- Add missing columns to transport_quote_responses
ALTER TABLE public.transport_quote_responses
ADD COLUMN IF NOT EXISTS admin_user_id uuid;

-- Update user_notifications to ensure user_id is recognized
-- The column already exists but TypeScript has issues with insert
-- This is handled at code level

-- Add missing columns to vehicle_equipment for equipment_id reference
ALTER TABLE public.vehicle_equipment
ADD COLUMN IF NOT EXISTS equipment_id uuid REFERENCES public.equipment_items(id);

-- Create user_vehicle_visits table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.user_vehicle_visits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  vehicle_id uuid REFERENCES public.vehicles(id) ON DELETE CASCADE,
  visited_at timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_vehicle_visits ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_vehicle_visits
CREATE POLICY "Users can manage own visits" ON public.user_vehicle_visits
FOR ALL USING (user_id = auth.uid());

-- Create vehicle_report_requests table if missing
CREATE TABLE IF NOT EXISTS public.vehicle_report_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  vehicle_id uuid REFERENCES public.vehicles(id),
  status text DEFAULT 'pending',
  report_type text DEFAULT 'standard',
  budget_amount numeric,
  budget_breakdown jsonb,
  budget_notes text,
  estimated_delivery_date timestamp with time zone,
  budget_sent_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.vehicle_report_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own report requests" ON public.vehicle_report_requests
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create report requests" ON public.vehicle_report_requests
FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can manage all report requests" ON public.vehicle_report_requests
FOR ALL USING (
  EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'admin')
);