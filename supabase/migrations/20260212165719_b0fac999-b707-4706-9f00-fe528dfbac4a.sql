-- Allow viewing scheduled auctions (so users can see upcoming auctions)
DROP POLICY IF EXISTS "Anyone can view active auctions" ON public.auctions;

CREATE POLICY "Anyone can view auctions"
ON public.auctions
FOR SELECT
USING (
  status = ANY (ARRAY[
    'scheduled'::auction_status,
    'active'::auction_status,
    'ended_pending_acceptance'::auction_status,
    'accepted'::auction_status,
    'contact_shared'::auction_status,
    'closed'::auction_status
  ])
  OR seller_id = auth.uid()
);