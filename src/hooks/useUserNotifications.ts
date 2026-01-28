import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userNotificationService, UserNotification } from '@/services/notifications/userNotifications';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useRef } from 'react';

export const USER_NOTIFICATIONS_QUERY_KEY = 'user-notifications';

export const useUserNotifications = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Add detailed debugging for notifications
  useEffect(() => {
    console.log('🎯 [DEBUG NOTIFICATIONS] useUserNotifications state:', {
      hasUser: !!user,
      userId: user?.id,
      userEmail: user?.email,
      userRole: user?.role
    });
  }, [user]);

  // Main query for user notifications
  const {
    data: notifications = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: [USER_NOTIFICATIONS_QUERY_KEY, user?.id],
    queryFn: async () => {
      if (!user?.id) {
        console.log('🚫 [DEBUG NOTIFICATIONS] No user ID available for notifications');
        console.log('🚫 [DEBUG NOTIFICATIONS] User object:', user);
        return [];
      }
      console.log('🔍 [DEBUG NOTIFICATIONS] Fetching notifications for user:', user.id);
      const notifications = await userNotificationService.getUserNotifications(user.id);
      console.log('✅ [DEBUG NOTIFICATIONS] Fetched notifications:', notifications.length, 'items');
      return notifications;
    },
    enabled: !!user?.id,
    refetchOnMount: 'always',
    staleTime: 0, // Always fresh data
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: 3, // Add retry mechanism
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Unread count query
  const {
    data: unreadCount = 0,
    refetch: refetchUnreadCount
  } = useQuery({
    queryKey: [USER_NOTIFICATIONS_QUERY_KEY, 'unread', user?.id],
    queryFn: () => {
      if (!user?.id) {
        console.log('🚫 [DEBUG NOTIFICATIONS] No user ID for unread count');
        return Promise.resolve(0);
      }
      console.log('🔍 [DEBUG NOTIFICATIONS] Fetching unread count for user:', user.id);
      return userNotificationService.getUnreadCount(user.id);
    },
    enabled: !!user?.id,
    staleTime: 0,
    retry: 3,
  });

  // Mark as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: (notificationId: string) => userNotificationService.markAsRead(notificationId),
    onSuccess: () => {
      // Invalidate and refetch both notifications and unread count
      queryClient.invalidateQueries({ queryKey: [USER_NOTIFICATIONS_QUERY_KEY, user?.id] });
      queryClient.invalidateQueries({ queryKey: [USER_NOTIFICATIONS_QUERY_KEY, 'unread', user?.id] });
    },
  });

  // Mark all as read mutation
  const markAllAsReadMutation = useMutation({
    mutationFn: () => user ? userNotificationService.markAllAsRead(user.id) : Promise.resolve(false),
    onSuccess: () => {
      // Invalidate and refetch both notifications and unread count
      queryClient.invalidateQueries({ queryKey: [USER_NOTIFICATIONS_QUERY_KEY, user?.id] });
      queryClient.invalidateQueries({ queryKey: [USER_NOTIFICATIONS_QUERY_KEY, 'unread', user?.id] });
    },
  });

  // Delete notification mutation
  const deleteNotificationMutation = useMutation({
    mutationFn: (notificationId: string) => userNotificationService.deleteNotification(notificationId),
    onSuccess: () => {
      // Invalidate and refetch both notifications and unread count
      queryClient.invalidateQueries({ queryKey: [USER_NOTIFICATIONS_QUERY_KEY, user?.id] });
      queryClient.invalidateQueries({ queryKey: [USER_NOTIFICATIONS_QUERY_KEY, 'unread', user?.id] });
    },
  });

  // Auto-polling for new notifications (every 30 seconds when user is active)
  useEffect(() => {
    if (!user?.id) {
      console.log('🚫 [DEBUG NOTIFICATIONS] Polling stopped - no user ID');
      return;
    }

    console.log('🎯 [DEBUG NOTIFICATIONS] Starting polling for user:', user.id);

    // Clear existing interval
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }

    // Start polling for new notifications
    pollingIntervalRef.current = setInterval(() => {
      console.log('🔄 [DEBUG NOTIFICATIONS] Polling for new notifications for user:', user.id);
      refetch();
      refetchUnreadCount();
    }, 30000); // Poll every 30 seconds

    // Cleanup on unmount or when dependencies change
    return () => {
      if (pollingIntervalRef.current) {
        console.log('🛑 [DEBUG NOTIFICATIONS] Cleaning up polling interval');
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    };
  }, [user?.id, refetch, refetchUnreadCount]);

  // Manual refresh function
  const refreshNotifications = async () => {
    if (!user?.id) {
      console.log('🚫 [DEBUG NOTIFICATIONS] Cannot refresh - no user ID');
      return;
    }
    console.log('🔄 [DEBUG NOTIFICATIONS] Manual refresh triggered for user:', user.id);
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: [USER_NOTIFICATIONS_QUERY_KEY, user?.id] }),
      refetch(),
      refetchUnreadCount()
    ]);
  };

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    refreshNotifications,
    markAsRead: markAsReadMutation.mutateAsync,
    markAllAsRead: markAllAsReadMutation.mutateAsync,
    deleteNotification: deleteNotificationMutation.mutateAsync,
    isMarkingAsRead: markAsReadMutation.isPending,
    isMarkingAllAsRead: markAllAsReadMutation.isPending,
    isDeleting: deleteNotificationMutation.isPending,
  };
};