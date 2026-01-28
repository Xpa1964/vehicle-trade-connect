-- FASE 1: Aplicar SET search_path a funciones críticas de seguridad
-- 
-- IMPORTANTE: Estas funciones manejan operaciones críticas de seguridad y necesitan
-- el search_path fijo para prevenir ataques de confusión de esquemas

-- Función: place_bid - Manejar pujas en subastas
CREATE OR REPLACE FUNCTION public.place_bid(p_auction_id uuid, p_amount numeric)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_auction public.auctions;
  v_user_id UUID;
  v_current_highest_bid NUMERIC;
  v_response JSONB;
  v_previous_highest_bidder UUID;
  v_time_remaining INTERVAL;
  v_extended BOOLEAN := false;
  v_new_end_date TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Get current user ID
  v_user_id := auth.uid();
  
  -- Get the auction
  SELECT * INTO v_auction FROM public.auctions WHERE id = p_auction_id;
  
  -- Check if auction exists
  IF v_auction IS NULL THEN
    RETURN jsonb_build_object('success', false, 'message', 'Auction not found');
  END IF;
  
  -- Check if auction is active
  IF v_auction.status <> 'active' THEN
    RETURN jsonb_build_object('success', false, 'message', 'Auction is not active');
  END IF;
  
  -- Check if auction has not ended
  IF v_auction.end_date <= NOW() THEN
    RETURN jsonb_build_object('success', false, 'message', 'Auction has ended');
  END IF;
  
  -- Check if user is not the auction creator
  IF v_auction.created_by = v_user_id THEN
    RETURN jsonb_build_object('success', false, 'message', 'Auction creator cannot place bids');
  END IF;
  
  -- Get current highest bid
  v_current_highest_bid := v_auction.current_price;
  
  -- Get previous highest bidder
  SELECT bidder_id INTO v_previous_highest_bidder 
  FROM public.bids 
  WHERE auction_id = p_auction_id AND amount = v_current_highest_bid
  ORDER BY created_at DESC
  LIMIT 1;
  
  -- Check if bid is high enough (must be at least minimum increment above current price)
  IF p_amount < (v_current_highest_bid + v_auction.increment_minimum) THEN
    RETURN jsonb_build_object('success', false, 'message', format('Bid must be at least %s above current price', v_auction.increment_minimum));
  END IF;
  
  -- Anti-sniping logic: Check if bid is within last 10 minutes
  v_time_remaining := v_auction.end_date - NOW();
  IF v_time_remaining <= INTERVAL '10 minutes' THEN
    -- Extend auction by 5 minutes
    v_new_end_date := v_auction.end_date + INTERVAL '5 minutes';
    v_extended := true;
    
    -- Update auction end date
    UPDATE public.auctions
    SET end_date = v_new_end_date, updated_at = NOW()
    WHERE id = p_auction_id;
    
    -- Log the extension
    INSERT INTO public.auction_audit_log (auction_id, user_id, action, details)
    VALUES (p_auction_id, v_user_id, 'anti_snipe_extension', jsonb_build_object(
      'original_end_date', v_auction.end_date,
      'new_end_date', v_new_end_date,
      'bid_amount', p_amount
    ));
  END IF;
  
  -- Insert the bid
  INSERT INTO public.bids (auction_id, bidder_id, amount)
  VALUES (p_auction_id, v_user_id, p_amount);
  
  -- Update auction current price
  UPDATE public.auctions
  SET current_price = p_amount, updated_at = NOW()
  WHERE id = p_auction_id;
  
  -- Create notification for outbid user
  IF v_previous_highest_bidder IS NOT NULL AND v_previous_highest_bidder <> v_user_id THEN
    INSERT INTO public.auction_notifications (user_id, auction_id, type, content)
    VALUES (v_previous_highest_bidder, p_auction_id, 'outbid', format('You have been outbid on an auction. Current highest bid is %s', p_amount));
  END IF;
  
  -- Create notification for auction extension if applicable
  IF v_extended THEN
    -- Notify all bidders about the extension
    INSERT INTO public.auction_notifications (user_id, auction_id, type, content)
    SELECT DISTINCT bidder_id, p_auction_id, 'auction_extended', 
           format('Auction has been extended by 5 minutes due to anti-sniping measures. New end time: %s', v_new_end_date)
    FROM public.bids
    WHERE auction_id = p_auction_id AND bidder_id IS NOT NULL AND bidder_id <> v_user_id;
    
    -- Also notify the auction creator
    INSERT INTO public.auction_notifications (user_id, auction_id, type, content)
    VALUES (v_auction.created_by, p_auction_id, 'auction_extended', 
            format('Your auction has been extended by 5 minutes due to anti-sniping measures. New end time: %s', v_new_end_date));
  END IF;
  
  -- Log the action
  INSERT INTO public.auction_audit_log (auction_id, user_id, action, details)
  VALUES (p_auction_id, v_user_id, 'place_bid', jsonb_build_object(
    'amount', p_amount,
    'extended', v_extended,
    'new_end_date', CASE WHEN v_extended THEN v_new_end_date ELSE NULL END
  ));
  
  RETURN jsonb_build_object(
    'success', true, 
    'message', 'Bid placed successfully',
    'extended', v_extended,
    'new_end_date', CASE WHEN v_extended THEN v_new_end_date ELSE NULL END
  );
