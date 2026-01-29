
import { supabase } from '@/integrations/supabase/client';

export interface DisputeCase {
  id: string;
  case_number: string | null;
  complainant_id: string | null;
  defendant_id: string | null;
  vehicle_id: string | null;
  transaction_id: string | null;
  dispute_type: string | null;
  priority: string | null;
  status: string | null;
  title: string | null;
  description: string | null;
  resolution: string | null;
  resolved_at: string | null;
  created_at: string | null;
  updated_at: string | null;
}

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
    let query = (supabase as any)
      .from('dispute_cases')
      .select('*');

    if (filters.status) {
      query = query.eq('status', filters.status);
    }
    
    if (filters.priority) {
      query = query.eq('priority', filters.priority);
    }
    
    if (filters.dispute_type) {
      query = query.eq('dispute_type', filters.dispute_type);
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
    return data || [];
  }

  /**
   * Obtiene estadísticas de disputas
   */
  static async getDisputeStatistics(): Promise<DisputeStatistics> {
    const { data: disputes, error } = await (supabase as any)
      .from('dispute_cases')
      .select('*');

    if (error) throw error;

    const stats: DisputeStatistics = {
      total: (disputes || []).length,
      by_status: {},
      by_priority: {},
      by_type: {},
      average_resolution_time: 0,
      satisfaction_rate: 0,
    };

    (disputes || []).forEach((dispute: any) => {
      if (dispute.status) stats.by_status[dispute.status] = (stats.by_status[dispute.status] || 0) + 1;
      if (dispute.priority) stats.by_priority[dispute.priority] = (stats.by_priority[dispute.priority] || 0) + 1;
      if (dispute.dispute_type) stats.by_type[dispute.dispute_type] = (stats.by_type[dispute.dispute_type] || 0) + 1;
    });

    return stats;
  }

  /**
   * Asigna un especialista a una disputa
   */
  static async assignSpecialist(disputeId: string, specialistId: string): Promise<void> {
    const { error } = await (supabase as any)
      .from('dispute_cases')
      .update({ 
        status: 'in_progress',
        updated_at: new Date().toISOString()
      })
      .eq('id', disputeId);

    if (error) throw error;
  }

  /**
   * Escala una disputa al siguiente nivel
   */
  static async escalateDispute(disputeId: string, managerId: string, reason: string): Promise<void> {
    const { error } = await (supabase as any)
      .from('dispute_cases')
      .update({
        priority: 'high',
        updated_at: new Date().toISOString()
      })
      .eq('id', disputeId);

    if (error) throw error;

    await (supabase as any)
      .from('dispute_messages')
      .insert({
        dispute_id: disputeId,
        content: `Disputa escalada. Motivo: ${reason}`,
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
    const { error } = await (supabase as any)
      .from('dispute_cases')
      .update({
        status: 'closed',
        resolution: resolution,
        resolved_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', disputeId);

    if (error) throw error;
  }

  /**
   * Genera un número de caso único
   */
  static async generateCaseNumber(): Promise<string> {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `CASE-${timestamp}-${random}`;
  }

  /**
   * Valida si un usuario puede acceder a una disputa
   */
  static async validateDisputeAccess(disputeId: string, userId: string): Promise<boolean> {
    const { data, error } = await (supabase as any)
      .from('dispute_cases')
      .select('complainant_id, defendant_id')
      .eq('id', disputeId)
      .single();

    if (error || !data) return false;

    return data.complainant_id === userId || data.defendant_id === userId;
  }
}
