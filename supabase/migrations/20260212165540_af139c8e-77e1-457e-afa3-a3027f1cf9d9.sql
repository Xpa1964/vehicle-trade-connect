-- Allow all authenticated users to view exchange requests (they're public listings)
DROP POLICY IF EXISTS "Users can view own exchanges" ON public.exchanges;

CREATE POLICY "Users can view all exchange requests"
ON public.exchanges
FOR SELECT
USING (true);
