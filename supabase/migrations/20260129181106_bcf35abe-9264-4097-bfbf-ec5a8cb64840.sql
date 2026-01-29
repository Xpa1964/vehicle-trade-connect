-- Final fixes for remaining columns and functions

-- 1. Add type column to vehicles
ALTER TABLE public.vehicles
ADD COLUMN IF NOT EXISTS type TEXT;

-- 2. Add missing conversation columns
ALTER TABLE public.conversations
ADD COLUMN IF NOT EXISTS source_id UUID,
ADD COLUMN IF NOT EXISTS is_pinned BOOLEAN DEFAULT false;

-- 3. Add translated_content to messages
ALTER TABLE public.messages
ADD COLUMN IF NOT EXISTS translated_content TEXT;

-- 4. Add auction column
ALTER TABLE public.auctions
ADD COLUMN IF NOT EXISTS vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE CASCADE;

-- 5. Create place_bid function
CREATE OR REPLACE FUNCTION public.place_bid(
  p_auction_id UUID,
  p_bidder_id UUID,
  p_amount DECIMAL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_bid_id UUID;
BEGIN
  INSERT INTO public.bids (auction_id, bidder_id, amount)
  VALUES (p_auction_id, p_bidder_id, p_amount)
  RETURNING id INTO v_bid_id;
  
  UPDATE public.auctions SET current_price = p_amount WHERE id = p_auction_id;
  
  RETURN v_bid_id;
END;
$$;

-- 6. Create soft_delete_conversation function
CREATE OR REPLACE FUNCTION public.soft_delete_conversation(p_conversation_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.conversations 
  SET status = 'deleted', updated_at = now()
  WHERE id = p_conversation_id 
  AND (seller_id = auth.uid() OR buyer_id = auth.uid());
  
  RETURN FOUND;
END;
$$;