import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userNotificationService, UserNotification } from '@/services/notifications/userNotifications';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useRef } from 'react';

export const USER_NOTIFICATIONS_QUERY_KEY = 'user-notifications';

export const useUserNotifications = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Main query for user notifications
  const {
    data: notifications = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: [USER_NOTIFICATIONS_QUERY_KEY, user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      return userNotificationService.getUserNotifications(user.id);
    },
    enabled: !!user?.id,
    refetchOnMount: 'always',
    staleTime: 0,
    gcTime: 5 * 60 * 1000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Unread count query
  const {
    data: unreadCount = 0,
    refetch: refetchUnreadCount
  } = useQuery({
    queryKey: [USER_NOTIFICATIONS_QUERY_KEY, 'unread', user?.id],
    queryFn: () => {
      if (!user?.id) return Promise.resolve(0);
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
      queryClient.invalidateQueries({ queryKey: [USER_NOTIFICATIONS_QUERY_KEY, user?.id] });
      queryClient.invalidateQueries({ queryKey: [USER_NOTIFICATIONS_QUERY_KEY, 'unread', user?.id] });
    },
  });

  // Mark all as read mutation
  const markAllAsReadMutation = useMutation({
    mutationFn: () => user ? userNotificationService.markAllAsRead(user.id) : Promise.resolve(false),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [USER_NOTIFICATIONS_QUERY_KEY, user?.id] });
      queryClient.invalidateQueries({ queryKey: [USER_NOTIFICATIONS_QUERY_KEY, 'unread', user?.id] });
    },
  });

  // Delete notification mutation
  const deleteNotificationMutation = useMutation({
    mutationFn: (notificationId: string) => userNotificationService.deleteNotification(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [USER_NOTIFICATIONS_QUERY_KEY, user?.id] });
      queryClient.invalidateQueries({ queryKey: [USER_NOTIFICATIONS_QUERY_KEY, 'unread', user?.id] });
    },
  });

  // Auto-polling for new notifications (every 30 seconds when user is active)
  useEffect(() => {
    if (!user?.id) return;

    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }

    pollingIntervalRef.current = setInterval(() => {
      refetch();
      refetchUnreadCount();
    }, 30000);

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    };
  }, [user?.id, refetch, refetchUnreadCount]);

  // Manual refresh function
  const refreshNotifications = async () => {
    if (!user?.id) return;
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
