-- Agregar columna hidden_at para ocultar subastas después de 48 horas
ALTER TABLE public.auctions 
ADD COLUMN hidden_at TIMESTAMP WITH TIME ZONE;

-- Actualizar registros existentes con status 'ended'
UPDATE public.auctions 
SET hidden_at = end_date + INTERVAL '48 hours'
WHERE status = 'ended';

-- Función para calcular hidden_at automáticamente
CREATE OR REPLACE FUNCTION public.set_auction_hidden_at()
RETURNS TRIGGER AS $$
BEGIN
  -- Si el status cambia a 'ended', calcular hidden_at
  IF NEW.status = 'ended' AND (OLD.status IS NULL OR OLD.status != 'ended') THEN
    NEW.hidden_at = NEW.end_date + INTERVAL '48 hours';
  END IF;
  
  -- Si el status cambia de 'ended' a otro, limpiar hidden_at
  IF NEW.status != 'ended' AND OLD.status = 'ended' THEN
    NEW.hidden_at = NULL;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger para ejecutar la función automáticamente
DROP TRIGGER IF EXISTS trigger_set_auction_hidden_at ON public.auctions;
CREATE TRIGGER trigger_set_auction_hidden_at
  BEFORE INSERT OR UPDATE OF status, end_date ON public.auctions
  FOR EACH ROW
  EXECUTE FUNCTION public.set_auction_hidden_at();

-- Índice para mejorar performance en queries de subastas visibles
CREATE INDEX IF NOT EXISTS idx_auctions_hidden_at ON public.auctions(hidden_at) 
WHERE hidden_at IS NOT NULL;