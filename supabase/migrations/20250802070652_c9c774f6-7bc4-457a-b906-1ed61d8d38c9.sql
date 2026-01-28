-- Create admin configuration table
CREATE TABLE public.admin_config (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on admin_config
ALTER TABLE public.admin_config ENABLE ROW LEVEL SECURITY;

-- Only admins can manage admin config
CREATE POLICY "Only admins can manage admin config"
ON public.admin_config
FOR ALL
USING (EXISTS (
  SELECT 1 FROM public.user_roles 
  WHERE user_id = auth.uid() AND role = 'admin'
));

-- Insert current admin email configuration
INSERT INTO public.admin_config (key, value, description) VALUES 
('admin_emails', '["xperez1964@gmail.com"]', 'List of administrative email addresses'),
('security_cleanup_config', '{"enabled": true, "auto_cleanup_drafts": true}', 'Security cleanup configuration settings');