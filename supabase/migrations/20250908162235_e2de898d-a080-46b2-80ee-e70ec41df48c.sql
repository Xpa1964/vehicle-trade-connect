-- PHASE 1: CRITICAL DATA PROTECTION - Restrict Auction/Bid Access Policies (CORRECTED)

-- Drop ALL existing policies for auctions table  
DROP POLICY IF EXISTS "Anyone can view auctions" ON public.auctions;
DROP POLICY IF EXISTS "Users can view all auctions" ON public.auctions;
DROP POLICY IF EXISTS "Only auction creator can update their auctions" ON public.auctions;
DROP POLICY IF EXISTS "Users can create auctions for their own vehicles" ON public.auctions;

-- Drop ALL existing policies for bids table
DROP POLICY IF EXISTS "Anyone can view bids" ON public.bids;
DROP POLICY IF EXISTS "Users can view all bids" ON public.bids;
DROP POLICY IF EXISTS "Users can create their own bids" ON public.bids;
DROP POLICY IF EXISTS "Users can't update bids" ON public.bids;

-- Drop ALL existing policies for vehicle_information table
DROP POLICY IF EXISTS "Allow public read access for vehicle_information" ON public.vehicle_information;
DROP POLICY IF EXISTS "Allow authenticated users to manage vehicle_information" ON public.vehicle_information;
DROP POLICY IF EXISTS "Vehicle owners can manage their vehicle information" ON public.vehicle_information;

-- Create secure policies for auctions - ONLY authenticated users can view
CREATE POLICY "Authenticated users can view auctions" 
ON public.auctions 
FOR SELECT 
TO authenticated
USING (true);

-- Auction creators can manage their own auctions
CREATE POLICY "Auction creators can manage their auctions" 
ON public.auctions 
FOR ALL 
TO authenticated
USING (auth.uid() = created_by)
WITH CHECK (auth.uid() = created_by);

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

-- Bidders can create their own bids 
CREATE POLICY "Users can create their own bids" 
ON public.bids 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = bidder_id);

-- Prevent bid updates
CREATE POLICY "Users can't update bids" 
ON public.bids 
FOR UPDATE 
TO authenticated
USING (false);

-- Secure vehicle_information table - only vehicle owners and interested parties
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

-- Authenticated users can view vehicle info for vehicles they're involved with
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