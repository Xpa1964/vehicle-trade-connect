-- Create vehicle_documents table if it doesn't exist and implement proper RLS policies
CREATE TABLE IF NOT EXISTS public.vehicle_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vehicle_id UUID NOT NULL,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  file_url TEXT NOT NULL,
  uploaded_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT vehicle_documents_vehicle_id_fkey FOREIGN KEY (vehicle_id) REFERENCES public.vehicles(id) ON DELETE CASCADE
);

-- Enable Row Level Security on vehicle_documents
ALTER TABLE public.vehicle_documents ENABLE ROW LEVEL SECURITY;

-- Policy 1: Vehicle owners can view their own vehicle documents
CREATE POLICY "Vehicle owners can view their own documents" 
ON public.vehicle_documents 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.vehicles 
    WHERE vehicles.id = vehicle_documents.vehicle_id 
    AND vehicles.user_id = auth.uid()
  )
);

-- Policy 2: Vehicle owners can insert documents for their own vehicles
CREATE POLICY "Vehicle owners can insert documents for their vehicles" 
ON public.vehicle_documents 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.vehicles 
    WHERE vehicles.id = vehicle_documents.vehicle_id 
    AND vehicles.user_id = auth.uid()
  )
  AND auth.uid() = uploaded_by
);

-- Policy 3: Vehicle owners can delete their own vehicle documents
CREATE POLICY "Vehicle owners can delete their own documents" 
ON public.vehicle_documents 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.vehicles 
    WHERE vehicles.id = vehicle_documents.vehicle_id 
    AND vehicles.user_id = auth.uid()
  )
);

-- Policy 4: Admins can view all vehicle documents
CREATE POLICY "Admins can view all vehicle documents" 
ON public.vehicle_documents 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_roles.user_id = auth.uid() 
    AND user_roles.role = 'admin'::app_role
  )
);

-- Policy 5: Admins can manage all vehicle documents
CREATE POLICY "Admins can manage all vehicle documents" 
ON public.vehicle_documents 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_roles.user_id = auth.uid() 
    AND user_roles.role = 'admin'::app_role
  )
);

-- Create trigger for updating timestamps
CREATE OR REPLACE FUNCTION public.update_vehicle_documents_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_vehicle_documents_updated_at
  BEFORE UPDATE ON public.vehicle_documents
  FOR EACH ROW
  EXECUTE FUNCTION public.update_vehicle_documents_updated_at();