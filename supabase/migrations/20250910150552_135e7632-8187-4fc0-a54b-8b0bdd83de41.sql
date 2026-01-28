-- Remove the conflicting restrictive policy that's blocking insertions
DROP POLICY IF EXISTS "attachments_insert_owner" ON public.announcement_attachments;

-- Keep only the allow_all policy that permits all operations
-- (This policy already exists and allows all operations)

-- Verify the remaining policies are correct
-- The allow_all policy should handle all operations without conflicts