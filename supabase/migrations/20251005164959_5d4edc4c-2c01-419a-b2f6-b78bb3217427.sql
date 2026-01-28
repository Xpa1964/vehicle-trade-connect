-- Create function has_role if it doesn't exist
CREATE OR REPLACE FUNCTION public.has_role(p_role text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM public.user_roles
    WHERE user_id = auth.uid() AND role::text = p_role
  );
END;
$$;

-- Create enum for report types
CREATE TYPE report_type AS ENUM ('basic', 'technical', 'premium');

-- Create enum for report request status
CREATE TYPE report_request_status AS ENUM ('draft', 'pending', 'budgeted', 'paid', 'in_process', 'delivered', 'rejected');

-- Create enum for payment method
CREATE TYPE payment_method AS ENUM ('card', 'transfer');

-- Create enum for payment status
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');

-- Table: vehicle_report_requests
CREATE TABLE public.vehicle_report_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  vehicle_plate VARCHAR(20) NOT NULL,
  vehicle_brand VARCHAR(100),
  vehicle_model VARCHAR(100),
  vehicle_year INTEGER,
  vehicle_location VARCHAR(255),
  report_type report_type NOT NULL,
  status report_request_status NOT NULL DEFAULT 'draft',
  observations TEXT,
  base_price NUMERIC(10,2),
  final_price NUMERIC(10,2),
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Table: vehicle_report_payments
CREATE TABLE public.vehicle_report_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL REFERENCES public.vehicle_report_requests(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  payment_method payment_method NOT NULL,
  payment_status payment_status NOT NULL DEFAULT 'pending',
  stripe_payment_intent_id VARCHAR(255),
  transfer_reference VARCHAR(100),
  payment_proof_url TEXT,
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Table: vehicle_report_deliveries (supports PDF and audio files)
CREATE TABLE public.vehicle_report_deliveries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL REFERENCES public.vehicle_report_requests(id) ON DELETE CASCADE,
  file_name VARCHAR(255) NOT NULL,
  file_type VARCHAR(50) NOT NULL, -- pdf, mp3, wav, m4a, etc.
  file_url TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  uploaded_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Table: premium_report_batches
CREATE TABLE public.premium_report_batches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_number VARCHAR(50) NOT NULL UNIQUE,
  request_ids UUID[] NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  scheduled_date TIMESTAMP WITH TIME ZONE,
  completed_date TIMESTAMP WITH TIME ZONE,
  inspector_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create storage bucket for report files if not exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('vehicle-reports', 'vehicle-reports', false)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS
ALTER TABLE public.vehicle_report_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicle_report_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicle_report_deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.premium_report_batches ENABLE ROW LEVEL SECURITY;

-- RLS Policies for vehicle_report_requests
CREATE POLICY "Users can view their own report requests"
  ON public.vehicle_report_requests FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own report requests"
  ON public.vehicle_report_requests FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own draft requests"
  ON public.vehicle_report_requests FOR UPDATE
  USING (auth.uid() = user_id AND status = 'draft');

CREATE POLICY "Admins can view all report requests"
  ON public.vehicle_report_requests FOR SELECT
  USING (public.has_role('admin'));

CREATE POLICY "Admins can update all report requests"
  ON public.vehicle_report_requests FOR UPDATE
  USING (public.has_role('admin'));

-- RLS Policies for vehicle_report_payments
CREATE POLICY "Users can view their own payments"
  ON public.vehicle_report_payments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own payments"
  ON public.vehicle_report_payments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all payments"
  ON public.vehicle_report_payments FOR SELECT
  USING (public.has_role('admin'));

CREATE POLICY "Admins can update payments"
  ON public.vehicle_report_payments FOR UPDATE
  USING (public.has_role('admin'));

-- RLS Policies for vehicle_report_deliveries
CREATE POLICY "Users can view deliveries for their requests"
  ON public.vehicle_report_deliveries FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.vehicle_report_requests
      WHERE id = vehicle_report_deliveries.request_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all deliveries"
  ON public.vehicle_report_deliveries FOR ALL
  USING (public.has_role('admin'));

-- RLS Policies for premium_report_batches
CREATE POLICY "Admins can manage premium batches"
  ON public.premium_report_batches FOR ALL
  USING (public.has_role('admin'));

-- Storage RLS policies for vehicle-reports bucket
CREATE POLICY "Users can view their own report files"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'vehicle-reports' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Admins can upload report files"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'vehicle-reports' AND
    public.has_role('admin')
  );

CREATE POLICY "Admins can manage all report files"
  ON storage.objects FOR ALL
  USING (
    bucket_id = 'vehicle-reports' AND
    public.has_role('admin')
  );

-- Indexes for better performance
CREATE INDEX idx_report_requests_user_id ON public.vehicle_report_requests(user_id);
CREATE INDEX idx_report_requests_status ON public.vehicle_report_requests(status);
CREATE INDEX idx_report_requests_type ON public.vehicle_report_requests(report_type);
CREATE INDEX idx_report_payments_request_id ON public.vehicle_report_payments(request_id);
CREATE INDEX idx_report_deliveries_request_id ON public.vehicle_report_deliveries(request_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_report_request_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_report_request_timestamp
BEFORE UPDATE ON public.vehicle_report_requests
FOR EACH ROW
EXECUTE FUNCTION update_report_request_timestamp();

CREATE TRIGGER update_premium_batch_timestamp
BEFORE UPDATE ON public.premium_report_batches
FOR EACH ROW
EXECUTE FUNCTION update_report_request_timestamp();