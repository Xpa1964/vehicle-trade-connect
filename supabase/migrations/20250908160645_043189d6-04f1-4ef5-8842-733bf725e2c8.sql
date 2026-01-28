-- Enhanced soft_delete_conversation function with detailed activity logging
CREATE OR REPLACE FUNCTION public.soft_delete_conversation(p_conversation_id uuid, p_user_id uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  v_conversation conversations;
  v_user_role TEXT;
  v_other_user_id UUID;
  v_message_count INTEGER;
  v_conversation_age INTERVAL;
BEGIN
  -- Get the conversation with details
  SELECT * INTO v_conversation 
  FROM conversations 
  WHERE id = p_conversation_id;
  
  -- Check if user has access to this conversation
  IF v_conversation.seller_id != p_user_id AND v_conversation.buyer_id != p_user_id THEN
    RETURN FALSE;
  END IF;
  
  -- Determine user role and other participant
  IF v_conversation.seller_id = p_user_id THEN
    v_user_role := 'seller';
    v_other_user_id := v_conversation.buyer_id;
  ELSIF v_conversation.buyer_id = p_user_id THEN
    v_user_role := 'buyer';
    v_other_user_id := v_conversation.seller_id;
  END IF;
  
  -- Get conversation metrics for logging
  SELECT COUNT(*) INTO v_message_count
  FROM messages 
  WHERE conversation_id = p_conversation_id;
  
  v_conversation_age := NOW() - v_conversation.created_at;
  
  -- Update deletion status based on user role
  IF v_conversation.seller_id = p_user_id THEN
    UPDATE conversations 
    SET deleted_by_seller = TRUE, seller_deleted_at = NOW()
    WHERE id = p_conversation_id;
  ELSIF v_conversation.buyer_id = p_user_id THEN
    UPDATE conversations 
    SET deleted_by_buyer = TRUE, buyer_deleted_at = NOW()
    WHERE id = p_conversation_id;
  END IF;
  
  -- Log detailed activity for admin oversight
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
      'source_type', v_conversation.source_type,
      'source_title', v_conversation.source_title,
      'vehicle_id', v_conversation.vehicle_id,
      'message_count', v_message_count,
      'conversation_age_hours', EXTRACT(EPOCH FROM v_conversation_age) / 3600,
      'was_pinned', v_conversation.is_pinned,
      'unread_count', v_conversation.unread_count,
      'conversation_status', v_conversation.status,
      'is_admin_conversation', v_conversation.is_admin_conversation,
      'deletion_timestamp', NOW()
    ),
    'warning'
  );
  
  RETURN TRUE;
END;
$function$;