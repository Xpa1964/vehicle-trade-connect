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
  // Create a single user notification using system function
  async createUserNotification(data: CreateUserNotificationData): Promise<UserNotification | null> {
    try {
      console.log('[userNotificationService] Creating notification:', data);
      
      // Use system function with notification_history_id parameter
      const { data: result, error } = await supabase.rpc('create_system_notification', {
        p_user_id: data.user_id,
        p_subject: data.subject,
        p_content: data.content,
        p_type: data.type || 'info',
        p_notification_history_id: data.notification_history_id || null
      });
      
      if (error) {
        console.error('[userNotificationService] Error creating notification:', error);
        return null;
      }
      
      console.log('[userNotificationService] Notification created with ID:', result);
      
      // Obtener la notificación creada
      const { data: notification, error: fetchError } = await supabase
        .from('user_notifications')
        .select('*')
        .eq('id', result)
        .single();
      if (fetchError) {
        console.error('[userNotificationService] Error fetching created notification:', fetchError);
        return null;
      }
      
      console.log('[userNotificationService] ✅ Notification created successfully with history_id:', notification.notification_history_id);
      return notification;
    } catch (error) {
      console.error('[userNotificationService] Unexpected error:', error);
      return null;
    }
  },

  // Create notifications for multiple users (for mass notifications)
  async createBulkUserNotifications(notifications: CreateUserNotificationData[]): Promise<boolean> {
    try {
      console.log('[userNotificationService] Creating bulk notifications:', notifications.length);
      
      // Crear notificaciones una por una usando la función de sistema
      const results = await Promise.allSettled(
        notifications.map(notification => this.createUserNotification(notification))
      );
      
      const successful = results.filter(result => 
        result.status === 'fulfilled' && result.value !== null
      ).length;
      
      console.log(`[userNotificationService] Successfully created ${successful}/${notifications.length} notifications`);
      return successful > 0;
    } catch (error) {
      console.error('[userNotificationService] Error creating bulk notifications:', error);
      return false;
    }
  },

  // Get notifications for a specific user
  async getUserNotifications(userId: string, limit: number = 50): Promise<UserNotification[]> {
    console.log('🔍 Getting notifications for user:', userId, 'limit:', limit);
    try {
      const { data: notifications, error } = await supabase
        .from('user_notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('❌ Error fetching user notifications:', error);
        return [];
      }

      console.log('✅ Found', notifications?.length || 0, 'notifications for user', userId);
      return notifications || [];
    } catch (error) {
      console.error('❌ Error fetching user notifications:', error);
      return [];
    }
  },

  // Mark a notification as read
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
        console.error('Error marking notification as read:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return false;
    }
  },

  // Mark all notifications as read for a user
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
        console.error('Error marking all notifications as read:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      return false;
    }
  },

  // Get unread count for a user
  async getUnreadCount(userId: string): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('user_notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('is_read', false);

      if (error) {
        console.error('Error getting unread count:', error);
        return 0;
      }
      
      return count || 0;
    } catch (error) {
      console.error('Error getting unread count:', error);
      return 0;
    }
  },

  // Delete a notification
  async deleteNotification(notificationId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_notifications')
        .delete()
        .eq('id', notificationId);

      if (error) {
        console.error('Error deleting notification:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error deleting notification:', error);
      return false;
    }
  }
};