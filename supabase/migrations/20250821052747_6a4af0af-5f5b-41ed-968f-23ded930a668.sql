-- Create sequence for quote numbers first
CREATE SEQUENCE IF NOT EXISTS transport_quote_number_seq START 1;

-- Create transport_quotes table
CREATE TABLE public.transport_quotes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  
  -- Vehicle Information
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  color TEXT NOT NULL,
  version TEXT,
  license_plate TEXT NOT NULL,
  chassis_number TEXT NOT NULL,
  
  -- Transport Details - Origin
  origin_address TEXT NOT NULL,
  origin_city TEXT NOT NULL,
  origin_country TEXT NOT NULL,
  
  -- Transport Details - Destination
  destination_address TEXT NOT NULL,
  destination_city TEXT NOT NULL,
  destination_country TEXT NOT NULL,
  
  -- Contact Information - Origin
  origin_contact TEXT NOT NULL,
  origin_email TEXT NOT NULL,
  origin_phone TEXT NOT NULL,
  
  -- Contact Information - Destination
  destination_contact TEXT NOT NULL,
  destination_email TEXT NOT NULL,
  destination_phone TEXT NOT NULL,
  
  -- Transport Date
  transport_date DATE NOT NULL,
  
  -- Status and metadata
  status TEXT NOT NULL DEFAULT 'pending', -- pending, quoted, accepted, rejected, completed
  quote_number TEXT NOT NULL DEFAULT 'TQ-' || EXTRACT(YEAR FROM NOW()) || '-' || LPAD(NEXTVAL('transport_quote_number_seq')::TEXT, 6, '0'),
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create transport_quote_responses table
CREATE TABLE public.transport_quote_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  transport_quote_id UUID NOT NULL REFERENCES public.transport_quotes(id) ON DELETE CASCADE,
  admin_user_id UUID NOT NULL,
  
  -- Quote details
  quoted_price DECIMAL(10,2),
  estimated_pickup_date DATE,
  estimated_delivery_date DATE,
  terms_and_conditions TEXT,
  admin_notes TEXT,
  
  -- Response status
  response_status TEXT NOT NULL DEFAULT 'quoted', -- quoted, revised, final
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.transport_quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transport_quote_responses ENABLE ROW LEVEL SECURITY;

-- RLS Policies for transport_quotes
CREATE POLICY "Users can view their own transport quotes" 
ON public.transport_quotes 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own transport quotes" 
ON public.transport_quotes 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own transport quotes" 
ON public.transport_quotes 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all transport quotes" 
ON public.transport_quotes 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.user_roles 
  WHERE user_id = auth.uid() AND role = 'admin'::app_role
));

CREATE POLICY "Admins can update transport quote status" 
ON public.transport_quotes 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM public.user_roles 
  WHERE user_id = auth.uid() AND role = 'admin'::app_role
));

-- RLS Policies for transport_quote_responses
CREATE POLICY "Users can view responses to their quotes" 
ON public.transport_quote_responses 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.transport_quotes tq 
  WHERE tq.id = transport_quote_responses.transport_quote_id 
  AND tq.user_id = auth.uid()
));

CREATE POLICY "Admins can manage all quote responses" 
ON public.transport_quote_responses 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.user_roles 
  WHERE user_id = auth.uid() AND role = 'admin'::app_role
));

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_transport_quote_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_transport_quotes_timestamp
BEFORE UPDATE ON public.transport_quotes
FOR EACH ROW
EXECUTE FUNCTION public.update_transport_quote_timestamp();

CREATE TRIGGER update_transport_quote_responses_timestamp
BEFORE UPDATE ON public.transport_quote_responses
FOR EACH ROW
EXECUTE FUNCTION public.update_transport_quote_timestamp();