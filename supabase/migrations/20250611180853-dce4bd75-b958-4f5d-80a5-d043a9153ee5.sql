
-- Ajustar la tabla exchanges para recibir las propuestas correctamente
ALTER TABLE public.exchanges 
DROP COLUMN IF EXISTS initiator_vehicle,
DROP COLUMN IF EXISTS target_preferences,
ADD COLUMN IF NOT EXISTS offered_vehicle_id UUID REFERENCES public.vehicles(id),
ADD COLUMN IF NOT EXISTS requested_vehicle_id UUID REFERENCES public.vehicles(id),
ADD COLUMN IF NOT EXISTS compensation NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS conditions TEXT[],
ADD COLUMN IF NOT EXISTS conversation_id UUID REFERENCES public.conversations(id);

-- Asegurar que target_vehicle_id sea opcional para las propuestas generales
ALTER TABLE public.exchanges ALTER COLUMN target_vehicle_id DROP NOT NULL;

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_exchanges_offered_vehicle ON public.exchanges(offered_vehicle_id);
CREATE INDEX IF NOT EXISTS idx_exchanges_requested_vehicle ON public.exchanges(requested_vehicle_id);
CREATE INDEX IF NOT EXISTS idx_exchanges_conversation ON public.exchanges(conversation_id);
