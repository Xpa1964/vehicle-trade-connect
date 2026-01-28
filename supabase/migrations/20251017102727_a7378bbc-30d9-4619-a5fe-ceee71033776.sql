-- ============================================
-- SCRIPT SEGURO PARA FOREIGN KEYS DE SUBASTAS
-- ============================================

-- PASO 1: Eliminar foreign keys si ya existen (evita errores)
DO $$ 
BEGIN
    ALTER TABLE auctions DROP CONSTRAINT IF EXISTS auctions_created_by_fkey;
    ALTER TABLE auctions DROP CONSTRAINT IF EXISTS auctions_winner_id_fkey;
    ALTER TABLE bids DROP CONSTRAINT IF EXISTS bids_bidder_id_fkey;
EXCEPTION
    WHEN OTHERS THEN NULL; -- Ignora errores si no existen
END $$;

-- PASO 2: Limpiar registros huérfanos en auctions
UPDATE auctions 
SET created_by = NULL 
WHERE created_by IS NOT NULL 
  AND NOT EXISTS (
    SELECT 1 FROM profiles WHERE id = auctions.created_by
  );

UPDATE auctions 
SET winner_id = NULL 
WHERE winner_id IS NOT NULL 
  AND NOT EXISTS (
    SELECT 1 FROM profiles WHERE id = auctions.winner_id
  );

-- PASO 3: Limpiar registros huérfanos en bids
DELETE FROM bids 
WHERE bidder_id IS NOT NULL 
  AND NOT EXISTS (
    SELECT 1 FROM profiles WHERE id = bids.bidder_id
  );

-- PASO 4: Aplicar foreign keys
ALTER TABLE auctions 
ADD CONSTRAINT auctions_created_by_fkey 
FOREIGN KEY (created_by) 
REFERENCES profiles(id) 
ON DELETE CASCADE;

ALTER TABLE auctions 
ADD CONSTRAINT auctions_winner_id_fkey 
FOREIGN KEY (winner_id) 
REFERENCES profiles(id) 
ON DELETE SET NULL;

ALTER TABLE bids 
ADD CONSTRAINT bids_bidder_id_fkey 
FOREIGN KEY (bidder_id) 
REFERENCES profiles(id) 
ON DELETE CASCADE;

-- PASO 5: Verificación (opcional - solo para logs)
DO $$ 
BEGIN
    RAISE NOTICE 'Foreign keys aplicadas correctamente ✓';
END $$;