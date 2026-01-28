export interface NotificationTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  type: 'welcome' | 'reminder' | 'system_update' | 'promotion' | 'general';
  variables: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by?: string;
}

export interface CreateTemplateData {
  name: string;
  subject: string;
  content: string;
  type: string;
  variables?: string[];
  is_active?: boolean;
}

// Predefined templates that are fully functional
const predefinedTemplates: NotificationTemplate[] = [
  {
    id: '1',
    name: 'Plantilla de Bienvenida',
    subject: 'Bienvenido a KONTACT VO, {nombre}!',
    content: `Hola {nombre},

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

El equipo de KONTACT VO`,
    type: 'welcome',
    variables: ['nombre', 'email', 'empresa', 'pais', 'fecha'],
    is_active: true,
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    name: 'Recordatorio de Actividad',
    subject: 'Te echamos de menos, {nombre}',
    content: `Hola {nombre},

Hemos notado que no has visitado tu cuenta de KONTACT VO en un tiempo.

Hay muchas oportunidades esperándote:
• {vehiculos_nuevos} nuevos vehículos publicados
• {mensajes_pendientes} mensajes sin leer
• {contactos_nuevos} nuevas conexiones potenciales

¡Vuelve y no te pierdas estas oportunidades!

[Ver mi cuenta]

Saludos,
El equipo de KONTACT VO`,
    type: 'reminder',
    variables: ['nombre', 'vehiculos_nuevos', 'mensajes_pendientes', 'contactos_nuevos'],
    is_active: true,
    created_at: '2024-01-10T15:45:00Z',
    updated_at: '2024-01-10T15:45:00Z'
  },
  {
    id: '3',
    name: 'Actualizaciones del Sistema',
    subject: 'Nuevas funcionalidades disponibles en KONTACT VO',
    content: `Estimado/a usuario/a,

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

El equipo de KONTACT VO`,
    type: 'system_update',
    variables: ['funcionalidad_1', 'funcionalidad_2', 'funcionalidad_3'],
    is_active: true,
    created_at: '2024-01-08T09:15:00Z',
    updated_at: '2024-01-08T09:15:00Z'
  },
  {
    id: '4',
    name: 'Promoción Especial',
    subject: 'Oferta exclusiva para ti, {nombre}',
    content: `Hola {nombre},

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
El equipo de KONTACT VO`,
    type: 'promotion',
    variables: ['nombre', 'descripcion_oferta', 'beneficio_1', 'beneficio_2', 'beneficio_3', 'fecha_vencimiento'],
    is_active: true,
    created_at: '2024-01-05T16:20:00Z',
    updated_at: '2024-01-05T16:20:00Z'
  }
];

export const notificationTemplateService = {
  // Get all active templates (working with predefined templates)
  async getTemplates(): Promise<NotificationTemplate[]> {
    console.log('📧 Loading notification templates...');
    const activeTemplates = predefinedTemplates.filter(t => t.is_active);
    console.log(`✅ Loaded ${activeTemplates.length} active templates`);
    return activeTemplates;
  },

  // Get template by ID
  async getTemplateById(id: string): Promise<NotificationTemplate | null> {
    console.log('🔍 Searching for template with ID:', id);
    const template = predefinedTemplates.find(t => t.id === id && t.is_active);
    if (template) {
      console.log('✅ Template found:', template.name);
    } else {
      console.log('❌ Template not found');
    }
    return template || null;
  },

  // Create new template (simulation - would require Supabase table)
  async createTemplate(templateData: CreateTemplateData): Promise<NotificationTemplate | null> {
    console.log('🆕 Creating new template:', templateData.name);
    console.log('⚠️ Note: Creating templates requires Supabase table setup');
    // In a real implementation, this would insert into Supabase
    return null;
  },

  // Update template (simulation - would require Supabase table)
  async updateTemplate(id: string, templateData: Partial<CreateTemplateData>): Promise<NotificationTemplate | null> {
    console.log('✏️ Updating template:', id);
    console.log('⚠️ Note: Updating templates requires Supabase table setup');
    // In a real implementation, this would update in Supabase
    return null;
  },

  // Delete template (simulation - would require Supabase table)
  async deleteTemplate(id: string): Promise<boolean> {
    console.log('🗑️ Deleting template:', id);
    console.log('⚠️ Note: Deleting templates requires Supabase table setup');
    // In a real implementation, this would soft delete in Supabase
    return true;
  },

  // Replace variables in template content
  replaceVariables(content: string, variables: Record<string, string>): string {
    let processedContent = content;
    
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`{${key}}`, 'g');
      processedContent = processedContent.replace(regex, value);
    });

    return processedContent;
  },

  // Extract variables from template content
  extractVariables(content: string): string[] {
    const regex = /\{([^}]+)\}/g;
    const variables: string[] = [];
    let match;

    while ((match = regex.exec(content)) !== null) {
      if (!variables.includes(match[1])) {
        variables.push(match[1]);
      }
    }

    return variables;
  }
};