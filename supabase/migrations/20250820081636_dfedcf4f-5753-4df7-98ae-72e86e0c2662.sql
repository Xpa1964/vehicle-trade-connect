-- Update the create_system_notification function to accept notification_history_id parameter
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
  v_notification_id UUID;
BEGIN
  -- Insert notification directly (bypassing RLS)
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
  )
  RETURNING id INTO v_notification_id;
  
  RETURN v_notification_id;
END;
$function$;