
-- Verificar el estado actual de RLS en registration_requests
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables t
WHERE t.tablename = 'registration_requests';

-- Ver las políticas existentes
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'registration_requests';

-- Eliminar políticas existentes si existen
DROP POLICY IF EXISTS "Allow public to insert registration requests" ON public.registration_requests;
DROP POLICY IF EXISTS "Only admins can view registration requests" ON public.registration_requests;
DROP POLICY IF EXISTS "Only admins can update registration requests" ON public.registration_requests;

-- Crear política para permitir INSERT público en registration_requests
CREATE POLICY "Allow public to insert registration requests" 
ON public.registration_requests 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

-- Crear política para que solo admins puedan ver las solicitudes
CREATE POLICY "Only admins can view registration requests" 
ON public.registration_requests 
FOR SELECT 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role::text IN ('admin', 'moderator')
  )
);

-- Crear política para que solo admins puedan actualizar las solicitudes
CREATE POLICY "Only admins can update registration requests" 
ON public.registration_requests 
FOR UPDATE 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role::text IN ('admin', 'moderator')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role::text IN ('admin', 'moderator')
  )
);
