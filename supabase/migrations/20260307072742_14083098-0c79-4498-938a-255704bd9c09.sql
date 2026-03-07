
CREATE OR REPLACE FUNCTION public.accept_auction_result(p_auction_id uuid, p_seller_id uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_auction RECORD;
  v_winning_bid RECORD;
  v_vehicle RECORD;
  v_conversation_id UUID;
  v_vehicle_name TEXT;
BEGIN
  SELECT id, seller_id, status, winner_id, current_price, vehicle_id
  INTO v_auction
  FROM public.auctions
  WHERE id = p_auction_id
  FOR UPDATE;

  IF v_auction IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error_code', 'AUCTION_NOT_FOUND',
      'error_message', 'La subasta no existe');
  END IF;

  IF v_auction.seller_id != p_seller_id THEN
    RETURN jsonb_build_object('success', false, 'error_code', 'NOT_SELLER',
      'error_message', 'Solo el vendedor puede aceptar el resultado');
  END IF;

  IF v_auction.status != 'ended_pending_acceptance' THEN
    RETURN jsonb_build_object('success', false, 'error_code', 'INVALID_STATUS',
      'error_message', 'La subasta no está en estado de decisión pendiente',
      'current_status', v_auction.status);
  END IF;

  SELECT id, bidder_id, amount
  INTO v_winning_bid
  FROM public.bids
  WHERE auction_id = p_auction_id AND is_winning = true
  LIMIT 1;

  IF v_winning_bid IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error_code', 'NO_WINNER',
      'error_message', 'No hay puja ganadora para aceptar');
  END IF;

  SELECT brand, model, year INTO v_vehicle
  FROM public.vehicles WHERE id = v_auction.vehicle_id;

  v_vehicle_name := COALESCE(v_vehicle.brand || ' ' || v_vehicle.model || ' (' || v_vehicle.year || ')', 'Vehicle');

  UPDATE public.auctions
  SET status = 'accepted', seller_decision_at = now(), updated_at = now()
  WHERE id = p_auction_id;

  INSERT INTO public.auction_state_transitions (
    auction_id, from_status, to_status, triggered_by, trigger_type, metadata
  ) VALUES (
    p_auction_id, 'ended_pending_acceptance', 'accepted', p_seller_id, 'manual',
    jsonb_build_object(
      'event_type', 'result_accepted',
      'seller_id', p_seller_id,
      'bid_id', v_winning_bid.id,
      'winner_id', v_winning_bid.bidder_id,
      'final_amount', v_winning_bid.amount,
      'decision_timestamp', now()
    )
  );

  -- Create internal conversation thread
  INSERT INTO public.conversations (
    seller_id, buyer_id, vehicle_id,
    source_type, source_id, source_title,
    status, last_message_at
  ) VALUES (
    p_seller_id, v_winning_bid.bidder_id, v_auction.vehicle_id,
    'auction', p_auction_id, v_vehicle_name,
    'active', now()
  )
  RETURNING id INTO v_conversation_id;

  -- System message in English (frontend translates via message_type='system')
  INSERT INTO public.messages (
    conversation_id, sender_id, content, message_type
  ) VALUES (
    v_conversation_id, p_seller_id,
    'Auction accepted for ' || v_vehicle_name || '. Final price: ' || v_winning_bid.amount || ' EUR. Use this thread to coordinate next steps.',
    'system'
  );

  -- Notify winner
  PERFORM public.create_system_notification(
    v_winning_bid.bidder_id,
    'Auction won',
    'The seller has accepted the auction result for ' || v_vehicle_name || '. A conversation thread has been created.',
    'auction',
    '/messages'
  );

  -- Notify seller
  PERFORM public.create_system_notification(
    p_seller_id,
    'Result accepted',
    'You have accepted the auction result for ' || v_vehicle_name || '. A conversation thread with the winner has been created.',
    'auction',
    '/messages'
  );

  RETURN jsonb_build_object(
    'success', true,
    'auction_id', p_auction_id,
    'new_status', 'accepted',
    'winner_id', v_winning_bid.bidder_id,
    'final_amount', v_winning_bid.amount,
    'conversation_id', v_conversation_id,
    'message', 'Result accepted. A conversation thread with the winner has been created.'
  );

EXCEPTION
  WHEN OTHERS THEN
    RETURN jsonb_build_object('success', false, 'error_code', 'INTERNAL_ERROR',
      'error_message', SQLERRM);
END;
$function$;
