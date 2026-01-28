-- Security Enhancement Phase 1 Part 3: Fix remaining database functions and triggers

-- 17. Fix create_system_notification function (updated version)
CREATE OR REPLACE FUNCTION public.create_system_notification(p_user_id uuid, p_subject text, p_content text, p_type text DEFAULT 'info'::text, p_notification_history_id uuid DEFAULT NULL::uuid)
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

-- 18. Fix update_unread_count trigger function
CREATE OR REPLACE FUNCTION public.update_unread_count()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.sender_id = (SELECT seller_id FROM public.conversations WHERE id = NEW.conversation_id) THEN
    UPDATE public.conversations
    SET unread_count = unread_count + 1
    WHERE id = NEW.conversation_id AND buyer_id != NEW.sender_id;
  ELSIF NEW.sender_id = (SELECT buyer_id FROM public.conversations WHERE id = NEW.conversation_id) THEN
    UPDATE public.conversations
    SET unread_count = unread_count + 1
    WHERE id = NEW.conversation_id AND seller_id != NEW.sender_id;
  END IF;
  RETURN NEW;
END;
$$;

-- 19. Fix reset_unread_count function
CREATE OR REPLACE FUNCTION public.reset_unread_count(p_conversation_id uuid, p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.conversations
  SET unread_count = 0
  WHERE id = p_conversation_id AND 
        ((seller_id = p_user_id) OR (buyer_id = p_user_id));
END;
$$;

-- 20. Fix mark_messages_as_read function
CREATE OR REPLACE FUNCTION public.mark_messages_as_read(p_conversation_id uuid, p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.messages
  SET read_at = NOW()
  WHERE conversation_id = p_conversation_id 
    AND sender_id != p_user_id 
    AND read_at IS NULL;
  
  UPDATE public.conversations
  SET unread_count = 0
  WHERE id = p_conversation_id AND 
        ((seller_id = p_user_id) OR (buyer_id = p_user_id));
END;
$$;

-- 21. Fix toggle_conversation_pin function
CREATE OR REPLACE FUNCTION public.toggle_conversation_pin(p_conversation_id uuid, p_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_is_pinned BOOLEAN;
  v_has_access BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM public.conversations
    WHERE id = p_conversation_id AND (seller_id = p_user_id OR buyer_id = p_user_id)
  ) INTO v_has_access;
  
  IF NOT v_has_access THEN
    RETURN false;
  END IF;
  
  SELECT is_pinned INTO v_is_pinned
  FROM public.conversations
  WHERE id = p_conversation_id;
  
  UPDATE public.conversations
  SET is_pinned = NOT v_is_pinned
  WHERE id = p_conversation_id;
  
  RETURN NOT v_is_pinned;
END;
$$;

-- 22. Fix get_user_rating_summary function
CREATE OR REPLACE FUNCTION public.get_user_rating_summary(p_user_id uuid)
RETURNS TABLE(average_rating numeric, total_ratings bigint, verified_ratings bigint)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    COALESCE(ROUND(AVG(rating::numeric), 1), 0) as average_rating,
    COUNT(*) as total_ratings,
    COUNT(*) FILTER (WHERE verified = true) as verified_ratings
  FROM public.ratings
  WHERE to_user_id = p_user_id;
$$;

-- 23. Fix create_profile_from_registration trigger function
CREATE OR REPLACE FUNCTION public.create_profile_from_registration()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
BEGIN
  IF NEW.status = 'approved' AND OLD.status != 'approved' THEN
    SELECT id INTO v_user_id
    FROM auth.users
    WHERE email = NEW.email;
    
    IF v_user_id IS NOT NULL THEN
      INSERT INTO public.profiles (
        id,
        company_name,
        full_name,
        contact_phone,
        country,
        business_type,
        trader_type,
        company_logo,
        email,
        created_at,
        updated_at,
        registration_date
      ) VALUES (
        v_user_id,
        NEW.company_name,
        NEW.contact_person,
        NEW.phone,
        NEW.country,
        NEW.business_type,
        NEW.trader_type,
        NEW.company_logo,
        NEW.email,
        NOW(),
        NOW(),
        NEW.created_at
      )
      ON CONFLICT (id) DO UPDATE SET
        company_name = EXCLUDED.company_name,
        full_name = EXCLUDED.full_name,
        contact_phone = EXCLUDED.contact_phone,
        country = EXCLUDED.country,
        business_type = EXCLUDED.business_type,
        trader_type = EXCLUDED.trader_type,
        company_logo = EXCLUDED.company_logo,
        email = EXCLUDED.email,
        updated_at = NOW();
        
      INSERT INTO public.activity_logs (
        user_id,
        action_type,
        entity_type,
        entity_id,
        details,
        severity
      ) VALUES (
        v_user_id,
        'auto_create_profile',
        'profile',
        v_user_id::text,
        jsonb_build_object(
          'source', 'registration_approval',
          'registration_id', NEW.id,
          'company_name', NEW.company_name
        ),
        'info'
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- 24. Fix validate_profile_data_transfer function
CREATE OR REPLACE FUNCTION public.validate_profile_data_transfer(p_registration_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_registration RECORD;
  v_profile RECORD;
  v_user_id UUID;
  v_result jsonb;
BEGIN
  SELECT * INTO v_registration
  FROM public.registration_requests
  WHERE id = p_registration_id;
  
  IF v_registration IS NULL THEN
    RETURN jsonb_build_object('success', false, 'message', 'Registration not found');
  END IF;
  
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE email = v_registration.email;
  
  IF v_user_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'message', 'User not found');
  END IF;
  
  SELECT * INTO v_profile
  FROM public.profiles
  WHERE id = v_user_id;
  
  IF v_profile IS NULL THEN
    RETURN jsonb_build_object('success', false, 'message', 'Profile not created');
  END IF;
  
  v_result := jsonb_build_object(
    'success', true,
    'data_validation', jsonb_build_object(
      'company_name_match', v_registration.company_name = v_profile.company_name,
      'contact_person_match', v_registration.contact_person = v_profile.full_name,
      'phone_match', v_registration.phone = v_profile.contact_phone,
      'country_match', v_registration.country = v_profile.country,
      'business_type_match', v_registration.business_type = v_profile.business_type,
      'trader_type_match', v_registration.trader_type = v_profile.trader_type
    )
  );
  
  RETURN v_result;
END;
$$;

-- 25. Fix update_conversation_timestamp trigger function
CREATE OR REPLACE FUNCTION public.update_conversation_timestamp()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.conversations
  SET updated_at = now()
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$;

-- 26. Fix cleanup_old_metrics function
CREATE OR REPLACE FUNCTION public.cleanup_old_metrics()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM public.performance_metrics 
  WHERE created_at < (NOW() - INTERVAL '7 days');
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$;

-- 27. Fix delete_announcement_file trigger function
CREATE OR REPLACE FUNCTION public.delete_announcement_file()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  file_path TEXT;
BEGIN
  IF OLD.attachment_url IS NOT NULL THEN
    file_path := regexp_replace(
      OLD.attachment_url, 
      '.*/storage/v1/object/public/announcement-files/', 
      ''
    );
    
    PERFORM storage.delete_object('announcement-files', file_path);
  END IF;
  
  RETURN OLD;
END;
$$;

-- 28. Fix update_operation_counts trigger function
CREATE OR REPLACE FUNCTION public.update_operation_counts()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.seller_id IS NOT NULL AND NEW.status = 'completed' THEN
    UPDATE public.profiles
    SET 
      total_operations = total_operations + 1,
      operations_breakdown = jsonb_set(
        jsonb_set(
          operations_breakdown,
          '{sells}',
          (COALESCE((operations_breakdown->>'sells')::integer, 0) + 1)::text::jsonb
        ),
        '{total}',
        (COALESCE((operations_breakdown->>'total')::integer, 0) + 1)::text::jsonb
      )
    WHERE id = NEW.seller_id;
  END IF;
  
  IF NEW.buyer_id IS NOT NULL AND NEW.status = 'completed' THEN
    UPDATE public.profiles
    SET 
      total_operations = total_operations + 1,
      operations_breakdown = jsonb_set(
        jsonb_set(
          operations_breakdown,
          '{buys}',
          (COALESCE((operations_breakdown->>'buys')::integer, 0) + 1)::text::jsonb
        ),
        '{total}',
        (COALESCE((operations_breakdown->>'total')::integer, 0) + 1)::text::jsonb
      )
    WHERE id = NEW.buyer_id;
  END IF;
  
  RETURN NEW;
END;
$$;

-- 29. Fix update_performance_optimizations_updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_performance_optimizations_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- 30. Fix update_notification_history_updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_notification_history_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- 31. Fix update_transport_quote_timestamp trigger function
CREATE OR REPLACE FUNCTION public.update_transport_quote_timestamp()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- 32. Fix update_vehicle_documents_updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_vehicle_documents_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- 33. Fix generate_case_number function
CREATE OR REPLACE FUNCTION public.generate_case_number()
RETURNS text
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  year_part TEXT := extract(year from now())::text;
  sequence_part TEXT;
BEGIN
  sequence_part := lpad(nextval('case_number_seq')::text, 6, '0');
  RETURN 'CASE-' || year_part || '-' || sequence_part;
END;
$$;