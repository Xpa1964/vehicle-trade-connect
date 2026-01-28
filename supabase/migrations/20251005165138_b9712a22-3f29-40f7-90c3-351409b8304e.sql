-- Create function to check user roles (if not exists)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create enums only if they don't exist
DO $$ BEGIN
  CREATE TYPE report_type AS ENUM ('basic', 'technical', 'premium');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE report_request_status AS ENUM ('draft', 'pending', 'budgeted', 'paid', 'in_process', 'delivered', 'rejected');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE payment_method AS ENUM ('card', 'transfer');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Table: vehicle_report_requests
CREATE TABLE IF NOT EXISTS public.vehicle_report_requests (
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
CREATE TABLE IF NOT EXISTS public.vehicle_report_payments (
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

-- Table: vehicle_report_deliveries (soporta PDF y archivos de audio)
CREATE TABLE IF NOT EXISTS public.vehicle_report_deliveries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL REFERENCES public.vehicle_report_requests(id) ON DELETE CASCADE,
  file_name VARCHAR(255) NOT NULL,
  file_type VARCHAR(50) NOT NULL,
  file_url TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  uploaded_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Table: premium_report_batches
CREATE TABLE IF NOT EXISTS public.premium_report_batches (
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

-- Enable RLS
ALTER TABLE public.vehicle_report_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicle_report_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicle_report_deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.premium_report_batches ENABLE ROW LEVEL SECURITY;

-- RLS Policies for vehicle_report_requests
DROP POLICY IF EXISTS "Users can view their own report requests" ON public.vehicle_report_requests;
CREATE POLICY "Users can view their own report requests"
  ON public.vehicle_report_requests FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own report requests" ON public.vehicle_report_requests;
CREATE POLICY "Users can create their own report requests"
  ON public.vehicle_report_requests FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own draft requests" ON public.vehicle_report_requests;
CREATE POLICY "Users can update their own draft requests"
  ON public.vehicle_report_requests FOR UPDATE
  USING (auth.uid() = user_id AND status = 'draft');

DROP POLICY IF EXISTS "Admins can view all report requests" ON public.vehicle_report_requests;
CREATE POLICY "Admins can view all report requests"
  ON public.vehicle_report_requests FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can update all report requests" ON public.vehicle_report_requests;
CREATE POLICY "Admins can update all report requests"
  ON public.vehicle_report_requests FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for vehicle_report_payments
DROP POLICY IF EXISTS "Users can view their own payments" ON public.vehicle_report_payments;
CREATE POLICY "Users can view their own payments"
  ON public.vehicle_report_payments FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own payments" ON public.vehicle_report_payments;
CREATE POLICY "Users can create their own payments"
  ON public.vehicle_report_payments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all payments" ON public.vehicle_report_payments;
CREATE POLICY "Admins can view all payments"
  ON public.vehicle_report_payments FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can update payments" ON public.vehicle_report_payments;
CREATE POLICY "Admins can update payments"
  ON public.vehicle_report_payments FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for vehicle_report_deliveries
DROP POLICY IF EXISTS "Users can view deliveries for their requests" ON public.vehicle_report_deliveries;
CREATE POLICY "Users can view deliveries for their requests"
  ON public.vehicle_report_deliveries FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.vehicle_report_requests
      WHERE id = vehicle_report_deliveries.request_id
      AND user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Admins can manage all deliveries" ON public.vehicle_report_deliveries;
CREATE POLICY "Admins can manage all deliveries"
  ON public.vehicle_report_deliveries FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for premium_report_batches
DROP POLICY IF EXISTS "Admins can manage premium batches" ON public.premium_report_batches;
CREATE POLICY "Admins can manage premium batches"
  ON public.premium_report_batches FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_report_requests_user_id ON public.vehicle_report_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_report_requests_status ON public.vehicle_report_requests(status);
CREATE INDEX IF NOT EXISTS idx_report_requests_type ON public.vehicle_report_requests(report_type);
CREATE INDEX IF NOT EXISTS idx_report_payments_request_id ON public.vehicle_report_payments(request_id);
CREATE INDEX IF NOT EXISTS idx_report_deliveries_request_id ON public.vehicle_report_deliveries(request_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_report_request_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_report_request_timestamp ON public.vehicle_report_requests;
CREATE TRIGGER update_report_request_timestamp
BEFORE UPDATE ON public.vehicle_report_requests
FOR EACH ROW
EXECUTE FUNCTION update_report_request_timestamp();

DROP TRIGGER IF EXISTS update_premium_batch_timestamp ON public.premium_report_batches;
CREATE TRIGGER update_premium_batch_timestamp
BEFORE UPDATE ON public.premium_report_batches
FOR EACH ROW
EXECUTE FUNCTION update_report_request_timestamp();