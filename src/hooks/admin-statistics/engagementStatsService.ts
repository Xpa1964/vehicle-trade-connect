
import { supabase } from '@/integrations/supabase/client';

export const getDailyActiveUsers = async () => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  
  const { data, error } = await supabase
    .from('activity_logs')
    .select('user_id')
    .gte('created_at', yesterday.toISOString())
    .not('user_id', 'is', null);
  
  if (error) {
    console.error('Error fetching DAU:', error);
    return 0;
  }
  
  const uniqueUsers = new Set(data?.map(log => log.user_id) || []);
  return uniqueUsers.size;
};

export const getWeeklyActiveUsers = async () => {
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  
  const { data, error } = await supabase
    .from('activity_logs')
    .select('user_id')
    .gte('created_at', weekAgo.toISOString())
    .not('user_id', 'is', null);
  
  if (error) {
    console.error('Error fetching WAU:', error);
    return 0;
  }
  
  const uniqueUsers = new Set(data?.map(log => log.user_id) || []);
  return uniqueUsers.size;
};

export const getMonthlyActiveUsers = async () => {
  const monthAgo = new Date();
  monthAgo.setDate(monthAgo.getDate() - 30);
  
  const { data, error } = await supabase
    .from('activity_logs')
    .select('user_id')
    .gte('created_at', monthAgo.toISOString())
    .not('user_id', 'is', null);
  
  if (error) {
    console.error('Error fetching MAU:', error);
    return 0;
  }
  
  const uniqueUsers = new Set(data?.map(log => log.user_id) || []);
  return uniqueUsers.size;
};

export const getUserRetentionRate = async () => {
  const monthAgo = new Date();
  monthAgo.setDate(monthAgo.getDate() - 30);
  
  const twoMonthsAgo = new Date();
  twoMonthsAgo.setDate(twoMonthsAgo.getDate() - 60);
  
  // Usuarios activos hace 2 meses
  const { data: oldUsers, error: oldError } = await supabase
    .from('activity_logs')
    .select('user_id')
    .gte('created_at', twoMonthsAgo.toISOString())
    .lt('created_at', monthAgo.toISOString())
    .not('user_id', 'is', null);
  
  // Usuarios activos en el último mes
  const { data: recentUsers, error: recentError } = await supabase
    .from('activity_logs')
    .select('user_id')
    .gte('created_at', monthAgo.toISOString())
    .not('user_id', 'is', null);
  
  if (oldError || recentError || !oldUsers || !recentUsers) {
    console.error('Error calculating retention rate:', oldError || recentError);
    return 0;
  }
  
  const oldUserSet = new Set(oldUsers.map(log => log.user_id));
  const recentUserSet = new Set(recentUsers.map(log => log.user_id));
  
  const retainedUsers = [...oldUserSet].filter(user => recentUserSet.has(user));
  
  return oldUserSet.size > 0 ? Math.round((retainedUsers.length / oldUserSet.size) * 100) : 0;
};

export const getAverageSessionDuration = async () => {
  // En una implementación real, esto requeriría tracking de sesiones
  // Por ahora simulamos basándonos en actividad
  return 15; // 15 minutos promedio
};

export const getTotalRatingsGiven = async () => {
  const { count, error } = await supabase
    .from('ratings')
    .select('*', { count: 'exact', head: true });
  
  if (error) {
    console.error('Error fetching ratings given:', error);
    return 0;
  }
  
  return count || 0;
};
