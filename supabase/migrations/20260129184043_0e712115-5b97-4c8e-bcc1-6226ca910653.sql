-- Create security definer function to get user role (avoids RLS recursion)
CREATE OR REPLACE FUNCTION public.get_user_role(p_user_id uuid)
RETURNS app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role
  FROM public.user_roles
  WHERE user_id = p_user_id
  LIMIT 1
$$;