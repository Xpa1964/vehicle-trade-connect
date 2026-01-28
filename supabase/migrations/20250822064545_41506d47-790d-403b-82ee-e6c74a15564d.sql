-- EMERGENCY: Remove the dangerous policy that allows anyone to view vehicle documents
DROP POLICY IF EXISTS "Anyone can view vehicle documents" ON public.vehicle_documents;

-- Also remove any duplicate policies to clean up
DROP POLICY IF EXISTS "Vehicle owners can add documents" ON public.vehicle_documents;
DROP POLICY IF EXISTS "Vehicle owners can delete documents" ON public.vehicle_documents;