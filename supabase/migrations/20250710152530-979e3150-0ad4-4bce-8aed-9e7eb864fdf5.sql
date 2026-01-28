
-- Actualizar la función place_bid para incluir lógica anti-sniping
CREATE OR REPLACE FUNCTION public.place_bid(p_auction_id uuid, p_amount numeric)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
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
