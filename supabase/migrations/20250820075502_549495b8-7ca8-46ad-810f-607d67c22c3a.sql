-- Fix the problematic RLS policy in user_notifications to use has_role function
-- This aligns it with the working pattern used in other tables

-- Drop the incorrect policy that uses auth.jwt()
DROP POLICY IF EXISTS "Admin can manage all user notifications" ON public.user_notifications;

-- Create the correct policy using has_role function (same pattern as user_roles table)
CREATE POLICY "Admin can manage all user notifications" 
ON public.user_notifications 
FOR ALL 
TO authenticated 
USING (has_role('admin'::text))
WITH CHECK (has_role('admin'::text));