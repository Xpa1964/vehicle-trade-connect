
-- Función SECURITY DEFINER para actualizar perfiles de usuarios (solo admins)
CREATE OR REPLACE FUNCTION public.admin_update_user_profile(
  p_user_id UUID,
  p_full_name TEXT,
  p_company_name TEXT,
  p_contact_phone TEXT,
  p_country TEXT,
  p_address TEXT,
  p_business_type TEXT,
  p_trader_type TEXT
) RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_is_admin BOOLEAN;
BEGIN
  -- Verificar que el usuario actual es admin
  SELECT EXISTS (
    SELECT 1 
    FROM public.user_roles
    WHERE user_id = auth.uid() AND role::text = 'admin'
  ) INTO v_is_admin;
  
  IF NOT v_is_admin THEN
    RETURN jsonb_build_object('success', false, 'message', 'Unauthorized: Admin role required');
  END IF;
  
  -- Actualizar el perfil del usuario
  UPDATE public.profiles
  SET 
    full_name = p_full_name,
    company_name = p_company_name,
    contact_phone = p_contact_phone,
    country = p_country,
    address = p_address,
    business_type = p_business_type,
    trader_type = p_trader_type,
    updated_at = NOW()
  WHERE id = p_user_id;
  
  -- Verificar si se actualizó alguna fila
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'message', 'User profile not found');
  END IF;
  
  RETURN jsonb_build_object('success', true, 'message', 'Profile updated successfully');
END;
$$;

-- Función SECURITY DEFINER para actualizar roles de usuarios (solo admins)
CREATE OR REPLACE FUNCTION public.admin_update_user_role(
  p_user_id UUID,
  p_new_role TEXT
) RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_is_admin BOOLEAN;
  v_current_role TEXT;
BEGIN
  -- Verificar que el usuario actual es admin
  SELECT EXISTS (
    SELECT 1 
    FROM public.user_roles
    WHERE user_id = auth.uid() AND role::text = 'admin'
  ) INTO v_is_admin;
  
  IF NOT v_is_admin THEN
    RETURN jsonb_build_object('success', false, 'message', 'Unauthorized: Admin role required');
  END IF;
  
  -- Obtener el rol actual del usuario
  SELECT role::text INTO v_current_role
  FROM public.user_roles
  WHERE user_id = p_user_id;
  
  -- Si el rol es diferente, actualizarlo
  IF v_current_role != p_new_role THEN
    -- Eliminar rol existente
    DELETE FROM public.user_roles WHERE user_id = p_user_id;
    
    -- Insertar nuevo rol
    INSERT INTO public.user_roles (user_id, role)
    VALUES (p_user_id, p_new_role::app_role);
  END IF;
  
  RETURN jsonb_build_object('success', true, 'message', 'Role updated successfully');
END;
$$;
