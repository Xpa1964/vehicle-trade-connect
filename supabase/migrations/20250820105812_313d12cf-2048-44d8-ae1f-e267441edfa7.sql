-- First, recreate the create_system_notification function that creates both notification and conversation
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
  -- Get or create a system admin user ID (using a fixed UUID for system notifications)
  v_admin_user_id := '00000000-0000-0000-0000-000000000000'::uuid;
  
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
    v_admin_user_id,  -- System as seller
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
    v_admin_user_id,  -- System sends the message
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

-- Now migrate existing notifications to create conversations for them
DO $$
DECLARE
    notification_record RECORD;
    v_conversation_id UUID;
    v_message_id UUID;
    v_admin_user_id UUID := '00000000-0000-0000-0000-000000000000'::uuid;
BEGIN
    -- Process all existing notifications that don't have corresponding conversations
    FOR notification_record IN 
        SELECT DISTINCT un.user_id, un.subject, un.content, un.type, un.created_at
        FROM user_notifications un
        WHERE NOT EXISTS (
            SELECT 1 FROM conversations c 
            WHERE c.buyer_id = un.user_id 
            AND c.is_admin_conversation = true 
            AND c.source_title = un.subject
        )
        AND un.created_at > '2025-08-19'::date  -- Only recent notifications
        ORDER BY un.created_at DESC
    LOOP
        -- Create conversation for this notification
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
            v_admin_user_id,
            notification_record.user_id,
            true,
            'Sistema KONTACT',
            'system_notification',
            notification_record.subject,
            'active',
            notification_record.created_at,
            notification_record.created_at
        )
        RETURNING id INTO v_conversation_id;
        
        -- Create the message
        INSERT INTO public.messages (
            conversation_id,
            sender_id,
            content,
            original_language,
            created_at
        ) VALUES (
            v_conversation_id,
            v_admin_user_id,
            notification_record.content,
            'es',
            notification_record.created_at
        );
        
    END LOOP;
END $$;