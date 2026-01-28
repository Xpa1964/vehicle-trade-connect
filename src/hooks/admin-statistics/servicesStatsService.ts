
import { supabase } from '@/integrations/supabase/client';

export const getTotalTransportRequests = async () => {
  // En el futuro cuando implementemos el módulo de transporte
  const { data, error } = await supabase
    .from('activity_logs')
    .select('*', { count: 'exact', head: true })
    .eq('action_type', 'transport_request');
  
  if (error) {
    console.error('Error fetching transport requests:', error);
    return 0;
  }
  
  return 0; // Por ahora
};

export const getTotalVehicleReportsRequested = async () => {
  const { data, error } = await supabase
    .from('activity_logs')
    .select('*', { count: 'exact', head: true })
    .eq('action_type', 'vehicle_report_request');
  
  if (error) {
    console.error('Error fetching vehicle reports:', error);
    return 0;
  }
  
  return 0; // Por ahora
};

export const getImportCalculatorUses = async () => {
  const { count, error } = await supabase
    .from('activity_logs')
    .select('*', { count: 'exact', head: true })
    .eq('action_type', 'import_calculator_use');
  
  if (error) {
    console.error('Error fetching calculator uses:', error);
    return 0;
  }
  
  return count || 0;
};

export const getTotalPartnerContacts = async () => {
  const { count, error } = await supabase
    .from('activity_logs')
    .select('*', { count: 'exact', head: true })
    .eq('action_type', 'partner_contact');
  
  if (error) {
    console.error('Error fetching partner contacts:', error);
    return 0;
  }
  
  return count || 0;
};

export const getServiceConversionRate = async () => {
  // Simulado por ahora - en producción vendría de tracking real
  return 65; // 65% de conversión de servicios
};
