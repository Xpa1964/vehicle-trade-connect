-- Allow public access to view auctions (for non-authenticated users)
CREATE POLICY "Anyone can view auctions" ON public.auctions FOR SELECT USING (true);

-- Also allow public access to view auction bids
CREATE POLICY "Anyone can view bids" ON public.bids FOR SELECT USING (true);