-- ============================================
-- CAPA 3: FUNCIONES DE ACEPTACIÓN/RECHAZO
-- Documento Oficial - Sistema de Subastas Kontact VO
-- ============================================

-- ============================================
-- FUNCIÓN: accept_auction_result
-- Acción del vendedor para aceptar el resultado
-- ============================================
CREATE OR REPLACE FUNCTION public.accept_auction_result(
  p_auction_id UUID,
  p_seller_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_auction RECORD;
  v_winning_bid RECORD;
BEGIN
  -- ============================================
  -- BLOQUEO: Seleccionar subasta con lock
  -- ============================================
  SELECT 
    id, seller_id, status, winner_id, current_price, vehicle_id
  INTO v_auction
  FROM public.auctions
  WHERE id = p_auction_id
  FOR UPDATE;

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
  -- VALIDACIÓN 2: Usuario es el vendedor
  -- ============================================
  IF v_auction.seller_id != p_seller_id THEN
    RETURN jsonb_build_object(
      'success', false,
      'error_code', 'NOT_SELLER',
      'error_message', 'Solo el vendedor puede aceptar el resultado'
    );
  END IF;

  -- ============================================
  -- VALIDACIÓN 3: Estado correcto
  -- ============================================
  IF v_auction.status != 'ended_pending_acceptance' THEN
    RETURN jsonb_build_object(
      'success', false,
      'error_code', 'INVALID_STATUS',
      'error_message', 'La subasta no está en estado de decisión pendiente',
      'current_status', v_auction.status
    );
  END IF;

  -- ============================================
  -- OBTENER PUJA GANADORA (si existe)
  -- ============================================
  SELECT id, bidder_id, amount
  INTO v_winning_bid
  FROM public.bids
  WHERE auction_id = p_auction_id
    AND is_winning = true
  LIMIT 1;

  -- ============================================
  -- TRANSICIÓN: ENDED_PENDING_ACCEPTANCE → ACCEPTED
  -- ============================================
  UPDATE public.auctions
  SET 
    status = 'accepted',
    seller_decision_at = now(),
    updated_at = now()
  WHERE id = p_auction_id;

  -- ============================================
  -- REGISTRO INMUTABLE: result_accepted
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
    'ended_pending_acceptance'::auction_status,
    'accepted'::auction_status,
    p_seller_id,
    'manual',
    jsonb_build_object(
      'event_type', 'result_accepted',
      'seller_id', p_seller_id,
      'bid_id', v_winning_bid.id,
      'winner_id', v_winning_bid.bidder_id,
      'final_amount', v_winning_bid.amount,
      'decision_timestamp', now()
    )
  );

  -- ============================================
  -- RESPUESTA EXITOSA
  -- ============================================
  RETURN jsonb_build_object(
    'success', true,
    'auction_id', p_auction_id,
    'new_status', 'accepted',
    'winner_id', v_winning_bid.bidder_id,
    'final_amount', v_winning_bid.amount,
    'message', 'Resultado aceptado. El sistema procederá a compartir los datos de contacto.'
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

-- ============================================
-- FUNCIÓN: reject_auction_result
-- Acción del vendedor para rechazar el resultado
-- ============================================
CREATE OR REPLACE FUNCTION public.reject_auction_result(
  p_auction_id UUID,
  p_seller_id UUID,
  p_reason TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_auction RECORD;
  v_winning_bid RECORD;
BEGIN
  -- ============================================
  -- BLOQUEO: Seleccionar subasta con lock
  -- ============================================
  SELECT 
    id, seller_id, status, winner_id, vehicle_id
  INTO v_auction
  FROM public.auctions
  WHERE id = p_auction_id
  FOR UPDATE;

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
  -- VALIDACIÓN 2: Usuario es el vendedor
  -- ============================================
  IF v_auction.seller_id != p_seller_id THEN
    RETURN jsonb_build_object(
      'success', false,
      'error_code', 'NOT_SELLER',
      'error_message', 'Solo el vendedor puede rechazar el resultado'
    );
  END IF;

  -- ============================================
  -- VALIDACIÓN 3: Estado correcto
  -- ============================================
  IF v_auction.status != 'ended_pending_acceptance' THEN
    RETURN jsonb_build_object(
      'success', false,
      'error_code', 'INVALID_STATUS',
      'error_message', 'La subasta no está en estado de decisión pendiente',
      'current_status', v_auction.status
    );
  END IF;

  -- ============================================
  -- OBTENER PUJA GANADORA (si existía)
  -- ============================================
  SELECT id, bidder_id, amount
  INTO v_winning_bid
  FROM public.bids
  WHERE auction_id = p_auction_id
    AND is_winning = true
  LIMIT 1;

  -- ============================================
  -- TRANSICIÓN: ENDED_PENDING_ACCEPTANCE → REJECTED
  -- ============================================
  UPDATE public.auctions
  SET 
    status = 'rejected',
    seller_decision_at = now(),
    seller_decision_reason = p_reason,
    updated_at = now()
  WHERE id = p_auction_id;

  -- ============================================
  -- REGISTRO INMUTABLE: result_rejected
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
    'ended_pending_acceptance'::auction_status,
    'rejected'::auction_status,
    p_seller_id,
    'manual',
    jsonb_build_object(
      'event_type', 'result_rejected',
      'seller_id', p_seller_id,
      'bid_id', v_winning_bid.id,
      'previous_winner_id', v_winning_bid.bidder_id,
      'reason', p_reason,
      'decision_timestamp', now()
    )
  );

  -- ============================================
  -- RESPUESTA EXITOSA
  -- ============================================
  RETURN jsonb_build_object(
    'success', true,
    'auction_id', p_auction_id,
    'new_status', 'rejected',
    'reason', p_reason,
    'message', 'Resultado rechazado. El vehículo estará disponible nuevamente.'
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

-- ============================================
-- GRANT EXECUTE a usuarios autenticados
-- ============================================
GRANT EXECUTE ON FUNCTION public.accept_auction_result(UUID, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.reject_auction_result(UUID, UUID, TEXT) TO authenticated;