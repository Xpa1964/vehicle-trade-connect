-- Crear tabla announcement_attachments
CREATE TABLE IF NOT EXISTS public.announcement_attachments (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    announcement_id uuid NOT NULL REFERENCES public.announcements(id) ON DELETE CASCADE,
    user_id uuid NOT NULL,
    file_name text NOT NULL,
    file_type text,
    file_size integer,
    file_url text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.announcement_attachments ENABLE ROW LEVEL SECURITY;

-- Políticas RLS: Todos pueden ver, solo el propietario puede crear/eliminar
CREATE POLICY "attachment_select_all" 
ON public.announcement_attachments 
FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "attachment_insert_owner" 
ON public.announcement_attachments 
FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "attachment_delete_owner" 
ON public.announcement_attachments 
FOR DELETE 
TO authenticated 
USING (auth.uid() = user_id);

-- Índices para optimizar consultas
CREATE INDEX idx_announcement_attachments_announcement_id ON public.announcement_attachments(announcement_id);
CREATE INDEX idx_announcement_attachments_user_id ON public.announcement_attachments(user_id);