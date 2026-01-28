-- PHASE 2: DATABASE FUNCTION SECURITY - Add search_path to critical functions

-- Fix critical authentication and security functions
CREATE OR REPLACE FUNCTION public.get_user_role(p_user_id uuid)
 RETURNS app_role
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_role app_role;
BEGIN
  SELECT ur.role INTO v_role 
  FROM public.user_roles ur
  WHERE ur.user_id = p_user_id;
  
  RETURN COALESCE(v_role, 'user'::app_role);
END;
$function$;

CREATE OR REPLACE FUNCTION public.has_role(p_role text)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM public.user_roles
    WHERE user_id = auth.uid() AND role::text = p_role
  );
END;
$function$;

CREATE OR REPLACE FUNCTION public.admin_update_user_role(p_user_id uuid, p_new_role text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_is_admin BOOLEAN;
  v_current_role TEXT;
  v_current_user_id UUID;
BEGIN
  -- Get current user ID
  v_current_user_id := auth.uid();
  
  -- Prevent admin operations on self (to avoid lockout)
  IF v_current_user_id = p_user_id THEN
    RETURN jsonb_build_object('success', false, 'message', 'Cannot modify your own role');
  END IF;
  
  -- Verify current user is admin
  SELECT EXISTS (
    SELECT 1 
    FROM public.user_roles
    WHERE user_id = v_current_user_id AND role::text = 'admin'
  ) INTO v_is_admin;
  
  IF NOT v_is_admin THEN
    RETURN jsonb_build_object('success', false, 'message', 'Unauthorized: Admin role required');
  END IF;
  
  -- Get current role of target user
  SELECT role::text INTO v_current_role
  FROM public.user_roles
  WHERE user_id = p_user_id;
  
  -- Prevent changing another admin's role (additional protection)
  IF v_current_role = 'admin' THEN
    RETURN jsonb_build_object('success', false, 'message', 'Cannot modify admin roles');
  END IF;
  
  -- Update role if different
  IF v_current_role != p_new_role THEN
    DELETE FROM public.user_roles WHERE user_id = p_user_id;
    INSERT INTO public.user_roles (user_id, role)
    VALUES (p_user_id, p_new_role::app_role);
    
    -- Log the role change
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
$function$;

CREATE OR REPLACE FUNCTION public.can_view_profile(profile_user_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  current_user_id uuid;
BEGIN
  current_user_id := auth.uid();
  
  -- User can always view their own profile
  IF current_user_id = profile_user_id THEN
    RETURN true;
  END IF;
  
  -- Admins can view all profiles
  IF EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = current_user_id AND role = 'admin'::app_role
  ) THEN
    RETURN true;
  END IF;
  
  -- Check if users are connected through vehicles, conversations, auctions, transactions, or ratings
  IF EXISTS (
    -- Vehicle relationships
    SELECT 1 FROM public.vehicles v
    WHERE v.user_id = profile_user_id AND v.status IN ('available', 'reserved', 'sold')
    UNION
    -- Conversation relationships
    SELECT 1 FROM public.conversations c
    WHERE (c.seller_id = profile_user_id AND c.buyer_id = current_user_id)
       OR (c.buyer_id = profile_user_id AND c.seller_id = current_user_id)
    UNION
    -- Auction relationships
    SELECT 1 FROM public.auctions a
    JOIN public.bids b ON a.id = b.auction_id
    WHERE (a.created_by = profile_user_id AND b.bidder_id = current_user_id)
       OR (a.created_by = current_user_id AND b.bidder_id = profile_user_id)
       OR (a.winner_id = profile_user_id AND a.created_by = current_user_id)
       OR (a.winner_id = current_user_id AND a.created_by = profile_user_id)
    UNION
    -- Transaction relationships
    SELECT 1 FROM public.transactions t
    WHERE (t.seller_id = profile_user_id AND t.buyer_id = current_user_id)
       OR (t.buyer_id = profile_user_id AND t.seller_id = current_user_id)
    UNION
    -- Rating relationships
    SELECT 1 FROM public.ratings r
    WHERE (r.from_user_id = profile_user_id AND r.to_user_id = current_user_id)
       OR (r.to_user_id = profile_user_id AND r.from_user_id = current_user_id)
  ) THEN
    RETURN true;
  END IF;
  
  RETURN false;
END;
$function$;