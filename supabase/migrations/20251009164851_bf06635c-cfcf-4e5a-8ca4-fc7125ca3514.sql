-- Solución de seguridad: Restringir acceso a información de contacto en perfiles
-- Solo usuarios con interacciones directas pueden ver información completa

-- 1. Eliminar políticas demasiado permisivas
DROP POLICY IF EXISTS "Users can view vehicle owner profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view auction participant profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view conversation participant profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view rating participant profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view transaction participant profiles" ON public.profiles;

-- 2. Crear una política consolidada basada en la función can_view_profile
CREATE POLICY "Users can view profiles with direct interactions"
ON public.profiles
FOR SELECT
TO authenticated
USING (can_view_profile(id));

-- 3. Crear una vista pública limitada para información básica de vehículos
-- Esta vista solo expone información NO sensible
CREATE OR REPLACE VIEW public.public_profiles AS
SELECT 
  id,
  company_name,
  trader_type,
  country,
  total_operations,
  operations_breakdown,
  registration_date,
  -- Solo mostrar company_logo si show_contact_details es true
  CASE WHEN show_contact_details THEN company_logo ELSE NULL END as company_logo
FROM public.profiles
WHERE show_business_stats = true;

-- 4. Dar permisos de lectura a la vista pública
GRANT SELECT ON public.public_profiles TO authenticated;

-- 5. Crear política RLS para la vista
ALTER VIEW public.public_profiles SET (security_invoker = true);

-- 6. Añadir comentarios explicativos
COMMENT ON POLICY "Users can view profiles with direct interactions" ON public.profiles IS 
'Permite ver perfiles completos solo a usuarios que tienen interacciones directas: conversaciones, transacciones, subastas o valoraciones';

COMMENT ON VIEW public.public_profiles IS 
'Vista pública con información limitada de perfiles, sin datos de contacto sensibles como email, teléfono o dirección';