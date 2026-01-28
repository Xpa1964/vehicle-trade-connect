-- First, recreate the create_system_notification function using existing admin user
CREATE OR REPLACE FUNCTION public.create_system_notification(
  p_user_id uuid, 
  p_subject text, 
  p_content text, 
  p_type text DEFAULT 'info'::text,
  p_notification_history_id uuid DEFAULT NULL::uuid
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_conversation_id UUID;
  v_message_id UUID;
  v_admin_user_id UUID;
BEGIN
  -- Use any existing admin user as the system sender
  SELECT user_id INTO v_admin_user_id 
  FROM user_roles 
  WHERE role = 'admin'::app_role 
  LIMIT 1;
  
  -- If no admin found, skip conversation creation and just create notification
  IF v_admin_user_id IS NULL THEN
    INSERT INTO public.user_notifications (
      user_id,
      notification_history_id,
      subject,
      content,
      type,
      is_read,
      created_at
    ) VALUES (
      p_user_id,
      p_notification_history_id,
      p_subject,
      p_content,
      p_type,
      false,
      NOW()
    );
    RETURN NULL;
  END IF;
  
  -- Create a conversation for this notification
  INSERT INTO public.conversations (
    seller_id,
    buyer_id,
    is_admin_conversation,
    admin_sender_name,
    source_type,
    source_title,
    status,
    created_at,
    updated_at
  ) VALUES (
    v_admin_user_id,  -- Admin user as seller
    p_user_id,        -- User as buyer
    true,             -- Mark as admin conversation
    'Sistema KONTACT', -- Admin sender name
    'system_notification',
    p_subject,        -- Use subject as source title
    'active',
    NOW(),
    NOW()
  )
  RETURNING id INTO v_conversation_id;
  
  -- Create the message with the notification content
  INSERT INTO public.messages (
    conversation_id,
    sender_id,
    content,
    original_language,
    created_at
  ) VALUES (
    v_conversation_id,
    v_admin_user_id,  -- Admin sends the message
    p_content,
    'es',             -- Default to Spanish
    NOW()
  )
  RETURNING id INTO v_message_id;
  
  -- Also create the user_notification record for tracking purposes
  INSERT INTO public.user_notifications (
    user_id,
    notification_history_id,
    subject,
    content,
    type,
    is_read,
    created_at
  ) VALUES (
    p_user_id,
    p_notification_history_id,
    p_subject,
    p_content,
    p_type,
    false,
    NOW()
  );
  
  RETURN v_conversation_id;
END;
$function$;