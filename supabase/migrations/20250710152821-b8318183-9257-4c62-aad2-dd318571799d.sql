
-- Agregar columna para aceptación manual del vendedor
ALTER TABLE public.auctions 
ADD COLUMN seller_accepted_bid_id UUID REFERENCES public.bids(id),
ADD COLUMN seller_accepted_at TIMESTAMP WITH TIME ZONE;

-- Crear función para que el vendedor acepte una puja específica
CREATE OR REPLACE FUNCTION public.accept_bid(p_auction_id uuid, p_bid_id uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  v_auction public.auctions;
  v_bid public.bids;
  v_user_id UUID;
BEGIN
  -- Get current user ID
  v_user_id := auth.uid();
  
  -- Get the auction
  SELECT * INTO v_auction FROM public.auctions WHERE id = p_auction_id;
  
  -- Check if auction exists and user is the creator
  IF v_auction IS NULL THEN
    RETURN jsonb_build_object('success', false, 'message', 'Auction not found');
  END IF;
  
  IF v_auction.created_by <> v_user_id THEN
    RETURN jsonb_build_object('success', false, 'message', 'Not authorized to accept bids for this auction');
  END IF;
  
  -- Check if auction is active
  IF v_auction.status <> 'active' THEN
    RETURN jsonb_build_object('success', false, 'message', 'Can only accept bids on active auctions');
  END IF;
  
  -- Get the bid
  SELECT * INTO v_bid FROM public.bids WHERE id = p_bid_id AND auction_id = p_auction_id;
  
  IF v_bid IS NULL THEN
    RETURN jsonb_build_object('success', false, 'message', 'Bid not found for this auction');
  END IF;
  
  -- Update auction with accepted bid
  UPDATE public.auctions
  SET 
    seller_accepted_bid_id = p_bid_id,
    seller_accepted_at = NOW(),
    status = 'completed',
    winner_id = v_bid.bidder_id,
    updated_at = NOW()
  WHERE id = p_auction_id;
  
  -- Update vehicle status to reserved
  UPDATE public.vehicles
  SET status = 'reserved'
  WHERE id = v_auction.vehicle_id;
  
  -- Create notification for the winning bidder
  INSERT INTO public.auction_notifications (user_id, auction_id, type, content)
  VALUES (v_bid.bidder_id, p_auction_id, 'bid_accepted', 
          format('Congratulations! Your bid of %s has been accepted by the seller', v_bid.amount));
  
  -- Notify other bidders that the auction has ended
  INSERT INTO public.auction_notifications (user_id, auction_id, type, content)
  SELECT DISTINCT bidder_id, p_auction_id, 'auction_ended_early', 
         'The auction has ended early as the seller accepted a bid'
  FROM public.bids
  WHERE auction_id = p_auction_id AND bidder_id IS NOT NULL AND bidder_id <> v_bid.bidder_id;
  
  -- Log the action
  INSERT INTO public.auction_audit_log (auction_id, user_id, action, details)
  VALUES (p_auction_id, v_user_id, 'accept_bid', jsonb_build_object(
    'accepted_bid_id', p_bid_id,
    'accepted_amount', v_bid.amount,
    'bidder_id', v_bid.bidder_id
  ));
  
  RETURN jsonb_build_object(
    'success', true,
    'message', 'Bid accepted successfully',
    'accepted_bid_id', p_bid_id,
    'winner_id', v_bid.bidder_id,
    'amount', v_bid.amount
  );
EXCEPTION
  WHEN OTHERS THEN
    RETURN jsonb_build_object('success', false, 'message', SQLERRM);
END;
$function$;
