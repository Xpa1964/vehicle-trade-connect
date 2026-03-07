
-- Add a non-sensitive boolean column to avoid exposing reserve_price amount
ALTER TABLE public.auctions ADD COLUMN IF NOT EXISTS has_reserve boolean GENERATED ALWAYS AS (reserve_price IS NOT NULL) STORED;
