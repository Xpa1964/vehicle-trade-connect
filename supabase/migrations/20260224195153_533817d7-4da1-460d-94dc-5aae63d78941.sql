-- Add inventory sync columns to vehicles table
ALTER TABLE public.vehicles 
  ADD COLUMN IF NOT EXISTS partner_id uuid,
  ADD COLUMN IF NOT EXISTS external_id text,
  ADD COLUMN IF NOT EXISTS source text NOT NULL DEFAULT 'manual',
  ADD COLUMN IF NOT EXISTS last_seen_at timestamptz,
  ADD COLUMN IF NOT EXISTS language varchar(10);

-- Add unique constraint for partner inventory reconciliation
ALTER TABLE public.vehicles 
  ADD CONSTRAINT vehicles_partner_external_unique UNIQUE (partner_id, external_id);

-- Add check constraint for source enum
ALTER TABLE public.vehicles 
  ADD CONSTRAINT vehicles_source_check CHECK (source IN ('api', 'manual'));

-- Index for fast reconciliation queries
CREATE INDEX IF NOT EXISTS idx_vehicles_partner_last_seen 
  ON public.vehicles (partner_id, last_seen_at) 
  WHERE source = 'api';