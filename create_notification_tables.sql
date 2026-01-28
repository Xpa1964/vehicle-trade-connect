-- Execute this SQL in your Supabase SQL Editor to create notification tables

-- Create notification templates table
CREATE TABLE IF NOT EXISTS notification_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  subject VARCHAR(500) NOT NULL,
  content TEXT NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('welcome', 'reminder', 'promotion', 'system_update', 'general')),
  variables TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create notification history table
CREATE TABLE IF NOT EXISTS notification_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  template_id UUID REFERENCES notification_templates(id),
  subject VARCHAR(500) NOT NULL,
  content TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  type VARCHAR(50) NOT NULL,
  recipient_count INTEGER DEFAULT 0,
  sent_count INTEGER DEFAULT 0,
  failed_count INTEGER DEFAULT 0,
  sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user notifications table
CREATE TABLE IF NOT EXISTS user_notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  notification_history_id UUID REFERENCES notification_history(id),
  subject VARCHAR(500) NOT NULL,
  content TEXT NOT NULL,
  type VARCHAR(50) NOT NULL,
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE notification_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Admin can manage notification templates" ON notification_templates
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM rpc('get_user_role', (SELECT auth.uid())) WHERE rpc = 'admin'
    )
  );

CREATE POLICY "Admin can manage notification history" ON notification_history
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM rpc('get_user_role', (SELECT auth.uid())) WHERE rpc = 'admin'
    )
  );

CREATE POLICY "Users can view their own notifications" ON user_notifications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admin can manage all user notifications" ON user_notifications
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM rpc('get_user_role', (SELECT auth.uid())) WHERE rpc = 'admin'
    )
  );

-- Insert predefined templates
INSERT INTO notification_templates (id, name, subject, content, type, variables, is_active) VALUES
(
  '1',
  'Plantilla de Bienvenida',
  'Bienvenido a KONTACT VO, {nombre}!',
  'Hola {nombre},

¡Te damos la bienvenida a KONTACT VO!

Estamos encantados de tenerte como parte de nuestra comunidad. Tu registro se completó exitosamente el {fecha}.

Información de tu cuenta:
- Nombre: {nombre}
- Email: {email}
- Empresa: {empresa}
- País: {pais}

¿Qué puedes hacer ahora?
• Explorar vehículos disponibles
• Publicar tus propios anuncios
• Conectar con otros profesionales
• Acceder a herramientas exclusivas

Si tienes alguna pregunta, no dudes en contactarnos.

¡Bienvenido y que tengas mucho éxito!

El equipo de KONTACT VO',
  'welcome',
  ARRAY['nombre', 'email', 'empresa', 'pais', 'fecha'],
  true
),
(
  '2',
  'Recordatorio de Actividad',
  'Te echamos de menos, {nombre}',
  'Hola {nombre},

Hemos notado que no has visitado tu cuenta de KONTACT VO en un tiempo.

Hay muchas oportunidades esperándote:
• {vehiculos_nuevos} nuevos vehículos publicados
• {mensajes_pendientes} mensajes sin leer
• {contactos_nuevos} nuevas conexiones potenciales

¡Vuelve y no te pierdas estas oportunidades!

[Ver mi cuenta]

Saludos,
El equipo de KONTACT VO',
  'reminder',
  ARRAY['nombre', 'vehiculos_nuevos', 'mensajes_pendientes', 'contactos_nuevos'],
  true
),
(
  '3',
  'Actualizaciones del Sistema',
  'Nuevas funcionalidades disponibles en KONTACT VO',
  'Estimado/a usuario/a,

Tenemos excelentes noticias! Hemos lanzado nuevas funcionalidades en KONTACT VO:

🚀 Novedades:
• {funcionalidad_1}
• {funcionalidad_2} 
• {funcionalidad_3}

🔧 Mejoras:
• Mayor velocidad de carga
• Interfaz optimizada
• Nuevos filtros de búsqueda

📱 Compatibilidad móvil mejorada

Actualiza tu aplicación para disfrutar de todas estas mejoras.

¡Gracias por confiar en nosotros!

El equipo de KONTACT VO',
  'system_update',
  ARRAY['funcionalidad_1', 'funcionalidad_2', 'funcionalidad_3'],
  true
),
(
  '4',
  'Promoción Especial',
  'Oferta exclusiva para ti, {nombre}',
  'Hola {nombre},

¡Tenemos una oferta especial solo para ti!

🎉 PROMOCIÓN LIMITADA:
{descripcion_oferta}

✅ Beneficios incluidos:
• {beneficio_1}
• {beneficio_2}
• {beneficio_3}

⏰ Esta oferta vence el {fecha_vencimiento}

¡No dejes pasar esta oportunidad única!

[Activar promoción]

Atentamente,
El equipo de KONTACT VO',
  'promotion',
  ARRAY['nombre', 'descripcion_oferta', 'beneficio_1', 'beneficio_2', 'beneficio_3', 'fecha_vencimiento'],
  true
);

-- Create indexes
CREATE INDEX idx_notification_templates_type ON notification_templates(type);
CREATE INDEX idx_notification_templates_active ON notification_templates(is_active);
CREATE INDEX idx_notification_history_status ON notification_history(status);
CREATE INDEX idx_user_notifications_user_id ON user_notifications(user_id);