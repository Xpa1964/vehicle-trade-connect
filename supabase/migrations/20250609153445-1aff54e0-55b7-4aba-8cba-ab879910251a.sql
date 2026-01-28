
-- Eliminar todas las políticas existentes de registration_requests
DROP POLICY IF EXISTS "Allow public to insert registration requests" ON public.registration_requests;
DROP POLICY IF EXISTS "Allow anonymous registration requests" ON public.registration_requests;
DROP POLICY IF EXISTS "Admins can manage registration requests" ON public.registration_requests;
DROP POLICY IF EXISTS "Only admins can view registration requests" ON public.registration_requests;
DROP POLICY IF EXISTS "Only admins can update registration requests" ON public.registration_requests;
DROP POLICY IF EXISTS "Allow public to insert registration requests with email check" ON public.registration_requests;

-- Consolidar la política de inserción con validación de email
CREATE POLICY "Allow public to insert registration requests with email check" 
ON public.registration_requests 
FOR INSERT 
TO anon, authenticated 
WITH CHECK ((email IS NOT NULL) AND (email <> ''::text));

-- Política de visualización para administradores
CREATE POLICY "Only admins can view registration requests" 
ON public.registration_requests 
FOR SELECT 
TO authenticated 
USING (EXISTS (SELECT 1 FROM public.user_roles WHERE (user_roles.user_id = auth.uid()) AND (user_roles.role::text = ANY (ARRAY['admin'::text, 'moderator'::text]))));

-- Política de actualización para administradores
CREATE POLICY "Only admins can update registration requests" 
ON public.registration_requests 
FOR UPDATE 
TO authenticated 
USING (EXISTS (SELECT 1 FROM public.user_roles WHERE (user_roles.user_id = auth.uid()) AND (user_roles.role::text = ANY (ARRAY['admin'::text, 'moderator'::text])))) 
WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles WHERE (user_roles.user_id = auth.uid()) AND (user_roles.role::text = ANY (ARRAY['admin'::text, 'moderator'::text]))));
