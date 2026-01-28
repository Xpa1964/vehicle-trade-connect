-- Crear función para insertar notificaciones del sistema (bypassing RLS)
CREATE OR REPLACE FUNCTION public.create_system_notification(
  p_user_id UUID,
  p_subject TEXT,
  p_content TEXT,
  p_type TEXT DEFAULT 'info'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_notification_id UUID;
BEGIN
  -- Insertar notificación directamente (bypassing RLS)
  INSERT INTO public.user_notifications (
    user_id,
    subject,
    content,
    type,
    is_read,
    created_at
  ) VALUES (
    p_user_id,
    p_subject,
    p_content,
    p_type,
    false,
    NOW()
  )
  RETURNING id INTO v_notification_id;
  
  RETURN v_notification_id;
END;
$$;

-- Crear notificación de prueba para un usuario admin
DO $$
DECLARE
  v_admin_user_id UUID;
  v_notification_id UUID;
BEGIN
  -- Buscar un usuario admin
  SELECT ur.user_id INTO v_admin_user_id
  FROM public.user_roles ur
  WHERE ur.role = 'admin'::app_role
  LIMIT 1;
  
  -- Si existe admin, crear notificación de prueba
  IF v_admin_user_id IS NOT NULL THEN
    SELECT public.create_system_notification(
      v_admin_user_id,
      'Sistema de Notificaciones Activado',
      'El sistema de notificaciones ha sido configurado correctamente y está funcionando.',
      'success'
    ) INTO v_notification_id;
    
    RAISE NOTICE 'Notificación de prueba creada con ID: %', v_notification_id;
  ELSE
    RAISE NOTICE 'No se encontró usuario admin para crear notificación de prueba';
  END IF;
END;
$$;