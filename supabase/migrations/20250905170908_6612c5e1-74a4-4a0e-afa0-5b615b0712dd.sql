-- Opción B: Agregar user_id a announcement_attachments y simplificar políticas

-- 1. Agregar user_id a announcement_attachments
ALTER TABLE public.announcement_attachments 
ADD COLUMN IF NOT EXISTS user_id uuid;

-- 2. Poblar user_id desde announcements
UPDATE public.announcement_attachments 
SET user_id = (
  SELECT a.user_id 
  FROM public.announcements a 
  WHERE a.id = announcement_attachments.announcement_id
)
WHERE user_id IS NULL;

-- 3. Hacer user_id NOT NULL
ALTER TABLE public.announcement_attachments 
ALTER COLUMN user_id SET NOT NULL;

-- 4. Eliminar políticas existentes de announcement_attachments
DROP POLICY IF EXISTS "attachments_select_any" ON public.announcement_attachments;
DROP POLICY IF EXISTS "attachments_insert_owner" ON public.announcement_attachments;
DROP POLICY IF EXISTS "attachments_delete_owner" ON public.announcement_attachments;

-- 5. Habilitar RLS en announcements
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- 6. Crear políticas idénticas para ambas tablas

-- Políticas para announcements
CREATE POLICY "announcements_select_all" 
ON public.announcements 
FOR SELECT 
USING (true);

CREATE POLICY "announcements_insert_owner" 
ON public.announcements 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "announcements_delete_owner" 
ON public.announcements 
FOR DELETE 
USING (auth.uid() = user_id);

-- Políticas para announcement_attachments (idénticas)
CREATE POLICY "attachments_select_all" 
ON public.announcement_attachments 
FOR SELECT 
USING (true);

CREATE POLICY "attachments_insert_owner" 
ON public.announcement_attachments 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "attachments_delete_owner" 
ON public.announcement_attachments 
FOR DELETE 
USING (auth.uid() = user_id);