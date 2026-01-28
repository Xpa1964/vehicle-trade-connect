-- Drop existing versions of create_system_notification function
DROP FUNCTION IF EXISTS public.create_system_notification(uuid, text, text, text);
DROP FUNCTION IF EXISTS public.create_system_notification(uuid, text, text, text, uuid);

-- Create single unified version with optional notification_history_id parameter
CREATE OR REPLACE FUNCTION public.create_system_notification(
  p_user_id uuid,
  p_subject text,
  p_content text,
  p_type text DEFAULT 'info'::text,
  p_notification_history_id uuid DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_conversation_id UUID;
  v_message_id UUID;
BEGIN
  -- Create admin conversation
  INSERT INTO public.conversations (
    seller_id, buyer_id, is_admin_conversation, admin_sender_name,
    source_type, source_title, status, created_at, updated_at
  ) VALUES (
    NULL, p_user_id, true, 'Sistema KONTACT',
    'system_notification', p_subject, 'active', NOW(), NOW()
  )
  RETURNING id INTO v_conversation_id;
  
  -- Create message in conversation
  INSERT INTO public.messages (
    conversation_id, sender_id, content, original_language, created_at
  ) VALUES (
    v_conversation_id, NULL, p_content, 'es', NOW()
  )
  RETURNING id INTO v_message_id;
  
  -- Create user notification
  INSERT INTO public.user_notifications (
    user_id, notification_history_id, subject, content, type, is_read, created_at
  ) VALUES (
    p_user_id, p_notification_history_id, p_subject, p_content, p_type, false, NOW()
  );
  
  RETURN v_conversation_id;
END;
$function$;