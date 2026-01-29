import { supabase } from '@/integrations/supabase/client';
import { recipientTrackingService } from './recipientTracking';

export interface NotificationHistory {
  id: string;
  template_id?: string;
  subject: string;
  content: string;
  recipient_count: number;
  sent_count: number;
  failed_count: number;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  type: string;
  created_at: string;
  sent_at?: string;
  created_by?: string;
  template?: {
    name: string;
  };
  has_recipients?: boolean;
  recipient_details?: {
    total: number;
    sent: number;
    failed: number;
    pending: number;
  };
}

export interface CreateNotificationData {
  template_id?: string;
  subject: string;
  content: string;
  recipient_count: number;
  type: string;
  status?: string;
  send_via_email?: boolean;
}

export const notificationHistoryService = {
  async getHistory(): Promise<NotificationHistory[]> {
    console.log('🔍 Fetching notification history from Supabase...');
    try {
      const { data, error } = await (supabase as any)
        .from('notification_history')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error fetching notification history:', error);
        return [];
      }

      console.log('✅ Fetched notification history:', data?.length || 0, 'items');
      return (data || []) as NotificationHistory[];
    } catch (error) {
      console.error('❌ Unexpected error in getHistory:', error);
      return [];
    }
  },

  async getHistoryById(id: string): Promise<NotificationHistory | null> {
    console.log('🔍 Fetching notification by ID from Supabase:', id);
    try {
      const { data, error } = await (supabase as any)
        .from('notification_history')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('❌ Error fetching notification by ID:', error);
        return null;
      }

      console.log('✅ Fetched notification by ID:', data);
      return data as NotificationHistory;
    } catch (error) {
      console.error('❌ Unexpected error in getHistoryById:', error);
      return null;
    }
  },

  async createHistory(notificationData: CreateNotificationData): Promise<NotificationHistory | null> {
    console.log('📝 Creating notification history in Supabase:', notificationData);
    try {
      const { data, error } = await (supabase as any)
        .from('notification_history')
        .insert({
          template_id: notificationData.template_id,
          subject: notificationData.subject,
          content: notificationData.content,
          recipient_count: notificationData.recipient_count,
          type: notificationData.type,
          status: notificationData.status || 'pending',
          sent_count: 0,
          failed_count: 0,
        })
        .select()
        .single();

      if (error) {
        console.error('❌ Error creating notification history:', error);
        return null;
      }

      console.log('✅ Created notification history:', data);
      return data as NotificationHistory;
    } catch (error) {
      console.error('❌ Unexpected error in createHistory:', error);
      return null;
    }
  },

  async updateHistory(id: string, updates: Partial<NotificationHistory>): Promise<NotificationHistory | null> {
    console.log('📝 Updating notification history in Supabase:', id, updates);
    try {
      const { data, error } = await (supabase as any)
        .from('notification_history')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('❌ Error updating notification history:', error);
        return null;
      }

      console.log('✅ Updated notification history:', data);
      return data as NotificationHistory;
    } catch (error) {
      console.error('❌ Unexpected error in updateHistory:', error);
      return null;
    }
  },

  async markAsSent(id: string, sentCount: number, failedCount: number = 0): Promise<boolean> {
    console.log('✅ Marking notification as sent in Supabase:', id, { sentCount, failedCount });
    try {
      const { error } = await (supabase as any)
        .from('notification_history')
        .update({
          status: 'completed',
          sent_count: sentCount,
          failed_count: failedCount,
          sent_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) {
        console.error('❌ Error marking notification as sent:', error);
        return false;
      }

      console.log('✅ Notification marked as sent successfully');
      return true;
    } catch (error) {
      console.error('❌ Unexpected error in markAsSent:', error);
      return false;
    }
  },

  async getStatistics() {
    console.log('📊 Calculating statistics from Supabase...');
    try {
      const { data, error } = await (supabase as any)
        .from('notification_history')
        .select('recipient_count, sent_count, failed_count, status');

      if (error) {
        console.error('❌ Error fetching statistics:', error);
        return { total: 0, sent: 0, failed: 0, pending: 0 };
      }

      const stats = (data || []).reduce((acc: any, item: any) => {
        acc.total += item.recipient_count || 0;
        acc.sent += item.sent_count || 0;
        acc.failed += item.failed_count || 0;
        if (item.status === 'pending' || item.status === 'processing') {
          acc.pending += (item.recipient_count || 0) - (item.sent_count || 0) - (item.failed_count || 0);
        }
        return acc;
      }, { total: 0, sent: 0, failed: 0, pending: 0 });

      console.log('📊 Statistics calculated:', stats);
      return stats;
    } catch (error) {
      console.error('❌ Unexpected error in getStatistics:', error);
      return { total: 0, sent: 0, failed: 0, pending: 0 };
    }
  }
};
