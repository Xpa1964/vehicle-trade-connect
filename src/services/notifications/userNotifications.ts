import { supabase } from '@/integrations/supabase/client';

export interface UserNotification {
  id: string;
  user_id: string;
  notification_history_id?: string;
  subject: string;
  content: string;
  type: string;
  is_read: boolean;
  created_at: string;
  read_at?: string;
}

export interface CreateUserNotificationData {
  user_id: string;
  notification_history_id?: string;
  subject: string;
  content: string;
  type: string;
}

export const userNotificationService = {
  async createUserNotification(data: CreateUserNotificationData): Promise<UserNotification | null> {
    try {
      const { data: result, error } = await supabase.rpc('create_system_notification', {
        p_user_id: data.user_id,
        p_title: data.subject,
        p_subject: data.subject,
        p_content: data.content,
        p_type: data.type || 'info'
      });
      
      if (error) {
        console.error('[userNotificationService] Error creating notification:', error);
        return null;
      }
      
      const { data: notification, error: fetchError } = await supabase
        .from('user_notifications')
        .select('*')
        .eq('id', result)
        .single();

      if (fetchError) {
        console.error('[userNotificationService] Error fetching created notification:', fetchError);
        return null;
      }
      
      return notification as UserNotification;
    } catch (error) {
      console.error('[userNotificationService] Unexpected error:', error);
      return null;
    }
  },

  async createBulkUserNotifications(notifications: CreateUserNotificationData[]): Promise<boolean> {
    try {
      const results = await Promise.allSettled(
        notifications.map(notification => this.createUserNotification(notification))
      );
      
      const successful = results.filter(result => 
        result.status === 'fulfilled' && result.value !== null
      ).length;
      
      return successful > 0;
    } catch (error) {
      console.error('[userNotificationService] Error creating bulk notifications:', error);
      return false;
    }
  },

  async getUserNotifications(userId: string, limit: number = 50): Promise<UserNotification[]> {
    try {
      const { data: notifications, error } = await supabase
        .from('user_notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('[userNotificationService] Error fetching notifications:', error);
        return [];
      }

      return notifications || [];
    } catch (error) {
      console.error('[userNotificationService] Error fetching notifications:', error);
      return [];
    }
  },

  async markAsRead(notificationId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_notifications')
        .update({ 
          is_read: true, 
          read_at: new Date().toISOString() 
        })
        .eq('id', notificationId);

      if (error) {
        console.error('[userNotificationService] Error marking as read:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('[userNotificationService] Error marking as read:', error);
      return false;
    }
  },

  async markAllAsRead(userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_notifications')
        .update({ 
          is_read: true, 
          read_at: new Date().toISOString() 
        })
        .eq('user_id', userId)
        .eq('is_read', false);

      if (error) {
        console.error('[userNotificationService] Error marking all as read:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('[userNotificationService] Error marking all as read:', error);
      return false;
    }
  },

  async getUnreadCount(userId: string): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('user_notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('is_read', false);

      if (error) {
        console.error('[userNotificationService] Error getting unread count:', error);
        return 0;
      }
      
      return count || 0;
    } catch (error) {
      console.error('[userNotificationService] Error getting unread count:', error);
      return 0;
    }
  },

  async deleteNotification(notificationId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_notifications')
        .delete()
        .eq('id', notificationId);

      if (error) {
        console.error('[userNotificationService] Error deleting notification:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('[userNotificationService] Error deleting notification:', error);
      return false;
    }
  }
};
