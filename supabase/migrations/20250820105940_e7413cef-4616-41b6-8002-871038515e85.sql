-- First, let's modify the conversations table to allow NULL seller_id for system notifications
-- and add a check to ensure system notifications have admin_sender_name
ALTER TABLE public.conversations 
ALTER COLUMN seller_id DROP NOT NULL;

-- Add a constraint to ensure system notifications are properly configured
ALTER TABLE public.conversations 
ADD CONSTRAINT conversations_admin_check 
CHECK (
  (is_admin_conversation = false AND seller_id IS NOT NULL) OR 
  (is_admin_conversation = true AND admin_sender_name IS NOT NULL)
);

-- Recreate the create_system_notification function with NULL seller_id for system notifications
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
BEGIN
  -- Create a conversation for this notification (seller_id is NULL for system notifications)
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
    NULL,             -- NULL seller_id for system notifications
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
  
  -- Create the message with the notification content (using NULL sender_id for system)
  INSERT INTO public.messages (
    conversation_id,
    sender_id,
    content,
    original_language,
    created_at
  ) VALUES (
    v_conversation_id,
    NULL,             -- NULL sender_id for system messages
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