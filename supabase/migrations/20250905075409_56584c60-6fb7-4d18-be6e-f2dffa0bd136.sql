-- Drop the faulty UPDATE policy
DROP POLICY IF EXISTS "announcements_update_own" ON public.announcements;

-- Create the correct UPDATE policy with WITH CHECK clause
CREATE POLICY "announcements_update_own" 
ON public.announcements 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);