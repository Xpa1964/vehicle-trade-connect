
-- Drop dead columns
ALTER TABLE public.user_notifications DROP COLUMN IF EXISTS "read";
ALTER TABLE public.user_notifications DROP COLUMN IF EXISTS message;

-- Update function to stop referencing dropped columns
CREATE OR REPLACE FUNCTION public.create_system_notification(
  p_user_id uuid,
  p_title text,
  p_message text DEFAULT NULL::text,
  p_type text DEFAULT 'info'::text,
  p_link text DEFAULT NULL::text,
  p_subject text DEFAULT NULL::text,
  p_content text DEFAULT NULL::text
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_id UUID;
BEGIN
  INSERT INTO public.user_notifications (user_id, title, type, link, subject, content, is_read)
  VALUES (
    p_user_id,
    COALESCE(p_subject, p_title),
    p_type,
    p_link,
    p_subject,
    COALESCE(p_content, p_message),
    false
  )
  RETURNING id INTO v_id;
  RETURN v_id;
END;
$function$;
