-- Security Enhancement Phase 1: Database Function Hardening
-- Fix all database functions to prevent search path injection attacks

-- 1. Fix has_role function
CREATE OR REPLACE FUNCTION public.has_role(p_role text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM public.user_roles
    WHERE user_id = auth.uid() AND role::text = p_role
  );
END;
$$;

-- 2. Fix get_user_role function
CREATE OR REPLACE FUNCTION public.get_user_role(p_user_id uuid)
RETURNS app_role
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_role app_role;
BEGIN
  SELECT ur.role INTO v_role 
  FROM public.user_roles ur
  WHERE ur.user_id = p_user_id;
  
  RETURN COALESCE(v_role, 'user'::app_role);
END;
$$;

-- 3. Fix admin_update_user_role function
CREATE OR REPLACE FUNCTION public.admin_update_user_role(p_user_id uuid, p_new_role text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_is_admin BOOLEAN;
  v_current_role TEXT;
  v_current_user_id UUID;
BEGIN
  v_current_user_id := auth.uid();
  
  IF v_current_user_id = p_user_id THEN
    RETURN jsonb_build_object('success', false, 'message', 'Cannot modify your own role');
  END IF;
  
  SELECT EXISTS (
    SELECT 1 
    FROM public.user_roles
    WHERE user_id = v_current_user_id AND role::text = 'admin'
  ) INTO v_is_admin;
  
  IF NOT v_is_admin THEN
    RETURN jsonb_build_object('success', false, 'message', 'Unauthorized: Admin role required');
  END IF;
  
  SELECT role::text INTO v_current_role
  FROM public.user_roles
  WHERE user_id = p_user_id;
  
  IF v_current_role = 'admin' THEN
    RETURN jsonb_build_object('success', false, 'message', 'Cannot modify admin roles');
  END IF;
  
  IF v_current_role != p_new_role THEN
    DELETE FROM public.user_roles WHERE user_id = p_user_id;
    INSERT INTO public.user_roles (user_id, role)
    VALUES (p_user_id, p_new_role::app_role);
    
    INSERT INTO public.activity_logs (
      user_id, action_type, entity_type, entity_id, details, severity
    ) VALUES (
      v_current_user_id, 'admin_role_change', 'user', p_user_id::text,
      jsonb_build_object(
        'previous_role', v_current_role,
        'new_role', p_new_role,
        'target_user', p_user_id
      ), 'warning'
    );
  END IF;
  
  RETURN jsonb_build_object('success', true, 'message', 'Role updated successfully');
END;
$$;

-- 4. Fix admin_update_user_profile function
CREATE OR REPLACE FUNCTION public.admin_update_user_profile(p_user_id uuid, p_full_name text, p_company_name text, p_contact_phone text, p_country text, p_address text, p_business_type text, p_trader_type text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_is_admin BOOLEAN;
  v_current_user_id UUID;
BEGIN
  v_current_user_id := auth.uid();
  
  SELECT EXISTS (
    SELECT 1 
    FROM public.user_roles
    WHERE user_id = v_current_user_id AND role::text = 'admin'
  ) INTO v_is_admin;
  
  IF NOT v_is_admin THEN
    RETURN jsonb_build_object('success', false, 'message', 'Unauthorized: Admin role required');
  END IF;
  
  UPDATE public.profiles
  SET 
    full_name = p_full_name,
    company_name = p_company_name,
    contact_phone = p_contact_phone,
    country = p_country,
    address = p_address,
    business_type = p_business_type,
    trader_type = p_trader_type,
    updated_at = NOW()
  WHERE id = p_user_id;
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'message', 'User profile not found');
  END IF;
  
  INSERT INTO public.activity_logs (
    user_id, action_type, entity_type, entity_id, details, severity
  ) VALUES (
    v_current_user_id, 'admin_profile_update', 'profile', p_user_id::text,
    jsonb_build_object('target_user', p_user_id), 'info'
  );
  
  RETURN jsonb_build_object('success', true, 'message', 'Profile updated successfully');
END;
$$;

-- 5. Fix log_activity function
CREATE OR REPLACE FUNCTION public.log_activity(p_user_id uuid, p_action_type text, p_entity_type text DEFAULT NULL::text, p_entity_id text DEFAULT NULL::text, p_details jsonb DEFAULT NULL::jsonb, p_severity text DEFAULT 'info'::text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_log_id UUID;
BEGIN
  INSERT INTO public.activity_logs (
    user_id, action_type, entity_type, entity_id, details, severity
  ) VALUES (
    p_user_id, p_action_type, p_entity_type, p_entity_id, p_details, p_severity
  )
  RETURNING id INTO v_log_id;
  
  RETURN v_log_id;
END;
$$;

-- 6. Fix can_view_profile function
CREATE OR REPLACE FUNCTION public.can_view_profile(profile_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_user_id uuid;
BEGIN
  current_user_id := auth.uid();
  
  IF current_user_id = profile_user_id THEN
    RETURN true;
  END IF;
  
  IF EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = current_user_id AND role = 'admin'::app_role
  ) THEN
    RETURN true;
  END IF;
  
  IF EXISTS (
    SELECT 1 FROM public.vehicles v
    WHERE v.user_id = profile_user_id AND v.status IN ('available', 'reserved', 'sold')
    UNION
    SELECT 1 FROM public.conversations c
    WHERE (c.seller_id = profile_user_id AND c.buyer_id = current_user_id)
       OR (c.buyer_id = profile_user_id AND c.seller_id = current_user_id)
    UNION
    SELECT 1 FROM public.auctions a
    JOIN public.bids b ON a.id = b.auction_id
    WHERE (a.created_by = profile_user_id AND b.bidder_id = current_user_id)
       OR (a.created_by = current_user_id AND b.bidder_id = profile_user_id)
    UNION
    SELECT 1 FROM public.transactions t
    WHERE (t.seller_id = profile_user_id AND t.buyer_id = current_user_id)
       OR (t.buyer_id = profile_user_id AND t.seller_id = current_user_id)
  ) THEN
    RETURN true;
  END IF;
  
  RETURN false;
END;
$$;

-- 7. Fix place_bid function (auction functions)
CREATE OR REPLACE FUNCTION public.place_bid(p_auction_id uuid, p_amount numeric)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
  v_user_id := auth.uid();
  
  SELECT * INTO v_auction FROM public.auctions WHERE id = p_auction_id;
  
  IF v_auction IS NULL THEN
    RETURN jsonb_build_object('success', false, 'message', 'Auction not found');
  END IF;
  
  IF v_auction.status <> 'active' THEN
    RETURN jsonb_build_object('success', false, 'message', 'Auction is not active');
  END IF;
  
  IF v_auction.end_date <= NOW() THEN
    RETURN jsonb_build_object('success', false, 'message', 'Auction has ended');
  END IF;
  
  IF v_auction.created_by = v_user_id THEN
    RETURN jsonb_build_object('success', false, 'message', 'Auction creator cannot place bids');
  END IF;
  
  v_current_highest_bid := v_auction.current_price;
  
  SELECT bidder_id INTO v_previous_highest_bidder 
  FROM public.bids 
  WHERE auction_id = p_auction_id AND amount = v_current_highest_bid
  ORDER BY created_at DESC
  LIMIT 1;
  
  IF p_amount < (v_current_highest_bid + v_auction.increment_minimum) THEN
    RETURN jsonb_build_object('success', false, 'message', format('Bid must be at least %s above current price', v_auction.increment_minimum));
  END IF;
  
  v_time_remaining := v_auction.end_date - NOW();
  IF v_time_remaining <= INTERVAL '10 minutes' THEN
    v_new_end_date := v_auction.end_date + INTERVAL '5 minutes';
    v_extended := true;
    
    UPDATE public.auctions
    SET end_date = v_new_end_date, updated_at = NOW()
    WHERE id = p_auction_id;
    
    INSERT INTO public.auction_audit_log (auction_id, user_id, action, details)
    VALUES (p_auction_id, v_user_id, 'anti_snipe_extension', jsonb_build_object(
      'original_end_date', v_auction.end_date,
      'new_end_date', v_new_end_date,
      'bid_amount', p_amount
    ));
  END IF;
  
  INSERT INTO public.bids (auction_id, bidder_id, amount)
  VALUES (p_auction_id, v_user_id, p_amount);
  
  UPDATE public.auctions
  SET current_price = p_amount, updated_at = NOW()
  WHERE id = p_auction_id;
  
  IF v_previous_highest_bidder IS NOT NULL AND v_previous_highest_bidder <> v_user_id THEN
    INSERT INTO public.auction_notifications (user_id, auction_id, type, content)
    VALUES (v_previous_highest_bidder, p_auction_id, 'outbid', format('You have been outbid on an auction. Current highest bid is %s', p_amount));
  END IF;
  
  IF v_extended THEN
    INSERT INTO public.auction_notifications (user_id, auction_id, type, content)
    SELECT DISTINCT bidder_id, p_auction_id, 'auction_extended', 
           format('Auction has been extended by 5 minutes due to anti-sniping measures. New end time: %s', v_new_end_date)
    FROM public.bids
    WHERE auction_id = p_auction_id AND bidder_id IS NOT NULL AND bidder_id <> v_user_id;
    
    INSERT INTO public.auction_notifications (user_id, auction_id, type, content)
    VALUES (v_auction.created_by, p_auction_id, 'auction_extended', 
            format('Your auction has been extended by 5 minutes due to anti-sniping measures. New end time: %s', v_new_end_date));
  END IF;
  
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
$$;

-- 8. Fix accept_bid function
CREATE OR REPLACE FUNCTION public.accept_bid(p_auction_id uuid, p_bid_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_auction public.auctions;
  v_bid public.bids;
  v_user_id UUID;
BEGIN
  v_user_id := auth.uid();
  
  SELECT * INTO v_auction FROM public.auctions WHERE id = p_auction_id;
  
  IF v_auction IS NULL THEN
    RETURN jsonb_build_object('success', false, 'message', 'Auction not found');
  END IF;
  
  IF v_auction.created_by <> v_user_id THEN
    RETURN jsonb_build_object('success', false, 'message', 'Not authorized to accept bids for this auction');
  END IF;
  
  IF v_auction.status <> 'active' THEN
    RETURN jsonb_build_object('success', false, 'message', 'Can only accept bids on active auctions');
  END IF;
  
  SELECT * INTO v_bid FROM public.bids WHERE id = p_bid_id AND auction_id = p_auction_id;
  
  IF v_bid IS NULL THEN
    RETURN jsonb_build_object('success', false, 'message', 'Bid not found for this auction');
  END IF;
  
  UPDATE public.auctions
  SET 
    seller_accepted_bid_id = p_bid_id,
    seller_accepted_at = NOW(),
    status = 'completed',
    winner_id = v_bid.bidder_id,
    updated_at = NOW()
  WHERE id = p_auction_id;
  
  UPDATE public.vehicles
  SET status = 'reserved'
  WHERE id = v_auction.vehicle_id;
  
  INSERT INTO public.auction_notifications (user_id, auction_id, type, content)
  VALUES (v_bid.bidder_id, p_auction_id, 'bid_accepted', 
          format('Congratulations! Your bid of %s has been accepted by the seller', v_bid.amount));
  
  INSERT INTO public.auction_notifications (user_id, auction_id, type, content)
  SELECT DISTINCT bidder_id, p_auction_id, 'auction_ended_early', 
         'The auction has ended early as the seller accepted a bid'
  FROM public.bids
  WHERE auction_id = p_auction_id AND bidder_id IS NOT NULL AND bidder_id <> v_bid.bidder_id;
  
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
$$;

-- Continue with more critical functions in next part...