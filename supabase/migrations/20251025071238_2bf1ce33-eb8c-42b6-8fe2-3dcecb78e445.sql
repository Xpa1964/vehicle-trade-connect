-- Crear tabla para solicitudes de API keys (flujo de aprobación)
CREATE TABLE IF NOT EXISTS public.api_key_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  reason TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  rejection_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.api_key_requests ENABLE ROW LEVEL SECURITY;

-- Políticas para api_key_requests
CREATE POLICY "Users can view their own requests"
ON public.api_key_requests FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create requests"
ON public.api_key_requests FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all requests"
ON public.api_key_requests FOR SELECT
USING (has_role('admin') OR has_role('moderator'));

CREATE POLICY "Admins can update requests"
ON public.api_key_requests FOR UPDATE
USING (has_role('admin') OR has_role('moderator'));

-- Agregar campo approved_at a partner_api_keys
ALTER TABLE public.partner_api_keys 
ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS request_id UUID REFERENCES public.api_key_requests(id);

-- Función para aprobar solicitud y crear API key
CREATE OR REPLACE FUNCTION public.approve_api_key_request(
  p_request_id UUID,
  p_key_name TEXT
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_request api_key_requests;
  v_user_id UUID;
  v_key_count INTEGER;
  v_api_key TEXT;
  v_new_key_id UUID;
  v_admin_id UUID;
BEGIN
  v_admin_id := auth.uid();
  
  -- Verificar que el usuario sea admin
  IF NOT (has_role('admin') OR has_role('moderator')) THEN
    RETURN jsonb_build_object('success', false, 'message', 'Unauthorized');
  END IF;
  
  -- Obtener la solicitud
  SELECT * INTO v_request FROM api_key_requests WHERE id = p_request_id;
  
  IF v_request IS NULL THEN
    RETURN jsonb_build_object('success', false, 'message', 'Request not found');
  END IF;
  
  IF v_request.status != 'pending' THEN
    RETURN jsonb_build_object('success', false, 'message', 'Request already processed');
  END IF;
  
  v_user_id := v_request.user_id;
  
  -- Verificar límite de keys (máximo 5)
  SELECT COUNT(*) INTO v_key_count
  FROM partner_api_keys
  WHERE user_id = v_user_id AND is_active = true;
  
  IF v_key_count >= 5 THEN
    RETURN jsonb_build_object('success', false, 'message', 'User has reached maximum API key limit (5)');
  END IF;
  
  -- Generar API key
  SELECT generate_api_key() INTO v_api_key;
  
  -- Crear la API key con expiración de 1 año
  INSERT INTO partner_api_keys (
    user_id,
    api_key,
    name,
    is_active,
    expires_at,
    rate_limit_per_hour,
    approved_by,
    approved_at,
    request_id
  ) VALUES (
    v_user_id,
    v_api_key,
    p_key_name,
    true,
    NOW() + INTERVAL '1 year',
    250, -- Rate limit por defecto
    v_admin_id,
    NOW(),
    p_request_id
  ) RETURNING id INTO v_new_key_id;
  
  -- Actualizar solicitud
  UPDATE api_key_requests
  SET 
    status = 'approved',
    reviewed_by = v_admin_id,
    reviewed_at = NOW()
  WHERE id = p_request_id;
  
  -- Crear notificación para el usuario
  PERFORM create_system_notification(
    v_user_id,
    'API Key Approved',
    'Your API key request has been approved. You can now access it from your dashboard.',
    'success'
  );
  
  RETURN jsonb_build_object(
    'success', true,
    'message', 'API key approved and created',
    'api_key_id', v_new_key_id,
    'api_key', v_api_key
  );
END;
$$;

-- Función para rechazar solicitud
CREATE OR REPLACE FUNCTION public.reject_api_key_request(
  p_request_id UUID,
  p_rejection_reason TEXT
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_request api_key_requests;
  v_admin_id UUID;
BEGIN
  v_admin_id := auth.uid();
  
  IF NOT (has_role('admin') OR has_role('moderator')) THEN
    RETURN jsonb_build_object('success', false, 'message', 'Unauthorized');
  END IF;
  
  SELECT * INTO v_request FROM api_key_requests WHERE id = p_request_id;
  
  IF v_request IS NULL THEN
    RETURN jsonb_build_object('success', false, 'message', 'Request not found');
  END IF;
  
  IF v_request.status != 'pending' THEN
    RETURN jsonb_build_object('success', false, 'message', 'Request already processed');
  END IF;
  
  UPDATE api_key_requests
  SET 
    status = 'rejected',
    reviewed_by = v_admin_id,
    reviewed_at = NOW(),
    rejection_reason = p_rejection_reason
  WHERE id = p_request_id;
  
  PERFORM create_system_notification(
    v_request.user_id,
    'API Key Request Rejected',
    'Your API key request has been rejected. Reason: ' || p_rejection_reason,
    'warn'
  );
  
  RETURN jsonb_build_object('success', true, 'message', 'Request rejected');
END;
$$;

-- Función mejorada para validar API key con rate limiting
CREATE OR REPLACE FUNCTION public.validate_partner_api_key_with_rate_limit(p_api_key TEXT)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
  v_is_active BOOLEAN;
  v_expires_at TIMESTAMP WITH TIME ZONE;
  v_rate_limit INTEGER;
  v_request_count_last_hour INTEGER;
  v_key_id UUID;
BEGIN
  SELECT id, user_id, is_active, expires_at, rate_limit_per_hour
  INTO v_key_id, v_user_id, v_is_active, v_expires_at, v_rate_limit
  FROM public.partner_api_keys
  WHERE api_key = p_api_key;
  
  IF v_user_id IS NULL THEN
    RETURN jsonb_build_object('valid', false, 'error', 'invalid_key');
  END IF;
  
  IF NOT v_is_active THEN
    RETURN jsonb_build_object('valid', false, 'error', 'inactive_key');
  END IF;
  
  IF v_expires_at IS NOT NULL AND v_expires_at < NOW() THEN
    RETURN jsonb_build_object('valid', false, 'error', 'expired_key');
  END IF;
  
  -- Verificar rate limit (requests en la última hora)
  SELECT COUNT(*) INTO v_request_count_last_hour
  FROM api_sync_logs
  WHERE api_key_id = v_key_id
    AND created_at > NOW() - INTERVAL '1 hour';
  
  IF v_request_count_last_hour >= v_rate_limit THEN
    RETURN jsonb_build_object(
      'valid', false,
      'error', 'rate_limit_exceeded',
      'limit', v_rate_limit,
      'retry_after', 3600
    );
  END IF;
  
  UPDATE public.partner_api_keys
  SET 
    last_used_at = NOW(),
    request_count = request_count + 1
  WHERE api_key = p_api_key;
  
  RETURN jsonb_build_object(
    'valid', true,
    'user_id', v_user_id,
    'key_id', v_key_id,
    'rate_limit', v_rate_limit,
    'requests_remaining', v_rate_limit - v_request_count_last_hour - 1
  );
END;
$$;

-- Agregar api_key_id a logs si no existe
ALTER TABLE public.api_sync_logs 
ADD COLUMN IF NOT EXISTS request_id UUID;

-- Índices para mejorar performance
CREATE INDEX IF NOT EXISTS idx_api_key_requests_user_id ON public.api_key_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_api_key_requests_status ON public.api_key_requests(status);
CREATE INDEX IF NOT EXISTS idx_api_sync_logs_key_time ON public.api_sync_logs(api_key_id, created_at DESC);