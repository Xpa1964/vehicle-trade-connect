
import { supabase } from '@/integrations/supabase/client';
import { RecentActivity } from './types';

const mapEntityTypeToActivityType = (entityType: string): 'user_signup' | 'vehicle_added' | 'conversation' | 'alert' => {
  if (entityType.includes('user') || entityType.includes('registration')) return 'user_signup';
  if (entityType.includes('vehicle') || entityType.includes('auction')) return 'vehicle_added';
  if (entityType.includes('message') || entityType.includes('conversation')) return 'conversation';
  return 'alert';
};

export const fetchRecentActivity = async (): Promise<RecentActivity[]> => {
  try {
    // Fetch real activity logs from the database
    const { data: activityData, error: activityError } = await supabase
      .from('activity_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);
      
    if (activityError) {
      console.error('[activityLogsService] Error fetching activity logs:', activityError);
      throw activityError;
    }
    
    // If we have real activity logs, use them
    if (activityData && activityData.length > 0) {
      const formattedActivity: RecentActivity[] = activityData.map(log => {
        const detailsObj = typeof log.details === 'string' 
          ? JSON.parse(log.details) 
          : log.details;
          
        let description = '';
        if (detailsObj && typeof detailsObj === 'object' && detailsObj.message) {
          description = detailsObj.message;
        } else {
          // Create meaningful descriptions based on action type
          switch (log.action_type) {
            case 'login':
              description = 'Usuario ha iniciado sesión en el sistema';
              break;
            case 'vehicle_create':
              description = 'Nuevo vehículo añadido al inventario';
              break;
            case 'message_sent':
              description = 'Mensaje enviado en una conversación';
              break;
            case 'auto_create_profile':
              description = 'Perfil creado automáticamente tras aprobación';
              break;
            case 'conversations_monitoring_view':
              description = 'Panel de monitoreo de conversaciones accedido';
              break;
            case 'conversations_export':
              description = 'Datos de conversaciones exportados';
              break;
            default:
              description = `${log.entity_type || 'Sistema'}: ${log.action_type}`;
          }
        }
        
        // Create meaningful titles
        let title = '';
        switch (log.action_type) {
          case 'login':
            title = 'Inicio de Sesión';
            break;
          case 'vehicle_create':
            title = 'Vehículo Añadido';
            break;
          case 'message_sent':
            title = 'Mensaje Enviado';
            break;
          case 'auto_create_profile':
            title = 'Perfil Creado';
            break;
          case 'conversations_monitoring_view':
            title = 'Monitoreo Accedido';
            break;
          case 'conversations_export':
            title = 'Datos Exportados';
            break;
          default:
            title = log.action_type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        }
        
        return {
          id: log.id,
          title,
          description,
          timestamp: log.created_at,
          type: mapEntityTypeToActivityType(log.entity_type || log.action_type),
          severity: log.severity === 'warning' ? 'warning' : 
                  log.severity === 'error' ? 'alert' : undefined
        };
      });
      
      return formattedActivity;
    }
    
    // If no activity logs exist yet, fetch recent real system activity
    console.log('[activityLogsService] No activity logs found, fetching recent system activity');
    
    // Get recent user registrations
    const { data: recentUsers } = await supabase
      .from('profiles')
      .select('id, created_at, company_name')
      .order('created_at', { ascending: false })
      .limit(5);
    
    // Get recent vehicles
    const { data: recentVehicles } = await supabase
      .from('vehicles')
      .select('id, created_at, brand, model')
      .order('created_at', { ascending: false })
      .limit(5);
    
    // Get recent conversations
    const { data: recentConversations } = await supabase
      .from('conversations')
      .select('id, created_at, source_title')
      .order('created_at', { ascending: false })
      .limit(5);
    
    const realActivity: RecentActivity[] = [];
    
    // Add recent users
    recentUsers?.forEach(user => {
      realActivity.push({
        id: `user-${user.id}`,
        title: 'Nuevo Usuario Registrado',
        description: `${user.company_name || 'Usuario'} se ha registrado en la plataforma`,
        timestamp: user.created_at,
        type: 'user_signup'
      });
    });
    
    // Add recent vehicles
    recentVehicles?.forEach(vehicle => {
      realActivity.push({
        id: `vehicle-${vehicle.id}`,
        title: 'Vehículo Añadido',
        description: `${vehicle.brand} ${vehicle.model} añadido al inventario`,
        timestamp: vehicle.created_at,
        type: 'vehicle_added'
      });
    });
    
    // Add recent conversations
    recentConversations?.forEach(conversation => {
      realActivity.push({
        id: `conversation-${conversation.id}`,
        title: 'Nueva Conversación',
        description: `Conversación iniciada: ${conversation.source_title || 'Sin título'}`,
        timestamp: conversation.created_at,
        type: 'conversation'
      });
    });
    
    // Sort by timestamp and return latest 10
    return realActivity
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 10);
      
  } catch (err) {
    console.error('[activityLogsService] Error fetching real activity:', err);
    
    // As absolute fallback, return empty array instead of fake data
    return [];
  }
};
