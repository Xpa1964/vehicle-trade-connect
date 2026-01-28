-- Allow public access to view vehicles (for non-authenticated users)
CREATE POLICY "Anyone can view vehicles" ON public.vehicles FOR SELECT USING (true);

-- Also allow public access to vehicle images for the gallery
CREATE POLICY "Anyone can view vehicle images for gallery" ON public.vehicle_images FOR SELECT USING (true);