
-- Función para aceptar el resultado de una subasta finalizada
CREATE OR REPLACE FUNCTION public.accept_auction_result(p_auction_id uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $$
DECLARE
  v_auction public.auctions;
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
    RETURN jsonb_build_object('success', false, 'message', 'Not authorized to accept this auction result');
  END IF;
  
  -- Check if auction is in ended status
  IF v_auction.status <> 'ended' THEN
    RETURN jsonb_build_object('success', false, 'message', 'Can only accept results for ended auctions');
  END IF;
  
  -- Update auction status to completed
  UPDATE public.auctions
  SET 
    status = 'completed',
    updated_at = NOW()
  WHERE id = p_auction_id;
  
  -- Update vehicle status to sold if there's a winner
  IF v_auction.winner_id IS NOT NULL THEN
    UPDATE public.vehicles
    SET status = 'sold'
    WHERE id = v_auction.vehicle_id;
    
    -- Create notification for the winner
    INSERT INTO public.auction_notifications (user_id, auction_id, type, content)
    VALUES (v_auction.winner_id, p_auction_id, 'auction_result_accepted', 
            'The seller has accepted the auction result. Congratulations on your purchase!');
  END IF;
  
  -- Log the action
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

-- Función para rechazar el resultado de una subasta finalizada (elimina la subasta)
CREATE OR REPLACE FUNCTION public.reject_auction_result(p_auction_id uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $$
DECLARE
  v_auction public.auctions;
  v_user_id UUID;
  v_bid_count INTEGER;
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
    RETURN jsonb_build_object('success', false, 'message', 'Not authorized to reject this auction result');
  END IF;
  
  -- Check if auction is in ended status
  IF v_auction.status <> 'ended' THEN
    RETURN jsonb_build_object('success', false, 'message', 'Can only reject results for ended auctions');
  END IF;
  
  -- Count existing bids
  SELECT COUNT(*) INTO v_bid_count FROM public.bids WHERE auction_id = p_auction_id;
  
  -- Notify all bidders about the rejection
  IF v_bid_count > 0 THEN
    INSERT INTO public.auction_notifications (user_id, auction_id, type, content)
    SELECT DISTINCT bidder_id, p_auction_id, 'auction_result_rejected', 
           'The seller has rejected the auction result. The auction has been cancelled and removed.'
    FROM public.bids
    WHERE auction_id = p_auction_id AND bidder_id IS NOT NULL;
  END IF;
  
  -- Log the action before deletion
  INSERT INTO public.auction_audit_log (auction_id, user_id, action, details)
  VALUES (p_auction_id, v_user_id, 'reject_auction_result', jsonb_build_object(
    'winner_id', v_auction.winner_id,
    'final_price', v_auction.current_price,
    'bid_count', v_bid_count,
    'reason', 'seller_rejection'
  ));
  
  -- Update vehicle status back to available
  UPDATE public.vehicles
  SET status = 'available'
  WHERE id = v_auction.vehicle_id;
  
  -- Delete all related data in correct order to respect foreign key constraints
  -- Delete notifications first
  DELETE FROM public.auction_notifications WHERE auction_id = p_auction_id;
  
  -- Delete bids
  DELETE FROM public.bids WHERE auction_id = p_auction_id;
  
  -- Finally delete the auction
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
