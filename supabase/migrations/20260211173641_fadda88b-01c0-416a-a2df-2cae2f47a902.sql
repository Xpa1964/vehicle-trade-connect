
-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Anyone can view vehicle images" ON public.vehicle_images;
DROP POLICY IF EXISTS "Vehicle owners can manage images" ON public.vehicle_images;

-- Recreate as PERMISSIVE policies (default)
CREATE POLICY "Anyone can view vehicle images"
ON public.vehicle_images
FOR SELECT
USING (true);

CREATE POLICY "Vehicle owners can insert images"
ON public.vehicle_images
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM vehicles
    WHERE vehicles.id = vehicle_images.vehicle_id
    AND vehicles.seller_id = auth.uid()
  )
);

CREATE POLICY "Vehicle owners can update images"
ON public.vehicle_images
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM vehicles
    WHERE vehicles.id = vehicle_images.vehicle_id
    AND vehicles.seller_id = auth.uid()
  )
);

CREATE POLICY "Vehicle owners can delete images"
ON public.vehicle_images
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM vehicles
    WHERE vehicles.id = vehicle_images.vehicle_id
    AND vehicles.seller_id = auth.uid()
  )
);