EXCEPTION
  WHEN OTHERS THEN
    RETURN jsonb_build_object('success', false, 'message', SQLERRM);
END;
$function$

-- Función: start_auction - Iniciar subastas
CREATE OR REPLACE FUNCTION public.start_auction(auction_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_auction public.auctions;
  v_user_id UUID;
BEGIN
  -- Get current user ID
  v_user_id := auth.uid();
  
  -- Get the auction
  SELECT * INTO v_auction FROM public.auctions WHERE id = auction_id;
  
  -- Check if auction exists and user is the creator
  IF v_auction IS NULL THEN
    RAISE EXCEPTION 'Auction not found';
  END IF;
  
  IF v_auction.created_by <> v_user_id THEN
    RAISE EXCEPTION 'Not authorized to start this auction';
  END IF;
  
  -- Check if auction is in scheduled status
  IF v_auction.status <> 'scheduled' THEN
    RAISE EXCEPTION 'Auction cannot be started (current status: %)', v_auction.status;
  END IF;
  
  -- Update auction status to active
  UPDATE public.auctions
  SET status = 'active', updated_at = now()
  WHERE id = auction_id;
  
  -- Update vehicle status to in_auction
  UPDATE public.vehicles
  SET status = 'in_auction'
  WHERE id = v_auction.vehicle_id;
  
  -- Log the action
  INSERT INTO public.auction_audit_log (auction_id, user_id, action, details)
  VALUES (auction_id, v_user_id, 'start_auction', jsonb_build_object('previous_status', 'scheduled'));
  
  RETURN TRUE;
EXCEPTION
  WHEN OTHERS THEN
    RETURN FALSE;
END;
$function$

-- Función: end_auction - Finalizar subastas
CREATE OR REPLACE FUNCTION public.end_auction(auction_id uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_auction public.auctions;
  v_user_id UUID;
  v_winner_id UUID;
  v_has_met_reserve BOOLEAN;
BEGIN
  -- Get current user ID
  v_user_id := auth.uid();
  
  -- Get the auction
  SELECT * INTO v_auction FROM public.auctions WHERE id = auction_id;
  
  -- Check if auction exists and user is the creator
  IF v_auction IS NULL THEN
    RETURN jsonb_build_object('success', false, 'message', 'Auction not found');
  END IF;
  
  IF v_auction.created_by <> v_user_id THEN
    RETURN jsonb_build_object('success', false, 'message', 'Not authorized to end this auction');
  END IF;
  
  -- Check if auction is active
  IF v_auction.status <> 'active' THEN
    RETURN jsonb_build_object('success', false, 'message', format('Auction cannot be ended (current status: %s)', v_auction.status));
  END IF;
  
  -- Check if reserve price has been met
  v_has_met_reserve := v_auction.reserve_price IS NULL OR v_auction.current_price >= v_auction.reserve_price;
  
  -- Get highest bidder if exists
  SELECT bidder_id INTO v_winner_id
  FROM public.bids
  WHERE auction_id = auction_id AND amount = v_auction.current_price
  ORDER BY created_at ASC
  LIMIT 1;
  
  -- Update auction status
  UPDATE public.auctions
  SET 
    status = 'ended',
    updated_at = now(),
    winner_id = CASE WHEN v_has_met_reserve THEN v_winner_id ELSE NULL END
  WHERE id = auction_id;
  
  -- Update vehicle status
  UPDATE public.vehicles
  SET status = CASE WHEN v_has_met_reserve AND v_winner_id IS NOT NULL THEN 'reserved' ELSE 'available' END
  WHERE id = v_auction.vehicle_id;
  
  -- Create notification for winner
  IF v_has_met_reserve AND v_winner_id IS NOT NULL THEN
    INSERT INTO public.auction_notifications (user_id, auction_id, type, content)
    VALUES (v_winner_id, auction_id, 'auction_won', format('Congratulations! You won an auction with a bid of %s', v_auction.current_price));
    
    -- Notify seller
    INSERT INTO public.auction_notifications (user_id, auction_id, type, content)
    VALUES (v_auction.created_by, auction_id, 'auction_sold', format('Your auction has ended with a winning bid of %s', v_auction.current_price));
  ELSE
    -- Notify seller that reserve was not met
    INSERT INTO public.auction_notifications (user_id, auction_id, type, content)
    VALUES (v_auction.created_by, auction_id, 'reserve_not_met', format('Your auction has ended without meeting the reserve price. Highest bid: %s', v_auction.current_price));
  END IF;
  
  -- Log the action
  INSERT INTO public.auction_audit_log (auction_id, user_id, action, details)
  VALUES (auction_id, v_user_id, 'end_auction', jsonb_build_object(
    'has_met_reserve', v_has_met_reserve,
    'winner_id', v_winner_id,
    'final_price', v_auction.current_price
  ));
  
  RETURN jsonb_build_object(
    'success', true,
    'message', 'Auction ended successfully',
    'has_met_reserve', v_has_met_reserve,
    'winner_id', v_winner_id
  );
EXCEPTION
  WHEN OTHERS THEN
    RETURN jsonb_build_object('success', false, 'message', SQLERRM);
END;
$function$

-- Función: cancel_auction - Cancelar subastas  
CREATE OR REPLACE FUNCTION public.cancel_auction(auction_id uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_auction public.auctions;
  v_user_id UUID;
BEGIN
  -- Get current user ID
  v_user_id := auth.uid();
  
  -- Get the auction
  SELECT * INTO v_auction FROM public.auctions WHERE id = auction_id;
  
  -- Check if auction exists and user is the creator
  IF v_auction IS NULL THEN
    RETURN jsonb_build_object('success', false, 'message', 'Auction not found');
  END IF;
  
  IF v_auction.created_by <> v_user_id THEN
    RETURN jsonb_build_object('success', false, 'message', 'Not authorized to cancel this auction');
  END IF;
  
  -- Check if auction can be cancelled (active or scheduled)
  IF v_auction.status NOT IN ('active', 'scheduled') THEN
    RETURN jsonb_build_object('success', false, 'message', format('Auction cannot be cancelled (current status: %s)', v_auction.status));
  END IF;
  
  -- Update auction status to cancelled
  UPDATE public.auctions
  SET status = 'cancelled', updated_at = now()
  WHERE id = auction_id;
  
  -- Update vehicle status back to available
  UPDATE public.vehicles
  SET status = 'available'
  WHERE id = v_auction.vehicle_id;
  
  -- Notify all bidders if there were any bids
  INSERT INTO public.auction_notifications (user_id, auction_id, type, content)
  SELECT DISTINCT bidder_id, auction_id, 'auction_cancelled', 'The auction you were bidding on has been cancelled by the seller'
  FROM public.bids
  WHERE auction_id = auction_id AND bidder_id IS NOT NULL;
  
  -- Log the action
  INSERT INTO public.auction_audit_log (auction_id, user_id, action, details)
  VALUES (auction_id, v_user_id, 'cancel_auction', jsonb_build_object('previous_status', v_auction.status));
  
  RETURN jsonb_build_object('success', true, 'message', 'Auction cancelled successfully');
EXCEPTION
  WHEN OTHERS THEN
    RETURN jsonb_build_object('success', false, 'message', SQLERRM);
END;
$function$

-- Función: accept_bid - Aceptar pujas específicas
CREATE OR REPLACE FUNCTION public.accept_bid(p_auction_id uuid, p_bid_id uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
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
$function$