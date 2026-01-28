-- Remove any conflicting policies that allow public access to vehicle documents
DROP POLICY IF EXISTS "Anyone can view vehicle documents" ON public.vehicle_documents;
DROP POLICY IF EXISTS "Vehicle owners can delete documents" ON public.vehicle_documents;

-- Ensure only the secure policies remain active
-- These are the correct policies that should be enforced:
-- 1. "Vehicle owners can view their own documents" 
-- 2. "Vehicle owners can insert documents for their vehicles"
-- 3. "Vehicle owners can delete their own documents"
-- 4. "Admins can view all vehicle documents"
-- 5. "Admins can manage all vehicle documents"

-- Add policy for authenticated users to view documents only for vehicles they have access to
CREATE POLICY "Users can view documents for accessible vehicles" 
ON public.vehicle_documents 
FOR SELECT 
USING (
  -- Vehicle owner can see their documents
  EXISTS (
    SELECT 1 FROM public.vehicles 
    WHERE vehicles.id = vehicle_documents.vehicle_id 
    AND vehicles.user_id = auth.uid()
  )
  OR
  -- Admins can see all documents
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_roles.user_id = auth.uid() 
    AND user_roles.role = 'admin'::app_role
  )
);