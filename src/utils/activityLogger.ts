
import { supabase } from '@/integrations/supabase/client';

export const logSystemActivity = async (
  actionType: string, 
  details?: Record<string, any>,
  severity: 'info' | 'warning' | 'error' | 'success' = 'info'
) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.warn('No authenticated user for activity logging');
      return;
    }

    const { error } = await supabase
      .from('activity_logs')
      .insert({
        user_id: user.id,
        action_type: actionType,
        entity_type: 'system',
        details: details || {},
        severity
      });

    if (error) {
      console.error('Error logging activity:', error);
    }
  } catch (error) {
    console.error('Error in activity logger:', error);
  }
};

// Alias for backward compatibility
export const logUserActivity = logSystemActivity;
export const logActivity = async (params: {
  action_type: string;
  entity_type?: string;
  entity_id?: string;
  details?: Record<string, any>;
  severity?: 'info' | 'warning' | 'error' | 'success';
}) => {
  return logSystemActivity(
    params.action_type,
    {
      entity_type: params.entity_type,
      entity_id: params.entity_id,
      ...params.details
    },
    params.severity
  );
};
