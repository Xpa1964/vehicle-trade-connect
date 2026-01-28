import { supabase } from '@/integrations/supabase/client';

export interface NotificationRecipient {
  id: string;
  notification_history_id: string;
  user_id: string;
  email: string;
  name: string;
  status: 'sent' | 'failed' | 'pending';
  sent_at?: string;
  error_message?: string;
  // User profile data
  user_profile?: {
    full_name?: string;
    company?: string;
    country?: string;
    is_active?: boolean;
  };
}

export interface RecipientStats {
  total: number;
  sent: number;
  failed: number;
  pending: number;
}

// Mock recipients data for development
const mockRecipients: NotificationRecipient[] = [
  // Recipients for notification '1' - Bienvenidos nuevos usuarios (43 sent, 2 failed)
  {
    id: '1',
    notification_history_id: '1',
    user_id: 'user1',
    email: 'carlos.mendez@empresa.com',
    name: 'Carlos Mendez',
    status: 'sent',
    sent_at: '2024-01-18T09:05:23Z',
    user_profile: {
      full_name: 'Carlos Mendez',
      company: 'Automotive Solutions',
      country: 'España',
      is_active: true
    }
  },
  {
    id: '2',
    notification_history_id: '1',
    user_id: 'user2',
    email: 'maria.garcia@motors.com',
    name: 'María García',
    status: 'sent',
    sent_at: '2024-01-18T09:05:25Z',
    user_profile: {
      full_name: 'María García',
      company: 'Motors García',
      country: 'México',
      is_active: true
    }
  },
  {
    id: '3',
    notification_history_id: '1',
    user_id: 'user3',
    email: 'jose.invalid@domain.com',
    name: 'José Rodríguez',
    status: 'failed',
    error_message: 'Invalid email address',
    user_profile: {
      full_name: 'José Rodríguez',
      company: 'Auto Parts Inc',
      country: 'Colombia',
      is_active: false
    }
  },
  
  // Recipients for notification '2' - Actualización de sistema programada (118 sent, 2 failed)
  {
    id: '4',
    notification_history_id: '2',
    user_id: 'user4',
    email: 'ana.lopez@techcorp.com',
    name: 'Ana López',
    status: 'sent',
    sent_at: '2024-01-15T14:35:12Z',
    user_profile: {
      full_name: 'Ana López',
      company: 'TechCorp Solutions',
      country: 'Argentina',
      is_active: true
    }
  },
  {
    id: '5',
    notification_history_id: '2',
    user_id: 'user5',
    email: 'roberto.santos@industriamx.com',
    name: 'Roberto Santos',
    status: 'sent',
    sent_at: '2024-01-15T14:35:15Z',
    user_profile: {
      full_name: 'Roberto Santos',
      company: 'Industria MX',
      country: 'México',
      is_active: true
    }
  },
  {
    id: '6',
    notification_history_id: '2',
    user_id: 'user6',
    email: 'elena.martinez@autoparts.es',
    name: 'Elena Martínez',
    status: 'sent',
    sent_at: '2024-01-15T14:35:18Z',
    user_profile: {
      full_name: 'Elena Martínez',
      company: 'AutoParts España',
      country: 'España',
      is_active: true
    }
  },
  {
    id: '7',
    notification_history_id: '2',
    user_id: 'user7',
    email: 'invalid@bounced.com',
    name: 'Pedro Ruiz',
    status: 'failed',
    error_message: 'Email bounced',
    user_profile: {
      full_name: 'Pedro Ruiz',
      company: 'Distribuciones PR',
      country: 'Colombia',
      is_active: true
    }
  },
  {
    id: '8',
    notification_history_id: '2',
    user_id: 'user8',
    email: 'server.error@timeout.com',
    name: 'Sofia Herrera',
    status: 'failed',
    error_message: 'Server timeout',
    user_profile: {
      full_name: 'Sofia Herrera',
      company: 'Automotive Chile',
      country: 'Chile',
      is_active: false
    }
  },
  {
    id: '9',
    notification_history_id: '2',
    user_id: 'user9',
    email: 'juan.perez@motoresperu.com',
    name: 'Juan Pérez',
    status: 'sent',
    sent_at: '2024-01-15T14:35:25Z',
    user_profile: {
      full_name: 'Juan Pérez',
      company: 'Motores Perú',
      country: 'Perú',
      is_active: true
    }
  }
];

