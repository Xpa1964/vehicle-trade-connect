
import { supabase } from '@/integrations/supabase/client';

export const getTotalRegistrations = async () => {
  const { count, error } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true });
  
  if (error) {
    console.error('Error fetching total registrations:', error);
    return 0;
  }
  
  return count || 0;
};

export const getVerifiedAccounts = async () => {
  const { count, error } = await supabase
    .from('registration_requests')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'approved');
  
  if (error) {
    console.error('Error fetching verified accounts:', error);
    return 0;
  }
  
  return count || 0;
};

export const getAverageVerificationTime = async () => {
  const { data, error } = await supabase
    .from('registration_requests')
    .select('created_at, updated_at')
    .eq('status', 'approved')
    .not('updated_at', 'is', null);
  
  if (error || !data || data.length === 0) {
    console.error('Error calculating verification time:', error);
    return 0;
  }
  
  const totalHours = data.reduce((acc, request) => {
    const created = new Date(request.created_at);
    const updated = new Date(request.updated_at);
    const diffHours = (updated.getTime() - created.getTime()) / (1000 * 60 * 60);
    return acc + diffHours;
  }, 0);
  
  return Math.round(totalHours / data.length);
};

export const getRegistrationConversionRate = async () => {
  // Simulamos el total de visitas a la página de registro
  // En producción esto vendría de analytics
  const totalRegistrations = await getTotalRegistrations();
  const estimatedVisits = totalRegistrations * 3; // Asumimos 33% de conversión
  
  return totalRegistrations > 0 ? Math.round((totalRegistrations / estimatedVisits) * 100) : 0;
};
