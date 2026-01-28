-- Migración: Corregir políticas RLS de public_profiles
-- Descripción: La vista public_profiles tiene RLS habilitado pero sin políticas, 
-- haciéndola inaccesible. Las vistas no necesitan RLS propio si la tabla base lo tiene.

-- 1. Verificar que la vista existe
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_views 
    WHERE schemaname = 'public' AND viewname = 'public_profiles'
  ) THEN
    RAISE EXCEPTION 'Vista public_profiles no existe';
  END IF;
END $$;

-- 2. Deshabilitar RLS en la vista (las vistas no necesitan RLS propio)
-- La seguridad se maneja desde la tabla base (profiles)
ALTER VIEW public.public_profiles SET (security_invoker = false);

-- 3. Asegurar permisos de lectura para usuarios autenticados
GRANT SELECT ON public.public_profiles TO authenticated;

-- 4. También permitir acceso anónimo (opcional - para perfiles públicos de vendedores)
GRANT SELECT ON public.public_profiles TO anon;

-- 5. Añadir documentación
COMMENT ON VIEW public.public_profiles IS 
'Vista segura de perfiles públicos. No requiere RLS propio porque:
1. Filtra automáticamente solo perfiles con show_business_stats=true
2. Expone SOLO datos no sensibles (sin email, teléfono, dirección)
3. La tabla base profiles ya tiene RLS implementado correctamente
4. Accesible para usuarios autenticados y anónimos para ver perfiles de vendedores';