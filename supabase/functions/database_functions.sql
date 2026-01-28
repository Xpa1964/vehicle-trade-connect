
-- Function to fetch permissions safely
CREATE OR REPLACE FUNCTION public.fetch_permissions()
RETURNS SETOF public.permissions
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT * FROM public.permissions ORDER BY category, name;
$$;

-- Function to fetch role permissions safely
CREATE OR REPLACE FUNCTION public.fetch_role_permissions()
RETURNS TABLE (
  id UUID,
  role TEXT,
  permission JSONB,
  created_at TIMESTAMPTZ
)
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT id, role::TEXT, permission, created_at 
  FROM public.role_permissions
  ORDER BY role;
$$;

-- Improved has_role function with proper parameter names and handling
CREATE OR REPLACE FUNCTION public.has_role(p_user_id uuid, p_role text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_result boolean;
BEGIN
  -- Direct query to get whether the user has the role
  SELECT EXISTS (
    SELECT 1 
    FROM public.user_roles
    WHERE user_id = p_user_id AND role::text = p_role
  ) INTO v_result;
  
  -- Log the result for debugging
  RAISE NOTICE 'has_role check for user_id % and role %: %', p_user_id, p_role, v_result;
  
  RETURN v_result;
END;
$$;

-- Helper function to check current user's role without parameters
-- This helps prevent recursive RLS issues
CREATE OR REPLACE FUNCTION public.has_admin_role()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_result boolean;
BEGIN
  -- Direct query to check if current user has admin role
  SELECT EXISTS (
    SELECT 1 
    FROM public.user_roles
    WHERE user_id = auth.uid() AND role::text = 'admin'
  ) INTO v_result;
  
  -- Log the result for debugging
  RAISE NOTICE 'has_admin_role check for auth.uid() %: %', auth.uid(), v_result;
  
  RETURN v_result;
END;
$$;

-- Helper function to check if current user is a moderator
CREATE OR REPLACE FUNCTION public.has_moderator_role()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_result boolean;
BEGIN
  -- Direct query to check if current user has moderator role
  SELECT EXISTS (
    SELECT 1 
    FROM public.user_roles
    WHERE user_id = auth.uid() AND role::text = 'moderator'
  ) INTO v_result;
  
  -- Log the result for debugging
  RAISE NOTICE 'has_moderator_role check for auth.uid() %: %', auth.uid(), v_result;
  
  RETURN v_result;
END;
$$;

-- Function to explicitly check and return the user's role as text
CREATE OR REPLACE FUNCTION public.get_user_role(p_user_id uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_role text;
BEGIN
  -- Direct query to get the user's role with explicit text casting
  SELECT role::text INTO v_role 
  FROM public.user_roles
  WHERE user_id = p_user_id;
  
  -- Log the result for debugging
  RAISE NOTICE 'get_user_role for user_id %: %', p_user_id, v_role;
  
  -- Return default role if none found
  RETURN COALESCE(v_role, 'user');
END;
$$;

-- Function to explicitly check if a user has specific permission (admin or moderator)
CREATE OR REPLACE FUNCTION public.can_manage_registration_requests(p_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_can_manage boolean;
BEGIN
  -- Check if user has admin or moderator role
  SELECT EXISTS (
    SELECT 1 
    FROM public.user_roles
    WHERE user_id = p_user_id 
    AND (role::text = 'admin' OR role::text = 'moderator')
  ) INTO v_can_manage;
  
  -- Log the result for debugging
  RAISE NOTICE 'can_manage_registration_requests for user_id %: %', p_user_id, v_can_manage;
  
  RETURN v_can_manage;
END;
$$;
