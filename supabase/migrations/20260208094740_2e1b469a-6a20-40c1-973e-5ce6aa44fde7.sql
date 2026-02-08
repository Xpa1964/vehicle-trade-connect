-- ============================================
-- CAPA 2: GESTIÓN DE PUJAS - KONTACT VO
-- Documento Oficial - Fuente Única de Verdad
-- ============================================

-- 1. Crear tabla de configuración anti-sniping
CREATE TABLE IF NOT EXISTS public.auction_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  config_key TEXT NOT NULL UNIQUE,
  config_value INTEGER NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.auction_config ENABLE ROW LEVEL SECURITY;

-- Solo admins pueden modificar configuración
CREATE POLICY "Admins can manage auction config"
ON public.auction_config
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'::app_role
  )
);

-- Todos pueden leer configuración
CREATE POLICY "Anyone can read auction config"
ON public.auction_config
FOR SELECT
USING (true);

-- Insertar valores por defecto para anti-sniping
INSERT INTO public.auction_config (config_key, config_value, description)
VALUES 
  ('anti_sniping_threshold_minutes', 5, 'Minutos antes del cierre para activar anti-sniping'),
  ('anti_sniping_extension_minutes', 3, 'Minutos que se extiende la subasta en anti-sniping')
ON CONFLICT (config_key) DO NOTHING;

-- 2. Añadir columna para rastrear extensiones en bids
ALTER TABLE public.bids
ADD COLUMN IF NOT EXISTS triggered_extension BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS previous_end_date TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS new_end_date TIMESTAMPTZ;

-- 3. Eliminar función anterior
DROP FUNCTION IF EXISTS public.place_bid(uuid, uuid, numeric);

