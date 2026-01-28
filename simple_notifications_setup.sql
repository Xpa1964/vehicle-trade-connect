-- COPY AND PASTE THIS IN YOUR SUPABASE SQL EDITOR
-- Simple setup for notification system

-- 1. Create notification templates table
CREATE TABLE notification_templates (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT NOT NULL,
  variables TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. Insert the working templates
INSERT INTO notification_templates VALUES
('1', 'Plantilla de Bienvenida', 'Bienvenido a KONTACT VO, {nombre}!', 'Hola {nombre},...', 'welcome', '{nombre,email,empresa,pais,fecha}', true, NOW(), NOW()),
('2', 'Recordatorio de Actividad', 'Te echamos de menos, {nombre}', 'Hola {nombre},...', 'reminder', '{nombre,vehiculos_nuevos,mensajes_pendientes,contactos_nuevos}', true, NOW(), NOW()),
('3', 'Actualizaciones del Sistema', 'Nuevas funcionalidades disponibles', 'Estimado/a usuario/a,...', 'system_update', '{funcionalidad_1,funcionalidad_2,funcionalidad_3}', true, NOW(), NOW()),
('4', 'Promoción Especial', 'Oferta exclusiva para ti, {nombre}', 'Hola {nombre},...', 'promotion', '{nombre,descripcion_oferta,beneficio_1,beneficio_2,beneficio_3,fecha_vencimiento}', true, NOW(), NOW());

-- 3. Create notification history table  
CREATE TABLE notification_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  template_id TEXT,
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  type TEXT NOT NULL,
  recipient_count INTEGER DEFAULT 0,
  sent_count INTEGER DEFAULT 0,
  failed_count INTEGER DEFAULT 0,
  sent_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 4. Create notification recipients table (tracks individual users)
CREATE TABLE notification_recipients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  notification_history_id UUID REFERENCES notification_history(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
  sent_at TIMESTAMP,
  error_message TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 5. Create user notifications table (for user inbox)
CREATE TABLE user_notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  notification_history_id UUID REFERENCES notification_history(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_notification_recipients_history ON notification_recipients(notification_history_id);
CREATE INDEX idx_notification_recipients_user ON notification_recipients(user_id);
CREATE INDEX idx_user_notifications_user ON user_notifications(user_id);
CREATE INDEX idx_user_notifications_unread ON user_notifications(user_id, is_read) WHERE is_read = false;

-- DONE! Now you can track individual notification recipients and have a complete system