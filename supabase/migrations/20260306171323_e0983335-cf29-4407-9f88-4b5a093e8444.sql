
CREATE POLICY "Users can update own pending quotes"
ON public.transport_quotes
FOR UPDATE
TO authenticated
USING (requester_id = auth.uid() AND status = 'pending')
WITH CHECK (requester_id = auth.uid() AND status = 'pending');
