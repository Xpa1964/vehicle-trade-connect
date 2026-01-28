-- Drop the overly permissive policy
DROP POLICY "Authenticated users can view profiles" ON public.profiles;

-- Create more restrictive and secure policies for profiles table

-- 1. Users can view their own profile (essential for profile management)
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT 
  USING (auth.uid() = id);

-- 2. Users can view profiles of vehicle owners when viewing vehicles
CREATE POLICY "Users can view vehicle owner profiles" ON public.profiles
  FOR SELECT 
  USING (
    id IN (
      SELECT user_id FROM public.vehicles 
      WHERE status IN ('available', 'reserved', 'sold')
    )
  );

-- 3. Users can view profiles of conversation participants
CREATE POLICY "Users can view conversation participant profiles" ON public.profiles
  FOR SELECT 
  USING (
    id IN (
      SELECT DISTINCT seller_id FROM public.conversations 
      WHERE buyer_id = auth.uid() AND seller_id IS NOT NULL
      UNION
      SELECT DISTINCT buyer_id FROM public.conversations 
      WHERE seller_id = auth.uid()
    )
  );

-- 4. Users can view profiles of auction creators and bidders for auctions they participate in
CREATE POLICY "Users can view auction participant profiles" ON public.profiles
  FOR SELECT 
  USING (
    id IN (
      -- Auction creators for auctions the user has bid on
      SELECT DISTINCT a.created_by FROM public.auctions a
      JOIN public.bids b ON a.id = b.auction_id
      WHERE b.bidder_id = auth.uid()
      UNION
      -- Other bidders for auctions the user created
      SELECT DISTINCT b.bidder_id FROM public.bids b
      JOIN public.auctions a ON b.auction_id = a.id
      WHERE a.created_by = auth.uid()
      UNION
      -- Winners of auctions the user participated in
      SELECT DISTINCT a.winner_id FROM public.auctions a
      WHERE a.created_by = auth.uid() OR a.id IN (
        SELECT auction_id FROM public.bids WHERE bidder_id = auth.uid()
      )
    )
  );

-- 5. Users can view profiles involved in their transactions
CREATE POLICY "Users can view transaction participant profiles" ON public.profiles
  FOR SELECT 
  USING (
    id IN (
      SELECT DISTINCT seller_id FROM public.transactions 
      WHERE buyer_id = auth.uid() AND seller_id IS NOT NULL
      UNION
      SELECT DISTINCT buyer_id FROM public.transactions 
      WHERE seller_id = auth.uid() AND buyer_id IS NOT NULL
    )
  );

-- 6. Users can view profiles they have rated or who have rated them
CREATE POLICY "Users can view rating participant profiles" ON public.profiles
  FOR SELECT 
  USING (
    id IN (
      SELECT DISTINCT to_user_id FROM public.ratings 
      WHERE from_user_id = auth.uid()
      UNION
      SELECT DISTINCT from_user_id FROM public.ratings 
      WHERE to_user_id = auth.uid()
    )
  );

-- 7. Admins can view all profiles (for administrative purposes)
CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'::app_role
    )
  );

-- 8. Keep existing policies for INSERT, UPDATE, DELETE unchanged
-- Users can insert their own profile
-- Users can update their own profile  
-- Users can delete their own profile
-- These are already properly secured

-- Add a helper function to check if a user can view a specific profile
CREATE OR REPLACE FUNCTION public.can_view_profile(profile_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
DECLARE
  current_user_id uuid;
BEGIN
  current_user_id := auth.uid();
  
  -- User can always view their own profile
  IF current_user_id = profile_user_id THEN
    RETURN true;
  END IF;
  
  -- Admins can view all profiles
  IF EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = current_user_id AND role = 'admin'::app_role
  ) THEN
    RETURN true;
  END IF;
  
  -- Check if users are connected through vehicles, conversations, auctions, transactions, or ratings
  IF EXISTS (
    -- Vehicle relationships
    SELECT 1 FROM public.vehicles v
    WHERE v.user_id = profile_user_id AND v.status IN ('available', 'reserved', 'sold')
    UNION
    -- Conversation relationships
    SELECT 1 FROM public.conversations c
    WHERE (c.seller_id = profile_user_id AND c.buyer_id = current_user_id)
       OR (c.buyer_id = profile_user_id AND c.seller_id = current_user_id)
    UNION
    -- Auction relationships
    SELECT 1 FROM public.auctions a
    JOIN public.bids b ON a.id = b.auction_id
    WHERE (a.created_by = profile_user_id AND b.bidder_id = current_user_id)
       OR (a.created_by = current_user_id AND b.bidder_id = profile_user_id)
       OR (a.winner_id = profile_user_id AND a.created_by = current_user_id)
       OR (a.winner_id = current_user_id AND a.created_by = profile_user_id)
    UNION
    -- Transaction relationships
    SELECT 1 FROM public.transactions t
    WHERE (t.seller_id = profile_user_id AND t.buyer_id = current_user_id)
       OR (t.buyer_id = profile_user_id AND t.seller_id = current_user_id)
    UNION
    -- Rating relationships
    SELECT 1 FROM public.ratings r
    WHERE (r.from_user_id = profile_user_id AND r.to_user_id = current_user_id)
       OR (r.to_user_id = profile_user_id AND r.from_user_id = current_user_id)
  ) THEN
    RETURN true;
  END IF;
  
  RETURN false;
END;
$$;