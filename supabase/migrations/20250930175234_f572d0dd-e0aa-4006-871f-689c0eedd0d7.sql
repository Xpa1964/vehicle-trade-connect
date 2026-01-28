-- Security hardening: Add search_path to critical database functions
-- This prevents SQL injection attacks by ensuring proper schema resolution

-- Update authentication and authorization functions
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

-- Update activity logging with search_path
CREATE OR REPLACE FUNCTION public.log_activity(
  p_user_id uuid, 
  p_action_type text, 
  p_entity_type text DEFAULT NULL, 
  p_entity_id text DEFAULT NULL, 
  p_details jsonb DEFAULT NULL, 
  p_severity text DEFAULT 'info'
)
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

-- Update profile access function
CREATE OR REPLACE FUNCTION public.can_view_profile(profile_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
STABLE 
SECURITY DEFINER
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

-- Update admin functions
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

CREATE OR REPLACE FUNCTION public.admin_update_user_profile(
  p_user_id uuid, 
  p_full_name text, 
  p_company_name text, 
  p_contact_phone text, 
  p_country text, 
  p_address text, 
  p_business_type text, 
  p_trader_type text
)
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

-- Update conversation management
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

-- Update the 5-parameter version of create_system_notification
CREATE OR REPLACE FUNCTION public.create_system_notification(
  p_user_id uuid, 
  p_subject text, 
  p_content text, 
  p_type text DEFAULT 'info', 
  p_notification_history_id uuid DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_conversation_id UUID;
  v_message_id UUID;
BEGIN
  INSERT INTO public.conversations (
    seller_id, buyer_id, is_admin_conversation, admin_sender_name,
    source_type, source_title, status, created_at, updated_at
  ) VALUES (
    NULL, p_user_id, true, 'Sistema KONTACT',
    'system_notification', p_subject, 'active', NOW(), NOW()
  )
  RETURNING id INTO v_conversation_id;
  
  INSERT INTO public.messages (
    conversation_id, sender_id, content, original_language, created_at
  ) VALUES (
    v_conversation_id, NULL, p_content, 'es', NOW()
  )
  RETURNING id INTO v_message_id;
  
  INSERT INTO public.user_notifications (
    user_id, notification_history_id, subject, content, type, is_read, created_at
  ) VALUES (
    p_user_id, p_notification_history_id, p_subject, p_content, p_type, false, NOW()
  );
  
  RETURN v_conversation_id;
END;
$$;

-- Add security documentation comments
COMMENT ON FUNCTION public.get_user_role IS 'Security hardened: search_path prevents SQL injection';
COMMENT ON FUNCTION public.has_role IS 'Security hardened: search_path prevents SQL injection';
COMMENT ON FUNCTION public.log_activity IS 'Security hardened: search_path prevents SQL injection';
COMMENT ON FUNCTION public.can_view_profile IS 'Security hardened: search_path prevents SQL injection';
COMMENT ON FUNCTION public.admin_update_user_role IS 'Security hardened: search_path prevents SQL injection';
COMMENT ON FUNCTION public.admin_update_user_profile IS 'Security hardened: search_path prevents SQL injection';
COMMENT ON FUNCTION public.create_system_notification(uuid, text, text, text, uuid) IS 'Security hardened: search_path prevents SQL injection';
COMMENT ON FUNCTION public.soft_delete_conversation IS 'Security hardened: search_path prevents SQL injection';