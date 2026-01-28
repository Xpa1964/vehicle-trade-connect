-- Fix critical security vulnerability in vehicle_images table
-- Remove overly permissive policies that allow public access to all vehicle images

-- Drop the dangerous public policies that allow anyone to view all vehicle images
DROP POLICY "Anyone can view vehicle images" ON public.vehicle_images;
DROP POLICY "Anyone can view vehicle images for gallery" ON public.vehicle_images;

-- Create new restrictive policies for SELECT operations
-- Allow authenticated users to view images for vehicles that are publicly available or they own
CREATE POLICY "Authenticated users can view available vehicle images" 
ON public.vehicle_images 
FOR SELECT 
TO authenticated
USING (
  vehicle_id IN (
    -- Vehicle owners can always see their own vehicle images
    SELECT vehicles.id 
    FROM vehicles 
    WHERE vehicles.user_id = auth.uid()
    UNION
    -- Everyone can see images for vehicles with public status
    SELECT vehicles.id 
    FROM vehicles 
    WHERE vehicles.status IN ('available', 'sold', 'reserved')
    UNION
    -- Users involved in conversations can see the vehicle images
    SELECT conversations.vehicle_id 
    FROM conversations 
    WHERE (conversations.seller_id = auth.uid() OR conversations.buyer_id = auth.uid())
      AND conversations.vehicle_id IS NOT NULL
    UNION
    -- Users involved in auctions can see the vehicle images
    SELECT auctions.vehicle_id
    FROM auctions
    WHERE auctions.created_by = auth.uid()
    UNION
    SELECT auctions.vehicle_id
    FROM auctions
    JOIN bids ON auctions.id = bids.auction_id
    WHERE bids.bidder_id = auth.uid()
  )
);

-- Create a separate policy for admins to view all images
CREATE POLICY "Admins can view all vehicle images"
ON public.vehicle_images
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 
    FROM user_roles 
    WHERE user_roles.user_id = auth.uid() 
      AND user_roles.role = 'admin'::app_role
  )
);