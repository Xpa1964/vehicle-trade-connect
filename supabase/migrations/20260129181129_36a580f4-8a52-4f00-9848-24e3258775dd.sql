-- Final batch: remaining columns and functions

-- 1. Add unread_count to conversations
ALTER TABLE public.conversations
ADD COLUMN IF NOT EXISTS unread_count INTEGER DEFAULT 0;

-- 2. Add chassis_number and other columns to transport_quotes  
ALTER TABLE public.transport_quotes
ADD COLUMN IF NOT EXISTS chassis_number TEXT,
ADD COLUMN IF NOT EXISTS version TEXT,
ADD COLUMN IF NOT EXISTS origin_address TEXT,
ADD COLUMN IF NOT EXISTS destination_address TEXT;

-- 3. Create admin_update_user_profile function
CREATE OR REPLACE FUNCTION public.admin_update_user_profile(
  p_user_id UUID,
  p_profile_data JSONB
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.profiles 
  SET 
    full_name = COALESCE(p_profile_data->>'full_name', full_name),
    company_name = COALESCE(p_profile_data->>'company_name', company_name),
    phone = COALESCE(p_profile_data->>'phone', phone),
    updated_at = now()
  WHERE user_id = p_user_id;
  RETURN FOUND;
END;
$$;

-- 4. Create admin_update_user_role function
CREATE OR REPLACE FUNCTION public.admin_update_user_role(
  p_user_id UUID,
  p_new_role public.app_role
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (p_user_id, p_new_role)
  ON CONFLICT (user_id) DO UPDATE SET role = p_new_role, updated_at = now();
  RETURN true;
END;
$$;

-- 5. Create log_activity function
CREATE OR REPLACE FUNCTION public.log_activity(
  p_user_id UUID,
  p_action_type TEXT,
  p_entity_type TEXT DEFAULT NULL,
  p_entity_id TEXT DEFAULT NULL,
  p_details JSONB DEFAULT '{}'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id UUID;
BEGIN
  INSERT INTO public.activity_logs (user_id, action_type, entity_type, entity_id, details)
  VALUES (p_user_id, p_action_type, p_entity_type, p_entity_id, p_details)
  RETURNING id INTO v_id;
  RETURN v_id;
END;
$$;