-- 4. Crear función robusta de pujas con todas las validaciones
CREATE OR REPLACE FUNCTION public.place_bid(
  p_auction_id UUID,
  p_bidder_id UUID,
  p_amount NUMERIC
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_auction RECORD;
  v_config_threshold INTEGER;
  v_config_extension INTEGER;
  v_bid_id UUID;
  v_time_remaining INTERVAL;
  v_triggered_extension BOOLEAN := false;
  v_previous_end_date TIMESTAMPTZ;
  v_new_end_date TIMESTAMPTZ;
  v_previous_price NUMERIC;
BEGIN
  -- ============================================
  -- BLOQUEO OPTIMISTA: Seleccionar subasta con lock
  -- ============================================
  SELECT 
    id, seller_id, status, current_price, increment_minimum, 
    end_date, reserve_price
  INTO v_auction
  FROM public.auctions
  WHERE id = p_auction_id
  FOR UPDATE; -- Bloqueo de fila para evitar race conditions

  -- ============================================
  -- VALIDACIÓN 1: Subasta existe
  -- ============================================
  IF v_auction IS NULL THEN
    RETURN jsonb_build_object(
      'success', false,
      'error_code', 'AUCTION_NOT_FOUND',
      'error_message', 'La subasta no existe'
    );
  END IF;

  -- ============================================
  -- VALIDACIÓN 2: Estado ACTIVE
  -- ============================================
  IF v_auction.status != 'active' THEN
    RETURN jsonb_build_object(
      'success', false,
      'error_code', 'AUCTION_NOT_ACTIVE',
      'error_message', 'La subasta no está activa',
      'current_status', v_auction.status
    );
  END IF;

  -- ============================================
  -- VALIDACIÓN 3: No ha expirado
  -- ============================================
  IF now() >= v_auction.end_date THEN
    RETURN jsonb_build_object(
      'success', false,
      'error_code', 'AUCTION_EXPIRED',
      'error_message', 'La subasta ha finalizado'
    );
  END IF;

  -- ============================================
  -- VALIDACIÓN 4: Usuario no es el vendedor
  -- ============================================
  IF p_bidder_id = v_auction.seller_id THEN
    RETURN jsonb_build_object(
      'success', false,
      'error_code', 'SELLER_CANNOT_BID',
      'error_message', 'El vendedor no puede pujar en su propia subasta'
    );
  END IF;

  -- ============================================
  -- VALIDACIÓN 5: Monto positivo
  -- ============================================
  IF p_amount <= 0 THEN
    RETURN jsonb_build_object(
      'success', false,
      'error_code', 'INVALID_AMOUNT',
      'error_message', 'El monto debe ser mayor a 0'
    );
  END IF;

  -- ============================================
  -- VALIDACIÓN 6: Cumple incremento mínimo
  -- ============================================
  IF p_amount < (v_auction.current_price + v_auction.increment_minimum) THEN
    RETURN jsonb_build_object(
      'success', false,
      'error_code', 'BELOW_MINIMUM_INCREMENT',
      'error_message', 'La puja no cumple el incremento mínimo',
      'current_price', v_auction.current_price,
      'increment_minimum', v_auction.increment_minimum,
      'minimum_bid', v_auction.current_price + v_auction.increment_minimum
    );
  END IF;

  -- ============================================
  -- OBTENER CONFIGURACIÓN ANTI-SNIPING
  -- ============================================
  SELECT config_value INTO v_config_threshold
  FROM public.auction_config
  WHERE config_key = 'anti_sniping_threshold_minutes';
  
  SELECT config_value INTO v_config_extension
  FROM public.auction_config
  WHERE config_key = 'anti_sniping_extension_minutes';

  -- Valores por defecto si no hay configuración
  v_config_threshold := COALESCE(v_config_threshold, 5);
  v_config_extension := COALESCE(v_config_extension, 3);

  -- ============================================
  -- ANTI-SNIPING: Calcular extensión
  -- ============================================
  v_time_remaining := v_auction.end_date - now();
  v_previous_end_date := v_auction.end_date;
  v_previous_price := v_auction.current_price;

  IF v_time_remaining <= (v_config_threshold * interval '1 minute') THEN
    v_triggered_extension := true;
    v_new_end_date := v_auction.end_date + (v_config_extension * interval '1 minute');
  ELSE
    v_new_end_date := v_auction.end_date;
  END IF;

  -- ============================================
  -- TRANSACCIÓN ATÓMICA: Insertar puja
  -- ============================================
  INSERT INTO public.bids (
    auction_id, 
    bidder_id, 
    amount, 
    is_winning,
    triggered_extension,
    previous_end_date,
    new_end_date
  )
  VALUES (
    p_auction_id,
    p_bidder_id,
    p_amount,
    true, -- Esta es ahora la puja ganadora
    v_triggered_extension,
    v_previous_end_date,
    v_new_end_date
  )
  RETURNING id INTO v_bid_id;

  -- Desmarcar pujas anteriores como ganadoras
  UPDATE public.bids
  SET is_winning = false
  WHERE auction_id = p_auction_id
    AND id != v_bid_id
    AND is_winning = true;

  -- ============================================
  -- TRANSACCIÓN ATÓMICA: Actualizar subasta
  -- ============================================
  UPDATE public.auctions
  SET 
    current_price = p_amount,
    end_date = v_new_end_date,
    updated_at = now()
  WHERE id = p_auction_id;

  -- ============================================
  -- REGISTRAR EVENTO INMUTABLE
  -- ============================================
  INSERT INTO public.auction_state_transitions (
    auction_id,
    from_status,
    to_status,
    triggered_by,
    trigger_type,
    metadata
  )
  VALUES (
    p_auction_id,
    'active'::auction_status,
    'active'::auction_status,
    p_bidder_id,
    'manual',
    jsonb_build_object(
      'event_type', 'bid_placed',
      'bid_id', v_bid_id,
      'bidder_id', p_bidder_id,
      'amount', p_amount,
      'previous_price', v_previous_price,
      'new_price', p_amount,
      'extended', v_triggered_extension,
      'previous_end_date', v_previous_end_date,
      'new_end_date', v_new_end_date,
      'time_remaining_seconds', EXTRACT(EPOCH FROM v_time_remaining),
      'anti_sniping_threshold', v_config_threshold,
      'anti_sniping_extension', v_config_extension
    )
  );

  -- ============================================
  -- RESPUESTA EXITOSA
  -- ============================================
  RETURN jsonb_build_object(
    'success', true,
    'bid_id', v_bid_id,
    'amount', p_amount,
    'previous_price', v_previous_price,
    'extended', v_triggered_extension,
    'new_end_date', v_new_end_date,
    'message', CASE 
      WHEN v_triggered_extension THEN 'Puja aceptada. Subasta extendida por anti-sniping.'
      ELSE 'Puja aceptada exitosamente.'
    END
  );

EXCEPTION
  WHEN OTHERS THEN
    RETURN jsonb_build_object(
      'success', false,
      'error_code', 'INTERNAL_ERROR',
      'error_message', SQLERRM
    );
END;
$$;

-- 5. Comentarios de documentación
COMMENT ON FUNCTION public.place_bid IS 'Función de puja con validación completa, concurrencia y anti-sniping - Documento Capa 2';
COMMENT ON TABLE public.auction_config IS 'Configuración del sistema de subastas - Parámetros anti-sniping';
COMMENT ON COLUMN public.bids.triggered_extension IS 'Indica si esta puja activó extensión anti-sniping';
COMMENT ON COLUMN public.bids.previous_end_date IS 'Fecha de fin antes de la extensión';
COMMENT ON COLUMN public.bids.new_end_date IS 'Fecha de fin después de la extensión (si aplica)';