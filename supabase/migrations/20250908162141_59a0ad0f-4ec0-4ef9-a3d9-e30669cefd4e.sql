-- PHASE 1: CRITICAL DATA PROTECTION - Restrict Auction/Bid Access Policies

-- Drop existing public policies for auctions table
DROP POLICY IF EXISTS "Anyone can view auctions" ON public.auctions;
DROP POLICY IF EXISTS "Users can view all auctions" ON public.auctions;

-- Create secure policies for auctions - only authenticated users can view
CREATE POLICY "Authenticated users can view auctions" 
ON public.auctions 
FOR SELECT 
TO authenticated
USING (true);

-- Auction creators can view their own auctions
CREATE POLICY "Auction creators can manage their auctions" 
ON public.auctions 
FOR ALL 
TO authenticated
USING (auth.uid() = created_by)
WITH CHECK (auth.uid() = created_by);

-- Auction participants (bidders) can view auctions they bid on
CREATE POLICY "Auction participants can view auctions they bid on" 
ON public.auctions 
FOR SELECT 
TO authenticated
USING (
  id IN (
    SELECT auction_id 
    FROM public.bids 
    WHERE bidder_id = auth.uid()
  )
);

-- Drop existing public policies for bids table
DROP POLICY IF EXISTS "Anyone can view bids" ON public.bids;
DROP POLICY IF EXISTS "Users can view all bids" ON public.bids;

-- Create secure policies for bids - only auction participants can view
CREATE POLICY "Auction creators can view bids on their auctions" 
ON public.bids 
FOR SELECT 
TO authenticated
USING (
  auction_id IN (
    SELECT id 
    FROM public.auctions 
    WHERE created_by = auth.uid()
  )
);

-- Bidders can view their own bids
CREATE POLICY "Bidders can view their own bids" 
ON public.bids 
FOR SELECT 
TO authenticated
USING (bidder_id = auth.uid());

-- Bidders can create their own bids (keep existing policy)
-- Users can create their own bids policy already exists

-- Secure vehicle_information table - remove public access
DROP POLICY IF EXISTS "Allow public read access for vehicle_information" ON public.vehicle_information;

-- Only vehicle owners can view their vehicle information
CREATE POLICY "Vehicle owners can view their vehicle information" 
ON public.vehicle_information 
FOR SELECT 
TO authenticated
USING (
  vehicle_id IN (
    SELECT id 
    FROM public.vehicles 
    WHERE user_id = auth.uid()
  )
);

-- Authenticated users can view vehicle information for vehicles they're interested in (through conversations/auctions)
CREATE POLICY "Users can view vehicle info for vehicles they're involved with" 
ON public.vehicle_information 
FOR SELECT 
TO authenticated
USING (
  vehicle_id IN (
    -- Vehicles in conversations user is part of
    SELECT c.vehicle_id 
    FROM public.conversations c 
    WHERE (c.seller_id = auth.uid() OR c.buyer_id = auth.uid())
    AND c.vehicle_id IS NOT NULL
    
    UNION
    
    -- Vehicles in auctions user created or bid on
    SELECT a.vehicle_id 
    FROM public.auctions a 
    WHERE a.created_by = auth.uid()
    
    UNION
    
    SELECT a.vehicle_id 
    FROM public.auctions a 
    JOIN public.bids b ON a.id = b.auction_id 
    WHERE b.bidder_id = auth.uid()
  )
);

-- Vehicle owners can manage their vehicle information
CREATE POLICY "Vehicle owners can manage their vehicle information" 
ON public.vehicle_information 
FOR ALL 
TO authenticated
USING (
  vehicle_id IN (
    SELECT id 
    FROM public.vehicles 
    WHERE user_id = auth.uid()
  )
)
WITH CHECK (
  vehicle_id IN (
    SELECT id 
    FROM public.vehicles 
    WHERE user_id = auth.uid()
  )
);