
-- C3: Remove direct INSERT policy on bids table
-- Only place_bid (SECURITY DEFINER) can insert bids
DROP POLICY IF EXISTS "Users can create bids" ON public.bids;
