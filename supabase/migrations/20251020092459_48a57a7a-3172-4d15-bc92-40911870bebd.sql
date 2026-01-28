-- Tabla para almacenar las API keys de los partners/dealers
CREATE TABLE public.partner_api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  api_key TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true NOT NULL,
  last_used_at TIMESTAMP WITH TIME ZONE,
  request_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE,
  rate_limit_per_hour INTEGER DEFAULT 100
);

-- Enable RLS
ALTER TABLE public.partner_api_keys ENABLE ROW LEVEL SECURITY;

-- Política: Los usuarios pueden ver sus propias API keys
CREATE POLICY "Users can view their own API keys"
ON public.partner_api_keys
FOR SELECT
USING (auth.uid() = user_id);

-- Política: Los usuarios pueden crear sus propias API keys
CREATE POLICY "Users can create their own API keys"
ON public.partner_api_keys
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Política: Los usuarios pueden actualizar sus propias API keys
CREATE POLICY "Users can update their own API keys"
ON public.partner_api_keys
FOR UPDATE
USING (auth.uid() = user_id);

-- Política: Los usuarios pueden eliminar sus propias API keys
CREATE POLICY "Users can delete their own API keys"
ON public.partner_api_keys
FOR DELETE
USING (auth.uid() = user_id);

-- Política: Los admins pueden ver todas las API keys
CREATE POLICY "Admins can view all API keys"
ON public.partner_api_keys
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Función para validar una API key y obtener el user_id asociado
CREATE OR REPLACE FUNCTION public.validate_partner_api_key(p_api_key TEXT)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
  v_is_active BOOLEAN;
  v_expires_at TIMESTAMP WITH TIME ZONE;
BEGIN
  SELECT user_id, is_active, expires_at
  INTO v_user_id, v_is_active, v_expires_at
  FROM public.partner_api_keys
  WHERE api_key = p_api_key;
  
  -- Si no existe la API key
  IF v_user_id IS NULL THEN
    RETURN NULL;
  END IF;
  
  -- Si está inactiva
  IF NOT v_is_active THEN
    RETURN NULL;
  END IF;
  
  -- Si está expirada
  IF v_expires_at IS NOT NULL AND v_expires_at < NOW() THEN
    RETURN NULL;
  END IF;
  
  -- Actualizar last_used_at y request_count
  UPDATE public.partner_api_keys
  SET 
    last_used_at = NOW(),
    request_count = request_count + 1
  WHERE api_key = p_api_key;
  
  RETURN v_user_id;
END;
$$;

-- Función para generar API keys seguras
CREATE OR REPLACE FUNCTION public.generate_api_key()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  v_api_key TEXT;
BEGIN
  -- Generar una API key única con formato: kvo_<random_string>
  v_api_key := 'kvo_' || encode(gen_random_bytes(32), 'base64');
  v_api_key := replace(v_api_key, '/', '_');
  v_api_key := replace(v_api_key, '+', '-');
  v_api_key := replace(v_api_key, '=', '');
  
  RETURN v_api_key;
END;
$$;

-- Tabla para logs de sincronización de API
CREATE TABLE public.api_sync_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  api_key_id UUID REFERENCES public.partner_api_keys(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  vehicle_count INTEGER DEFAULT 0,
  success_count INTEGER DEFAULT 0,
  error_count INTEGER DEFAULT 0,
  errors JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS on logs
ALTER TABLE public.api_sync_logs ENABLE ROW LEVEL SECURITY;

-- Política: Los usuarios pueden ver sus propios logs
CREATE POLICY "Users can view their own sync logs"
ON public.api_sync_logs
FOR SELECT
USING (auth.uid() = user_id);

-- Política: Los admins pueden ver todos los logs
CREATE POLICY "Admins can view all sync logs"
ON public.api_sync_logs
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Índices para mejorar performance
CREATE INDEX idx_partner_api_keys_user_id ON public.partner_api_keys(user_id);
CREATE INDEX idx_partner_api_keys_api_key ON public.partner_api_keys(api_key);
CREATE INDEX idx_api_sync_logs_user_id ON public.api_sync_logs(user_id);
CREATE INDEX idx_api_sync_logs_created_at ON public.api_sync_logs(created_at DESC);