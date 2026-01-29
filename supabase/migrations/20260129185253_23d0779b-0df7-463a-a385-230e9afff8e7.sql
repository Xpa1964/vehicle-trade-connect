-- Remove overly permissive INSERT policy on registration_requests (linter: RLS Policy Always True)

ALTER TABLE public.registration_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can create registration request" ON public.registration_requests;

CREATE POLICY "Anyone can create registration request"
ON public.registration_requests
FOR INSERT
WITH CHECK (
  -- Prevent privilege escalation by forcing pending status and no admin notes
  coalesce(status, 'pending') = 'pending'
  AND admin_notes IS NULL
  -- Allow anonymous creation, but disallow forging a user_id
  AND (user_id IS NULL OR user_id = auth.uid())
);
