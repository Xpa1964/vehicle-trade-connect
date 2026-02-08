-- ============================================
-- CAPA 1: ESTADOS Y TRANSICIONES - KONTACT VO
-- Documento Oficial - Fuente Única de Verdad
-- VERSIÓN CORREGIDA: Elimina políticas dependientes primero
-- ============================================

-- 0. Eliminar políticas que dependen de la columna status
DROP POLICY IF EXISTS "Anyone can view active auctions" ON public.auctions;
DROP POLICY IF EXISTS "Users can view bids on auctions they participate in" ON public.bids;

-- 1. Crear ENUM con los 8 estados oficiales (si no existe del intento anterior)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'auction_status') THEN
    CREATE TYPE public.auction_status AS ENUM (
      'draft',
      'scheduled', 
      'active',
      'ended_pending_acceptance',
      'accepted',
      'rejected',
      'contact_shared',
      'closed'
    );
  END IF;
END $$;

-- 2. Añadir columna temporal para migrar datos (si no existe)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'auctions' AND column_name = 'status_new') THEN
    ALTER TABLE public.auctions ADD COLUMN status_new public.auction_status;
  END IF;
END $$;

-- 3. Migrar datos existentes (mapeo de estados antiguos a nuevos)
UPDATE public.auctions 
SET status_new = CASE 
  WHEN status = 'draft' THEN 'draft'::auction_status
  WHEN status = 'scheduled' THEN 'scheduled'::auction_status
  WHEN status = 'active' THEN 'active'::auction_status
  WHEN status = 'ended' THEN 'ended_pending_acceptance'::auction_status
  WHEN status = 'completed' THEN 'closed'::auction_status
  WHEN status = 'cancelled' THEN 'closed'::auction_status
  ELSE 'draft'::auction_status
END
WHERE status_new IS NULL;

-- 4. Eliminar columna antigua y renombrar nueva
ALTER TABLE public.auctions DROP COLUMN status;
ALTER TABLE public.auctions RENAME COLUMN status_new TO status;

-- 5. Establecer valor por defecto y NOT NULL
ALTER TABLE public.auctions 
ALTER COLUMN status SET DEFAULT 'draft'::auction_status,
ALTER COLUMN status SET NOT NULL;

-- 6. Recrear política de auctions con nuevo tipo ENUM
CREATE POLICY "Anyone can view active auctions"
ON public.auctions
FOR SELECT
USING (
  status IN ('active'::auction_status, 'ended_pending_acceptance'::auction_status, 'accepted'::auction_status, 'contact_shared'::auction_status, 'closed'::auction_status)
  OR seller_id = auth.uid()
);

-- 7. Recrear política de bids con nuevo tipo ENUM
CREATE POLICY "Users can view bids on auctions they participate in"
ON public.bids
FOR SELECT
USING (
  bidder_id = auth.uid()
  OR EXISTS (
    SELECT 1 FROM public.auctions
    WHERE auctions.id = bids.auction_id
    AND (
      auctions.seller_id = auth.uid()
      OR auctions.status = 'active'::auction_status
    )
  )
);

-- 8. Añadir campos para trazabilidad de aceptación/rechazo
ALTER TABLE public.auctions
ADD COLUMN IF NOT EXISTS seller_decision_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS seller_decision_reason TEXT,
ADD COLUMN IF NOT EXISTS contact_shared_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS closed_at TIMESTAMPTZ;

-- 9. Crear tabla de auditoría para transiciones de estado (INMUTABLE)
CREATE TABLE IF NOT EXISTS public.auction_state_transitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auction_id UUID NOT NULL REFERENCES public.auctions(id) ON DELETE RESTRICT,
  from_status public.auction_status,
  to_status public.auction_status NOT NULL,
  triggered_by UUID,
  trigger_type TEXT NOT NULL CHECK (trigger_type IN ('automatic', 'manual', 'admin')),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 10. Habilitar RLS en tabla de transiciones
ALTER TABLE public.auction_state_transitions ENABLE ROW LEVEL SECURITY;

-- 11. Política: Solo lectura para participantes
CREATE POLICY "Auction participants can view transitions"
ON public.auction_state_transitions
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.auctions a
    WHERE a.id = auction_state_transitions.auction_id
    AND (a.seller_id = auth.uid() OR a.winner_id = auth.uid())
  )
  OR EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'::app_role
  )
);

-- 12. Política: Solo backend puede insertar (via service role)
CREATE POLICY "Only system can insert transitions"
ON public.auction_state_transitions
FOR INSERT
WITH CHECK (false);

-- 13. Índice para consultas por subasta
CREATE INDEX IF NOT EXISTS idx_auction_state_transitions_auction 
ON public.auction_state_transitions(auction_id, created_at DESC);

-- 14. Comentarios de documentación
COMMENT ON TYPE public.auction_status IS 'Estados oficiales del sistema de subastas Kontact VO - Documento Capa 1';
COMMENT ON TABLE public.auction_state_transitions IS 'Log inmutable de transiciones de estado - NO EDITABLE/NO ELIMINABLE';
COMMENT ON COLUMN public.auctions.seller_decision_at IS 'Timestamp de aceptación/rechazo por vendedor';
COMMENT ON COLUMN public.auctions.contact_shared_at IS 'Timestamp cuando se compartieron datos de contacto';
COMMENT ON COLUMN public.auctions.closed_at IS 'Timestamp de cierre definitivo de la subasta';