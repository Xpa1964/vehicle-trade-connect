// DISABLED - feature pendiente de activación
import { supabase } from '@/integrations/supabase/client';

export interface DisputeNotification {
  recipient_id: string;
  dispute_id: string;
  title: string;
  message: string;
  type: 'new_dispute' | 'status_change' | 'new_message' | 'assignment' | 'escalation' | 'resolution';
  priority: 'low' | 'medium' | 'high';
}

export class DisputeNotificationService {
  /**
   * Envía una notificación relacionada con una disputa
   */
  static async sendNotification(notification: DisputeNotification): Promise<void> {
    try {
      // Aquí se podría integrar con un servicio de notificaciones externo
      // Por ahora, registramos la notificación en la base de datos
      
      const { error } = await supabase
        .from('dispute_messages')
        .insert({
          dispute_id: notification.dispute_id,
          content: `${notification.title}: ${notification.message}`,
          message_type: 'notification',
          sender_type: 'system',
          is_internal: true,
          sender_id: notification.recipient_id // Usar el recipient como sender para notificaciones del sistema
        });

      if (error) throw error;

      console.log('Notificación enviada:', notification);
    } catch (error) {
      console.error('Error enviando notificación:', error);
    }
  }

  /**
   * Notifica sobre una nueva disputa
   */
  static async notifyNewDispute(disputeId: string, respondentId: string, title: string): Promise<void> {
    await this.sendNotification({
      recipient_id: respondentId,
      dispute_id: disputeId,
      title: 'Nueva Disputa Recibida',
      message: `Se ha creado una nueva disputa: "${title}". Por favor, revisa los detalles y responde.`,
      type: 'new_dispute',
      priority: 'high'
    });
  }

  /**
   * Notifica sobre cambio de estado
   */
  static async notifyStatusChange(
    disputeId: string, 
    recipientId: string, 
    newStatus: string, 
    previousStatus: string
  ): Promise<void> {
    await this.sendNotification({
      recipient_id: recipientId,
      dispute_id: disputeId,
      title: 'Cambio de Estado de Disputa',
      message: `El estado de tu disputa ha cambiado de "${previousStatus}" a "${newStatus}".`,
      type: 'status_change',
      priority: 'medium'
    });
  }

  /**
   * Notifica sobre nuevo mensaje
   */
  static async notifyNewMessage(
    disputeId: string, 
    recipientId: string, 
    senderName: string
  ): Promise<void> {
    await this.sendNotification({
      recipient_id: recipientId,
      dispute_id: disputeId,
      title: 'Nuevo Mensaje en Disputa',
      message: `${senderName} ha enviado un nuevo mensaje en tu disputa.`,
      type: 'new_message',
      priority: 'medium'
    });
  }

  /**
   * Notifica sobre asignación de especialista
   */
  static async notifySpecialistAssignment(
    disputeId: string, 
    claimantId: string, 
    respondentId: string, 
    specialistName: string
  ): Promise<void> {
    const notification = {
      dispute_id: disputeId,
      title: 'Especialista Asignado',
      message: `Se ha asignado a ${specialistName} como especialista en mediación para tu disputa.`,
      type: 'assignment' as const,
      priority: 'medium' as const
    };

    await this.sendNotification({ ...notification, recipient_id: claimantId });
    await this.sendNotification({ ...notification, recipient_id: respondentId });
  }

  /**
   * Notifica sobre escalación de disputa
   */
  static async notifyEscalation(
    disputeId: string, 
    recipientId: string, 
    reason: string
  ): Promise<void> {
    await this.sendNotification({
      recipient_id: recipientId,
      dispute_id: disputeId,
      title: 'Disputa Escalada',
      message: `Tu disputa ha sido escalada al siguiente nivel. Motivo: ${reason}`,
      type: 'escalation',
      priority: 'high'
    });
  }

  /**
   * Notifica sobre resolución de disputa
   */
  static async notifyResolution(
    disputeId: string, 
    claimantId: string, 
    respondentId: string, 
    resolution: string
  ): Promise<void> {
    const notification = {
      dispute_id: disputeId,
      title: 'Disputa Resuelta',
      message: `Tu disputa ha sido resuelta. Resolución: ${resolution}`,
      type: 'resolution' as const,
      priority: 'high' as const
    };

    await this.sendNotification({ ...notification, recipient_id: claimantId });
    await this.sendNotification({ ...notification, recipient_id: respondentId });
  }
}
