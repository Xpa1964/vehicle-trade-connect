CREATE POLICY "Anyone can update campaign events"
ON public.campaign_events
FOR UPDATE
TO anon, authenticated
USING (true)
WITH CHECK (true);