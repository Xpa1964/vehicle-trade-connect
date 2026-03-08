
DROP POLICY IF EXISTS "Vehicle owners can view documents" ON public.vehicle_documents;
CREATE POLICY "Authenticated users can view documents"
  ON public.vehicle_documents
  FOR SELECT
  USING (auth.uid() IS NOT NULL);