export const recipientTrackingService = {
  // Get recipients for a specific notification
  async getNotificationRecipients(historyId: string): Promise<NotificationRecipient[]> {
    try {
      // TODO: Replace with Supabase query once tables are created
      /*
      const { data, error } = await supabase
        .from('notification_recipients')
        .select(`
          *,
          user_profiles:user_id (
            full_name,
            company,
            country,
            is_active
          )
        `)
        .eq('notification_history_id', historyId)
        .order('sent_at', { ascending: false });

      if (error) throw error;
      
      return data?.map(recipient => ({
        ...recipient,
        user_profile: recipient.user_profiles
      })) || [];
      */
      
      // Return mock data filtered by notification history ID
      return mockRecipients.filter(r => r.notification_history_id === historyId);
    } catch (error) {
      console.error('Error fetching notification recipients:', error);
      return [];
    }
  },

  // Get recipient statistics for a notification
  async getRecipientStats(historyId: string): Promise<RecipientStats> {
    const recipients = await this.getNotificationRecipients(historyId);
    
    return recipients.reduce((stats, recipient) => {
      stats.total++;
      switch (recipient.status) {
        case 'sent':
          stats.sent++;
          break;
        case 'failed':
          stats.failed++;
          break;
        case 'pending':
          stats.pending++;
          break;
      }
      return stats;
    }, { total: 0, sent: 0, failed: 0, pending: 0 });
  },

  // Create recipient records when sending notification
  async createRecipients(historyId: string, recipients: Array<{
    user_id: string;
    email: string;
    name: string;
  }>): Promise<boolean> {
    try {
      // TODO: Replace with Supabase insert once tables are created
      /*
      const recipientRecords = recipients.map(recipient => ({
        notification_history_id: historyId,
        user_id: recipient.user_id,
        email: recipient.email,
        name: recipient.name,
        status: 'pending' as const
      }));

      const { error } = await supabase
        .from('notification_recipients')
        .insert(recipientRecords);

      if (error) throw error;
      */
      
      // Mock implementation
      const newRecipients = recipients.map((recipient, index) => ({
        id: `${historyId}_${index}`,
        notification_history_id: historyId,
        ...recipient,
        status: 'pending' as const
      }));
      
      mockRecipients.push(...newRecipients);
      return true;
    } catch (error) {
      console.error('Error creating recipient records:', error);
      return false;
    }
  },

  // Update recipient status after sending
  async updateRecipientStatus(
    recipientId: string, 
    status: 'sent' | 'failed', 
    errorMessage?: string
  ): Promise<boolean> {
    try {
      // TODO: Replace with Supabase update once tables are created
      /*
      const updateData: any = { 
        status,
        sent_at: status === 'sent' ? new Date().toISOString() : null
      };
      
      if (status === 'failed' && errorMessage) {
        updateData.error_message = errorMessage;
      }

      const { error } = await supabase
        .from('notification_recipients')
        .update(updateData)
        .eq('id', recipientId);

      if (error) throw error;
      */
      
      // Mock implementation
      const index = mockRecipients.findIndex(r => r.id === recipientId);
      if (index >= 0) {
        mockRecipients[index] = {
          ...mockRecipients[index],
          status,
          sent_at: status === 'sent' ? new Date().toISOString() : undefined,
          error_message: status === 'failed' ? errorMessage : undefined
        };
      }
      
      return true;
    } catch (error) {
      console.error('Error updating recipient status:', error);
      return false;
    }
  }
};