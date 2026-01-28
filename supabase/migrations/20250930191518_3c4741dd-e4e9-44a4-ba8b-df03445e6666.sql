-- Security Enhancement Phase 1 Part 2: Continue Database Function Hardening

-- 9. Fix start_auction function
CREATE OR REPLACE FUNCTION public.start_auction(auction_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_auction public.auctions;
  v_user_id UUID;
BEGIN
  v_user_id := auth.uid();
  SELECT * INTO v_auction FROM public.auctions WHERE id = auction_id;
  
  IF v_auction IS NULL THEN
    RAISE EXCEPTION 'Auction not found';
  END IF;
  
  IF v_auction.created_by <> v_user_id THEN
    RAISE EXCEPTION 'Not authorized to start this auction';
  END IF;
  
  IF v_auction.status <> 'scheduled' THEN
    RAISE EXCEPTION 'Auction cannot be started (current status: %)', v_auction.status;
  END IF;
  
  UPDATE public.auctions
  SET status = 'active', updated_at = now()
  WHERE id = auction_id;
  
  UPDATE public.vehicles
  SET status = 'in_auction'
  WHERE id = v_auction.vehicle_id;
  
  INSERT INTO public.auction_audit_log (auction_id, user_id, action, details)
  VALUES (auction_id, v_user_id, 'start_auction', jsonb_build_object('previous_status', 'scheduled'));
  
  RETURN TRUE;
EXCEPTION
  WHEN OTHERS THEN
    RETURN FALSE;
END;
$$;

-- 10. Fix end_auction function
CREATE OR REPLACE FUNCTION public.end_auction(auction_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_auction public.auctions;
  v_user_id UUID;
  v_winner_id UUID;
  v_has_met_reserve BOOLEAN;
BEGIN
  v_user_id := auth.uid();
  SELECT * INTO v_auction FROM public.auctions WHERE id = auction_id;
  
  IF v_auction IS NULL THEN
    RETURN jsonb_build_object('success', false, 'message', 'Auction not found');
  END IF;
  
  IF v_auction.created_by <> v_user_id THEN
    RETURN jsonb_build_object('success', false, 'message', 'Not authorized to end this auction');
  END IF;
  
  IF v_auction.status <> 'active' THEN
    RETURN jsonb_build_object('success', false, 'message', format('Auction cannot be ended (current status: %s)', v_auction.status));
  END IF;
  
  v_has_met_reserve := v_auction.reserve_price IS NULL OR v_auction.current_price >= v_auction.reserve_price;
  
  SELECT bidder_id INTO v_winner_id
  FROM public.bids
  WHERE auction_id = auction_id AND amount = v_auction.current_price
  ORDER BY created_at ASC
  LIMIT 1;
  
  UPDATE public.auctions
  SET 
    status = 'ended',
    updated_at = now(),
    winner_id = CASE WHEN v_has_met_reserve THEN v_winner_id ELSE NULL END
  WHERE id = auction_id;
  
  UPDATE public.vehicles
  SET status = CASE WHEN v_has_met_reserve AND v_winner_id IS NOT NULL THEN 'reserved' ELSE 'available' END
  WHERE id = v_auction.vehicle_id;
  
  IF v_has_met_reserve AND v_winner_id IS NOT NULL THEN
    INSERT INTO public.auction_notifications (user_id, auction_id, type, content)
    VALUES (v_winner_id, auction_id, 'auction_won', format('Congratulations! You won an auction with a bid of %s', v_auction.current_price));
    
    INSERT INTO public.auction_notifications (user_id, auction_id, type, content)
    VALUES (v_auction.created_by, auction_id, 'auction_sold', format('Your auction has ended with a winning bid of %s', v_auction.current_price));
  ELSE
    INSERT INTO public.auction_notifications (user_id, auction_id, type, content)
    VALUES (v_auction.created_by, auction_id, 'reserve_not_met', format('Your auction has ended without meeting the reserve price. Highest bid: %s', v_auction.current_price));
  END IF;
  
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
$$;

-- 11. Fix cancel_auction function
CREATE OR REPLACE FUNCTION public.cancel_auction(auction_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_auction public.auctions;
  v_user_id UUID;
BEGIN
  v_user_id := auth.uid();
  SELECT * INTO v_auction FROM public.auctions WHERE id = auction_id;
  
  IF v_auction IS NULL THEN
    RETURN jsonb_build_object('success', false, 'message', 'Auction not found');
  END IF;
  
  IF v_auction.created_by <> v_user_id THEN
    RETURN jsonb_build_object('success', false, 'message', 'Not authorized to cancel this auction');
  END IF;
  
  IF v_auction.status NOT IN ('active', 'scheduled') THEN
    RETURN jsonb_build_object('success', false, 'message', format('Auction cannot be cancelled (current status: %s)', v_auction.status));
  END IF;
  
  UPDATE public.auctions
  SET status = 'cancelled', updated_at = now()
  WHERE id = auction_id;
  
  UPDATE public.vehicles
  SET status = 'available'
  WHERE id = v_auction.vehicle_id;
  
  INSERT INTO public.auction_notifications (user_id, auction_id, type, content)
  SELECT DISTINCT bidder_id, auction_id, 'auction_cancelled', 'The auction you were bidding on has been cancelled by the seller'
  FROM public.bids
  WHERE auction_id = auction_id AND bidder_id IS NOT NULL;
  
  INSERT INTO public.auction_audit_log (auction_id, user_id, action, details)
  VALUES (auction_id, v_user_id, 'cancel_auction', jsonb_build_object('previous_status', v_auction.status));
  
  RETURN jsonb_build_object('success', true, 'message', 'Auction cancelled successfully');
EXCEPTION
  WHEN OTHERS THEN
    RETURN jsonb_build_object('success', false, 'message', SQLERRM);
END;
$$;

-- 12. Fix accept_auction_result function
CREATE OR REPLACE FUNCTION public.accept_auction_result(p_auction_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_auction public.auctions;
  v_user_id UUID;
BEGIN
  v_user_id := auth.uid();
  SELECT * INTO v_auction FROM public.auctions WHERE id = p_auction_id;
  
  IF v_auction IS NULL THEN
    RETURN jsonb_build_object('success', false, 'message', 'Auction not found');
  END IF;
  
  IF v_auction.created_by <> v_user_id THEN
    RETURN jsonb_build_object('success', false, 'message', 'Not authorized to accept this auction result');
  END IF;
  
  IF v_auction.status <> 'ended' THEN
    RETURN jsonb_build_object('success', false, 'message', 'Can only accept results for ended auctions');
  END IF;
  
  UPDATE public.auctions
  SET 
    status = 'completed',
    updated_at = NOW()
  WHERE id = p_auction_id;
  
  IF v_auction.winner_id IS NOT NULL THEN
    UPDATE public.vehicles
    SET status = 'sold'
    WHERE id = v_auction.vehicle_id;
    
    INSERT INTO public.auction_notifications (user_id, auction_id, type, content)
    VALUES (v_auction.winner_id, p_auction_id, 'auction_result_accepted', 
            'The seller has accepted the auction result. Congratulations on your purchase!');
  END IF;
  
  INSERT INTO public.auction_audit_log (auction_id, user_id, action, details)
  VALUES (p_auction_id, v_user_id, 'accept_auction_result', jsonb_build_object(
    'winner_id', v_auction.winner_id,
    'final_price', v_auction.current_price
  ));
  
  RETURN jsonb_build_object(
    'success', true,
    'message', 'Auction result accepted successfully'
  );
EXCEPTION
  WHEN OTHERS THEN
    RETURN jsonb_build_object('success', false, 'message', SQLERRM);
END;
$$;

-- 13. Fix reject_auction_result function
CREATE OR REPLACE FUNCTION public.reject_auction_result(p_auction_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_auction public.auctions;
  v_user_id UUID;
  v_bid_count INTEGER;
BEGIN
  v_user_id := auth.uid();
  SELECT * INTO v_auction FROM public.auctions WHERE id = p_auction_id;
  
  IF v_auction IS NULL THEN
    RETURN jsonb_build_object('success', false, 'message', 'Auction not found');
  END IF;
  
  IF v_auction.created_by <> v_user_id THEN
    RETURN jsonb_build_object('success', false, 'message', 'Not authorized to reject this auction result');
  END IF;
  
  IF v_auction.status <> 'ended' THEN
    RETURN jsonb_build_object('success', false, 'message', 'Can only reject results for ended auctions');
  END IF;
  
  SELECT COUNT(*) INTO v_bid_count FROM public.bids WHERE auction_id = p_auction_id;
  
  IF v_bid_count > 0 THEN
    INSERT INTO public.auction_notifications (user_id, auction_id, type, content)
    SELECT DISTINCT bidder_id, p_auction_id, 'auction_result_rejected', 
           'The seller has rejected the auction result. The auction has been cancelled and removed.'
    FROM public.bids
    WHERE auction_id = p_auction_id AND bidder_id IS NOT NULL;
  END IF;
  
  INSERT INTO public.auction_audit_log (auction_id, user_id, action, details)
  VALUES (p_auction_id, v_user_id, 'reject_auction_result', jsonb_build_object(
    'winner_id', v_auction.winner_id,
    'final_price', v_auction.current_price,
    'bid_count', v_bid_count,
    'reason', 'seller_rejection'
  ));
  
  UPDATE public.vehicles
  SET status = 'available'
  WHERE id = v_auction.vehicle_id;
  
  DELETE FROM public.auction_notifications WHERE auction_id = p_auction_id;
  DELETE FROM public.bids WHERE auction_id = p_auction_id;
  DELETE FROM public.auctions WHERE id = p_auction_id;
  
  RETURN jsonb_build_object(
    'success', true,
    'message', 'Auction result rejected and auction removed successfully'
  );
EXCEPTION
  WHEN OTHERS THEN
    RETURN jsonb_build_object('success', false, 'message', SQLERRM);
END;
$$;

-- 14. Fix close_expired_auctions function
CREATE OR REPLACE FUNCTION public.close_expired_auctions()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_count INTEGER := 0;
  v_auction RECORD;
  v_has_met_reserve BOOLEAN;
  v_winner_id UUID;
BEGIN
  FOR v_auction IN
    SELECT * FROM public.auctions 
    WHERE status = 'active' AND end_date <= NOW()
  LOOP
    v_has_met_reserve := v_auction.reserve_price IS NULL OR v_auction.current_price >= v_auction.reserve_price;
    
    SELECT bidder_id INTO v_winner_id
    FROM public.bids
    WHERE auction_id = v_auction.id AND amount = v_auction.current_price
    ORDER BY created_at ASC
    LIMIT 1;
    
    UPDATE public.auctions
    SET 
      status = 'ended',
      updated_at = now(),
      winner_id = CASE WHEN v_has_met_reserve THEN v_winner_id ELSE NULL END
    WHERE id = v_auction.id;
    
    UPDATE public.vehicles
    SET status = CASE WHEN v_has_met_reserve AND v_winner_id IS NOT NULL THEN 'reserved' ELSE 'available' END
    WHERE id = v_auction.vehicle_id;
    
    IF v_has_met_reserve AND v_winner_id IS NOT NULL THEN
      INSERT INTO public.auction_notifications (user_id, auction_id, type, content)
      VALUES (v_winner_id, v_auction.id, 'auction_won', format('Congratulations! You won an auction with a bid of %s', v_auction.current_price));
      
      INSERT INTO public.auction_notifications (user_id, auction_id, type, content)
      VALUES (v_auction.created_by, v_auction.id, 'auction_sold', format('Your auction has ended with a winning bid of %s', v_auction.current_price));
    ELSE
      INSERT INTO public.auction_notifications (user_id, auction_id, type, content)
      VALUES (v_auction.created_by, v_auction.id, 'reserve_not_met', format('Your auction has ended without meeting the reserve price. Highest bid: %s', v_auction.current_price));
    END IF;
    
    INSERT INTO public.auction_audit_log (auction_id, user_id, action, details)
    VALUES (v_auction.id, NULL, 'auto_close_auction', jsonb_build_object(
      'has_met_reserve', v_has_met_reserve,
      'winner_id', v_winner_id,
      'final_price', v_auction.current_price
    ));
    
    v_count := v_count + 1;
  END LOOP;
  
  RETURN v_count;
END;
$$;

-- 15. Fix get_unread_auction_notifications function
CREATE OR REPLACE FUNCTION public.get_unread_auction_notifications(p_limit integer DEFAULT 10)
RETURNS SETOF auction_notifications
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT * FROM public.auction_notifications
  WHERE user_id = auth.uid() AND is_read = false
  ORDER BY created_at DESC
  LIMIT p_limit;
$$;

-- 16. Fix soft_delete_conversation function
CREATE OR REPLACE FUNCTION public.soft_delete_conversation(p_conversation_id uuid, p_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_conversation conversations;
  v_user_role TEXT;
  v_other_user_id UUID;
  v_message_count INTEGER;
  v_conversation_age INTERVAL;
BEGIN
  SELECT * INTO v_conversation 
  FROM conversations 
  WHERE id = p_conversation_id;
  
  IF v_conversation.seller_id != p_user_id AND v_conversation.buyer_id != p_user_id THEN
    RETURN FALSE;
  END IF;
  
  IF v_conversation.seller_id = p_user_id THEN
    v_user_role := 'seller';
    v_other_user_id := v_conversation.buyer_id;
  ELSIF v_conversation.buyer_id = p_user_id THEN
    v_user_role := 'buyer';
    v_other_user_id := v_conversation.seller_id;
  END IF;
  
  SELECT COUNT(*) INTO v_message_count
  FROM messages 
  WHERE conversation_id = p_conversation_id;
  
  v_conversation_age := NOW() - v_conversation.created_at;
  
  IF v_conversation.seller_id = p_user_id THEN
    UPDATE conversations 
    SET deleted_by_seller = TRUE, seller_deleted_at = NOW()
    WHERE id = p_conversation_id;
  ELSIF v_conversation.buyer_id = p_user_id THEN
    UPDATE conversations 
    SET deleted_by_buyer = TRUE, buyer_deleted_at = NOW()
    WHERE id = p_conversation_id;
  END IF;
  
  INSERT INTO public.activity_logs (
    user_id,
    action_type,
    entity_type,
    entity_id,
    details,
    severity
  ) VALUES (
    p_user_id,
    'conversation_deleted_by_' || v_user_role,
    'conversation',
    p_conversation_id::text,
    jsonb_build_object(
      'conversation_id', p_conversation_id,
      'deleted_by_role', v_user_role,
      'other_participant_id', v_other_user_id,
      'message_count', v_message_count,
      'conversation_age_hours', EXTRACT(EPOCH FROM v_conversation_age) / 3600
    ),
    'warning'
  );
  
  RETURN TRUE;
END;
$$;