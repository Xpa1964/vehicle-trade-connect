
-- ============================================
-- CORRECCIÓN DE SEGURIDAD: Funciones SECURITY DEFINER
-- ============================================
-- Estrategia: Reemplazar funciones sin DROP para mantener dependencias

-- 1. has_role - MANTENER SECURITY DEFINER pero mejorar validaciones
-- Esta función DEBE mantener SECURITY DEFINER porque las políticas RLS dependen de ella
-- y necesita verificar user_roles sin importar el contexto del usuario
CREATE OR REPLACE FUNCTION public.has_role(p_role text)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER  -- Mantenemos DEFINER por dependencias RLS
SET search_path TO 'public'
AS $function$
BEGIN
  -- Validación: Debe haber un usuario autenticado
  IF auth.uid() IS NULL THEN
    RETURN false;
  END IF;
  
  -- Solo verifica el rol del usuario autenticado actual (no permite parámetros)
  RETURN EXISTS (
    SELECT 1 
    FROM public.user_roles
    WHERE user_id = auth.uid() 
      AND role::text = p_role
  );
END;
$function$;

-- 2. get_user_dashboard_stats - Agregar validación de seguridad
CREATE OR REPLACE FUNCTION public.get_user_dashboard_stats(user_uuid uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER  -- Necesario para contar en todas las tablas
STABLE
AS $function$
DECLARE
  result JSON;
  vehicles_count INT := 0;
  announcements_count INT := 0;
  conversations_count INT := 0;
  unread_messages_count INT := 0;
  is_admin BOOLEAN;
BEGIN
  -- VALIDACIÓN CRÍTICA: Solo puedes ver tus propias estadísticas o si eres admin
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'::app_role
  ) INTO is_admin;
  
  IF auth.uid() != user_uuid AND NOT is_admin THEN
    -- Retornar estadísticas vacías en lugar de error para evitar información leak
    RETURN json_build_object(
      'vehicles', json_build_object('count', 0),
      'announcements', json_build_object('count', 0),
      'conversations', json_build_object('count', 0),
      'messages', json_build_object('count', 0),
      'exchanges', json_build_object('count', 0)
    );
  END IF;

  -- Obtener conteos solo si está autorizado
  SELECT COUNT(*) INTO vehicles_count FROM vehicles WHERE user_id = user_uuid;
  SELECT COUNT(*) INTO announcements_count FROM announcements WHERE user_id = user_uuid;
  SELECT COUNT(DISTINCT c.id) INTO conversations_count 
    FROM conversations c WHERE c.seller_id = user_uuid OR c.buyer_id = user_uuid;
  SELECT COUNT(*) INTO unread_messages_count
    FROM messages m
    INNER JOIN conversations c ON m.conversation_id = c.id
    WHERE (c.seller_id = user_uuid OR c.buyer_id = user_uuid)
      AND m.sender_id != user_uuid
      AND m.read_at IS NULL;

  RETURN json_build_object(
    'vehicles', json_build_object('count', vehicles_count),
    'announcements', json_build_object('count', announcements_count),
    'conversations', json_build_object('count', conversations_count),
    'messages', json_build_object('count', unread_messages_count),
    'exchanges', json_build_object('count', 0)
  );
END;
$function$;

-- 3. can_view_profile - Ya tiene buena lógica de seguridad, solo agregar comentario
COMMENT ON FUNCTION public.can_view_profile(uuid) IS 
'Verifica si el usuario autenticado puede ver un perfil. SECURITY DEFINER necesario para verificar relaciones en todas las tablas sin exponer RLS.';

-- 4. log_activity - Validar que solo se pueda loggear para el usuario autenticado
CREATE OR REPLACE FUNCTION public.log_activity(
  p_user_id uuid, 
  p_action_type text, 
  p_entity_type text DEFAULT NULL, 
  p_entity_id text DEFAULT NULL, 
  p_details jsonb DEFAULT NULL, 
  p_severity text DEFAULT 'info'
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_log_id UUID;
  is_admin BOOLEAN;
BEGIN
  -- Validación: Solo puedes loggear para ti mismo, excepto si eres admin
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'::app_role
  ) INTO is_admin;
  
  IF auth.uid() != p_user_id AND NOT is_admin THEN
    RAISE EXCEPTION 'Unauthorized: Cannot create activity logs for other users';
  END IF;
  
  INSERT INTO public.activity_logs (
    user_id, action_type, entity_type, entity_id, details, severity
  ) VALUES (
    p_user_id, p_action_type, p_entity_type, p_entity_id, p_details, p_severity
  )
  RETURNING id INTO v_log_id;
  
  RETURN v_log_id;
END;
$function$;

-- ============================================
-- DOCUMENTACIÓN DE FUNCIONES QUE REQUIEREN SECURITY DEFINER
-- ============================================

COMMENT ON FUNCTION public.has_role(text) IS 
'[SECURITY DEFINER JUSTIFICADO] Verifica roles del usuario autenticado. Requerido por políticas RLS que no pueden usar auth.uid() directamente en ciertas condiciones.';

COMMENT ON FUNCTION public.get_user_dashboard_stats(uuid) IS 
'[SECURITY DEFINER JUSTIFICADO] Obtiene estadísticas del dashboard. Incluye validación estricta: solo admins pueden ver estadísticas de otros usuarios.';

COMMENT ON FUNCTION public.log_activity IS 
'[SECURITY DEFINER JUSTIFICADO] Crea logs de actividad. Validado: solo puedes crear logs para ti mismo excepto si eres admin.';

-- Funciones administrativas que CORRECTAMENTE usan SECURITY DEFINER:
COMMENT ON FUNCTION public.admin_update_user_role IS 
'[SECURITY DEFINER NECESARIO] Operación administrativa que requiere privilegios elevados. Validado: solo admins pueden ejecutar.';

COMMENT ON FUNCTION public.admin_update_user_profile IS 
'[SECURITY DEFINER NECESARIO] Operación administrativa que requiere privilegios elevados. Validado: solo admins pueden ejecutar.';

COMMENT ON FUNCTION public.cleanup_old_metrics IS 
'[SECURITY DEFINER NECESARIO] Tarea de limpieza automática ejecutada por cron sin contexto de usuario.';

COMMENT ON FUNCTION public.cleanup_old_rate_limits IS 
'[SECURITY DEFINER NECESARIO] Tarea de limpieza automática ejecutada por cron sin contexto de usuario.';

COMMENT ON FUNCTION public.close_expired_auctions IS 
'[SECURITY DEFINER NECESARIO] Tarea de cierre automático de subastas ejecutada por cron sin contexto de usuario.';
