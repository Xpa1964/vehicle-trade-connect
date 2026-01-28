
import { supabase } from '@/integrations/supabase/client';

export const getAveragePageLoadTime = async () => {
  // En producción esto vendría de métricas reales de performance
  return 1.2; // 1.2 segundos promedio
};

export const getErrorRate = async () => {
  const { count: totalErrors } = await supabase
    .from('activity_logs')
    .select('*', { count: 'exact', head: true })
    .eq('severity', 'error');
  
  const { count: totalRequests } = await supabase
    .from('activity_logs')
    .select('*', { count: 'exact', head: true });
  
  if (!totalRequests || totalRequests === 0) return 0;
  
  return Math.round(((totalErrors || 0) / totalRequests) * 100 * 100) / 100; // 2 decimales
};

export const getKeyFeatureUsageRate = async (featureName: string) => {
  const { count: featureUsers } = await supabase
    .from('activity_logs')
    .select('user_id', { count: 'exact', head: true })
    .eq('action_type', `${featureName}_use`);
  
  const { count: totalUsers } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true });
  
  if (!totalUsers || totalUsers === 0) return 0;
  
  return Math.round(((featureUsers || 0) / totalUsers) * 100);
};

export const getFormAbandonmentRate = async () => {
  const { count: incompleteVehicles } = await supabase
    .from('vehicles')
    .select('*', { count: 'exact', head: true })
    .is('description', null); // Asumimos que sin descripción = incompleto
  
  const { count: totalVehicles } = await supabase
    .from('vehicles')
    .select('*', { count: 'exact', head: true });
  
  if (!totalVehicles || totalVehicles === 0) return 0;
  
  return Math.round(((incompleteVehicles || 0) / totalVehicles) * 100);
};
