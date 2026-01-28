
-- Agregar columnas para el sistema de Venta Comisionada
ALTER TABLE public.vehicles 
ADD COLUMN IF NOT EXISTS commission_sale boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS public_sale_price numeric,
ADD COLUMN IF NOT EXISTS commission_amount numeric,
ADD COLUMN IF NOT EXISTS commission_query text;

-- Actualizar vehículos existentes que ya tienen commissionSale en metadata
UPDATE public.vehicles 
SET commission_sale = false 
WHERE commission_sale IS NULL;
