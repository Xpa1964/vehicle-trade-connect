
-- ============================================
-- CORRECCIÓN DE SEGURIDAD: Security Definer Functions
-- Estrategia: Reemplazar funciones sin romper dependencias
-- ============================================

-- 1. ACTUALIZAR has_role - Reemplazar SIN eliminar
-- Mantener SECURITY DEFINER pero mejorar validaciones
CREATE OR REPLACE FUNCTION public.has_role(p_role text)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER  -- Mantener DEFINER por compatibilidad con RLS policies
SET search_path TO 'public'
AS $$
BEGIN
  -- Validación adicional: verificar que el usuario está autenticado
  IF auth.uid() IS NULL THEN
    RETURN false;
  END IF;
  
  -- Solo verifica el rol del usuario autenticado actual
  RETURN EXISTS (
    SELECT 1 
    FROM public.user_roles
    WHERE user_id = auth.uid() 
      AND role::text = p_role
      AND user_id IS NOT NULL
  );
END;
$$;

-- 2. ACTUALIZAR get_user_dashboard_stats
-- Cambiar a SECURITY INVOKER y agregar validación estricta
CREATE OR REPLACE FUNCTION public.get_user_dashboard_stats(user_uuid uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY INVOKER  -- Cambiado de DEFINER a INVOKER
STABLE
AS $$
DECLARE
  result JSON;
  vehicles_count INT;
  announcements_count INT;
  conversations_count INT;
  unread_messages_count INT;
  is_admin BOOLEAN;
BEGIN
  -- Verificar si el usuario es admin
  SELECT has_role('admin') INTO is_admin;
  
  -- VALIDACIÓN: Solo puedes ver tus propias estadísticas o si eres admin
  IF auth.uid() != user_uuid AND NOT is_admin THEN
    RAISE EXCEPTION 'Unauthorized: Cannot view other users statistics';
  END IF;

  -- Obtener conteos usando el contexto de seguridad del usuario
  SELECT COUNT(*) INTO vehicles_count
  FROM vehicles WHERE user_id = user_uuid;

  SELECT COUNT(*) INTO announcements_count
  FROM announcements WHERE user_id = user_uuid;

  SELECT COUNT(DISTINCT c.id) INTO conversations_count
  FROM conversations c
  WHERE c.seller_id = user_uuid OR c.buyer_id = user_uuid;

  SELECT COUNT(*) INTO unread_messages_count
  FROM messages m
  INNER JOIN conversations c ON m.conversation_id = c.id
  WHERE (c.seller_id = user_uuid OR c.buyer_id = user_uuid)
    AND m.sender_id != user_uuid
    AND m.read_at IS NULL;

  SELECT json_build_object(
    'vehicles', json_build_object('count', vehicles_count),
    'announcements', json_build_object('count', announcements_count),
    'conversations', json_build_object('count', conversations_count),
    'messages', json_build_object('count', unread_messages_count),
    'exchanges', json_build_object('count', 0)
  ) INTO result;

  RETURN result;
END;
$$;

-- 3. ACTUALIZAR get_user_rating_summary
-- Cambiar a SECURITY INVOKER (datos públicos, no necesita privilegios elevados)
CREATE OR REPLACE FUNCTION public.get_user_rating_summary(p_user_id uuid)
RETURNS TABLE(average_rating numeric, total_ratings bigint, verified_ratings bigint)
LANGUAGE sql
STABLE
SECURITY INVOKER  -- Cambiado de DEFINER a INVOKER
SET search_path TO 'public'
AS $$
  SELECT 
    COALESCE(ROUND(AVG(rating::numeric), 1), 0) as average_rating,
    COUNT(*) as total_ratings,
    COUNT(*) FILTER (WHERE verified = true) as verified_ratings
  FROM public.ratings
  WHERE to_user_id = p_user_id;
$$;

-- 4. ACTUALIZAR can_view_profile
-- Mantener SECURITY DEFINER pero mejorar validaciones
CREATE OR REPLACE FUNCTION public.can_view_profile(profile_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  current_user_id uuid;
BEGIN
  current_user_id := auth.uid();
  
  -- Validación: usuario debe estar autenticado
  IF current_user_id IS NULL THEN
    RETURN false;
  END IF;
  
  -- Usuario puede ver su propio perfil
  IF current_user_id = profile_user_id THEN
    RETURN true;
  END IF;
  
  -- Admins pueden ver todos los perfiles
  IF EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = current_user_id AND role = 'admin'::app_role
  ) THEN
    RETURN true;
  END IF;
  
  -- Usuarios pueden ver perfiles con los que han interactuado
  IF EXISTS (
    SELECT 1 FROM public.vehicles v
    WHERE v.user_id = profile_user_id AND v.status IN ('available', 'reserved', 'sold')
    UNION
    SELECT 1 FROM public.conversations c
    WHERE (c.seller_id = profile_user_id AND c.buyer_id = current_user_id)
       OR (c.buyer_id = profile_user_id AND c.seller_id = current_user_id)
    UNION
    SELECT 1 FROM public.auctions a
    JOIN public.bids b ON a.id = b.auction_id
    WHERE (a.created_by = profile_user_id AND b.bidder_id = current_user_id)
       OR (a.created_by = current_user_id AND b.bidder_id = profile_user_id)
    UNION
    SELECT 1 FROM public.transactions t
    WHERE (t.seller_id = profile_user_id AND t.buyer_id = current_user_id)
       OR (t.buyer_id = profile_user_id AND t.seller_id = current_user_id)
  ) THEN
    RETURN true;
  END IF;
  
  RETURN false;
END;
$$;

-- 5. Agregar comentarios de documentación
COMMENT ON FUNCTION public.has_role(text) IS 
'Verifica si el usuario autenticado actual tiene un rol específico. 
SECURITY DEFINER es necesario para que funcione con RLS policies.
MEJORA: Validación de auth.uid() antes de consulta.';

COMMENT ON FUNCTION public.get_user_dashboard_stats(uuid) IS 
'Obtiene estadísticas del dashboard. SECURITY INVOKER con validación estricta.
Solo permite ver estadísticas propias o si eres admin.';

COMMENT ON FUNCTION public.get_user_rating_summary(uuid) IS 
'Obtiene resumen de calificaciones públicas. SECURITY INVOKER es seguro.';

COMMENT ON FUNCTION public.can_view_profile(uuid) IS 
'Verifica si un usuario puede ver el perfil de otro. SECURITY DEFINER necesario
para consultar múltiples tablas sin restricciones RLS. Validaciones mejoradas.';

-- ============================================
-- REPORTE DE SEGURIDAD
-- ============================================
-- Funciones que DEBEN mantener SECURITY DEFINER (con validaciones internas):
-- ✓ has_role() - Necesario para RLS policies
-- ✓ admin_update_user_role() - Operación administrativa
-- ✓ admin_update_user_profile() - Operación administrativa
-- ✓ cleanup_old_metrics() - Cron job sin usuario
-- ✓ close_expired_auctions() - Cron job sin usuario
-- ✓ create_system_notification() - Sistema crea notificaciones
-- 
-- Funciones cambiadas a SECURITY INVOKER (más seguro):
-- ✓ get_user_dashboard_stats() - Ahora con validación de permisos
-- ✓ get_user_rating_summary() - Solo lee datos públicos
