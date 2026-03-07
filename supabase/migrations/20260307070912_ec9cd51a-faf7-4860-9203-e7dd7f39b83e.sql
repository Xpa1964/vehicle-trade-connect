
-- Create a security definer function that returns reserve_price only for the seller or admins
CREATE OR REPLACE FUNCTION public.get_auction_reserve_price(p_auction_id uuid)
RETURNS numeric
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_reserve numeric;
  v_seller_id uuid;
BEGIN
  SELECT seller_id, reserve_price INTO v_seller_id, v_reserve
  FROM public.auctions
  WHERE id = p_auction_id;

  -- Only return reserve_price if caller is the seller or an admin
  IF v_seller_id = auth.uid() OR public.is_admin(auth.uid()) THEN
    RETURN v_reserve;
  END IF;

  RETURN NULL;
END;
$$;

-- Add a boolean column helper: has_reserve_price (no amount leaked)
CREATE OR REPLACE FUNCTION public.auction_has_reserve(p_auction_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT reserve_price IS NOT NULL
  FROM public.auctions
  WHERE id = p_auction_id;
$$;
