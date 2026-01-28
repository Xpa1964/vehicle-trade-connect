
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type DisputeCase = Database['public']['Tables']['dispute_cases']['Row'];

export interface DisputeFilters {
  status?: string;
  priority?: string;
  dispute_type?: string;
  date_from?: string;
  date_to?: string;
  search?: string;
}

export interface DisputeStatistics {
  total: number;
  by_status: Record<string, number>;
  by_priority: Record<string, number>;
  by_type: Record<string, number>;
  average_resolution_time: number;
  satisfaction_rate: number;
}

export class DisputeService {
  /**
   * Obtiene disputas con filtros aplicados
   */
  static async getFilteredDisputes(filters: DisputeFilters): Promise<DisputeCase[]> {
    let query = supabase
      .from('dispute_cases')
      .select('*');

    // Aplicar filtros con casting de tipos
    if (filters.status) {
      query = query.eq('status', filters.status as Database['public']['Enums']['dispute_status']);
    }
    
    if (filters.priority) {
      query = query.eq('priority', filters.priority as Database['public']['Enums']['dispute_priority']);
    }
    
    if (filters.dispute_type) {
      query = query.eq('dispute_type', filters.dispute_type as Database['public']['Enums']['dispute_type']);
    }
    
    if (filters.date_from) {
      query = query.gte('created_at', filters.date_from);
    }
    
    if (filters.date_to) {
      query = query.lte('created_at', filters.date_to);
    }
    
    if (filters.search) {
      query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%,case_number.ilike.%${filters.search}%`);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  /**
   * Obtiene estadísticas de disputas
   */
  static async getDisputeStatistics(): Promise<DisputeStatistics> {
    const { data: disputes, error } = await supabase
      .from('dispute_cases')
      .select('*');

    if (error) throw error;

    const stats: DisputeStatistics = {
      total: disputes.length,
      by_status: {},
      by_priority: {},
      by_type: {},
      average_resolution_time: 0,
      satisfaction_rate: 0,
    };

    // Calcular estadísticas por estado
    disputes.forEach(dispute => {
      stats.by_status[dispute.status] = (stats.by_status[dispute.status] || 0) + 1;
      stats.by_priority[dispute.priority] = (stats.by_priority[dispute.priority] || 0) + 1;
      stats.by_type[dispute.dispute_type] = (stats.by_type[dispute.dispute_type] || 0) + 1;
    });

    // Calcular tiempo promedio de resolución
    const resolvedDisputes = disputes.filter(d => d.status === 'accepted' && d.closed_at);
    if (resolvedDisputes.length > 0) {
      const totalTime = resolvedDisputes.reduce((sum, dispute) => {
        if (dispute.closed_at && dispute.created_at) {
          const resolutionTime = new Date(dispute.closed_at).getTime() - new Date(dispute.created_at).getTime();
          return sum + (resolutionTime / (1000 * 60 * 60 * 24)); // días
        }
        return sum;
      }, 0);
      stats.average_resolution_time = totalTime / resolvedDisputes.length;
    }

    // Calcular tasa de satisfacción
    const ratedDisputes = disputes.filter(d => d.satisfaction_rating !== null);
    if (ratedDisputes.length > 0) {
      const totalRating = ratedDisputes.reduce((sum, dispute) => sum + (dispute.satisfaction_rating || 0), 0);
      stats.satisfaction_rate = (totalRating / ratedDisputes.length / 5) * 100; // porcentaje
    }

    return stats;
  }

  /**
   * Asigna un especialista a una disputa
   */
  static async assignSpecialist(disputeId: string, specialistId: string): Promise<void> {
    const { error } = await supabase
      .from('dispute_cases')
      .update({ 
        specialist_id: specialistId,
        status: 'under_review' as Database['public']['Enums']['dispute_status'],
        updated_at: new Date().toISOString()
      })
      .eq('id', disputeId);

    if (error) throw error;
  }

  /**
   * Escala una disputa al siguiente nivel
   */
  static async escalateDispute(disputeId: string, managerId: string, reason: string): Promise<void> {
    const { error } = await supabase
      .from('dispute_cases')
      .update({
        manager_id: managerId,
        priority: 'high' as Database['public']['Enums']['dispute_priority'],
        updated_at: new Date().toISOString()
      })
      .eq('id', disputeId);

    if (error) throw error;

    // Registrar el motivo de escalación en un mensaje interno
    await supabase
      .from('dispute_messages')
      .insert({
        dispute_id: disputeId,
        content: `Disputa escalada. Motivo: ${reason}`,
        message_type: 'system',
        sender_type: 'system',
        is_internal: true,
        sender_id: managerId
      });
  }

  /**
   * Cierra una disputa con resolución
   */
  static async closeDispute(
    disputeId: string, 
    resolution: string, 
    satisfactionRating?: number
  ): Promise<void> {
    const { error } = await supabase
      .from('dispute_cases')
      .update({
        status: 'accepted' as Database['public']['Enums']['dispute_status'],
        resolution_summary: resolution,
        satisfaction_rating: satisfactionRating,
        closed_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', disputeId);

    if (error) throw error;
  }

  /**
   * Genera un número de caso único
   */
  static async generateCaseNumber(): Promise<string> {
    const { data, error } = await supabase.rpc('generate_case_number');
    
    if (error) throw error;
    return data;
  }

  /**
   * Valida si un usuario puede acceder a una disputa
   */
  static async validateDisputeAccess(disputeId: string, userId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('dispute_cases')
      .select('claimant_id, respondent_id, specialist_id, manager_id')
      .eq('id', disputeId)
      .single();

    if (error || !data) return false;

    return data.claimant_id === userId || 
           data.respondent_id === userId || 
           data.specialist_id === userId || 
           data.manager_id === userId;
  }
}
