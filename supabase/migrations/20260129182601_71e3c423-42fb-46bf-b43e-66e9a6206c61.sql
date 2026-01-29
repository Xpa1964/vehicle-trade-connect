-- Add missing columns to vehicle_report_requests table
ALTER TABLE public.vehicle_report_requests ADD COLUMN IF NOT EXISTS vehicle_plate text;
ALTER TABLE public.vehicle_report_requests ADD COLUMN IF NOT EXISTS vehicle_brand text;
ALTER TABLE public.vehicle_report_requests ADD COLUMN IF NOT EXISTS vehicle_model text;
ALTER TABLE public.vehicle_report_requests ADD COLUMN IF NOT EXISTS vehicle_year integer;

-- Add transport_quote_id to transport_quote_responses
ALTER TABLE public.transport_quote_responses ADD COLUMN IF NOT EXISTS transport_quote_id uuid REFERENCES public.transport_quotes(id);

-- Add operations_breakdown to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS operations_breakdown jsonb DEFAULT '{}'::jsonb;