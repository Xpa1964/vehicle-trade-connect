-- Fase 3A: Agregar search_path a funciones SECURITY DEFINER existentes
-- CAMBIOS 100% SEGUROS - Solo funciones que ya existen

-- Actualizar has_role (con parámetro p_role text, versión legacy)
CREATE OR REPLACE FUNCTION public.has_role(p_role text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM public.user_roles
    WHERE user_id = auth.uid() AND role::text = p_role
  );
END;
$$;

-- La función has_role(uuid, app_role) ya tiene search_path correcto
-- No necesita actualizarse