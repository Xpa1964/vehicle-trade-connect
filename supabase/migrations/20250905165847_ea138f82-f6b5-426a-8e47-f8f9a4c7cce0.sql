-- Agregar campos faltantes a la tabla announcements
ALTER TABLE public.announcements 
ADD COLUMN IF NOT EXISTS status text DEFAULT 'active',
ADD COLUMN IF NOT EXISTS category text DEFAULT 'general',
ADD COLUMN IF NOT EXISTS type text DEFAULT 'announcement',
ADD COLUMN IF NOT EXISTS is_featured boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS featured_until timestamp with time zone,
ADD COLUMN IF NOT EXISTS view_count integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS priority integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS original_language text DEFAULT 'es';

-- Corregir la tabla announcement_attachments
-- Eliminar columnas incorrectas y agregar las correctas
ALTER TABLE public.announcement_attachments 
DROP COLUMN IF EXISTS file_url,
ADD COLUMN IF NOT EXISTS storage_path text NOT NULL DEFAULT '';

-- Actualizar las políticas RLS para announcement_attachments
DROP POLICY IF EXISTS "attachment_select_all" ON public.announcement_attachments;
DROP POLICY IF EXISTS "attachment_insert_owner" ON public.announcement_attachments;
DROP POLICY IF EXISTS "attachment_delete_owner" ON public.announcement_attachments;

-- Nuevas políticas RLS más específicas
CREATE POLICY "attachments_select_any" 
ON public.announcement_attachments 
FOR SELECT 
USING (true);

CREATE POLICY "attachments_insert_owner" 
ON public.announcement_attachments 
FOR INSERT 
WITH CHECK (auth.uid() = (SELECT user_id FROM announcements WHERE id = announcement_id));

CREATE POLICY "attachments_delete_owner" 
ON public.announcement_attachments 
FOR DELETE 
USING (auth.uid() = (SELECT user_id FROM announcements WHERE id = announcement_id));

-- Habilitar RLS en announcements si no está habilitado
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para announcements
CREATE POLICY IF NOT EXISTS "announcements_select_all" 
ON public.announcements 
FOR SELECT 
USING (true);

CREATE POLICY IF NOT EXISTS "announcements_insert_own" 
ON public.announcements 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "announcements_update_own" 
ON public.announcements 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "announcements_delete_own" 
ON public.announcements 
FOR DELETE 
USING (auth.uid() = user_id);