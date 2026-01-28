import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationHistoryService, NotificationHistory, CreateNotificationData } from '@/services/notifications/notificationHistory';
import { useEffect, useRef } from 'react';

export const NOTIFICATION_HISTORY_QUERY_KEY = 'notification-history';

export const useNotificationHistory = () => {
  const queryClient = useQueryClient();
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Main query for notification history
  const {
    data: history = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: [NOTIFICATION_HISTORY_QUERY_KEY],
    queryFn: () => notificationHistoryService.getHistory(),
    refetchOnMount: 'always',
    staleTime: 0, // Always fresh data
    gcTime: 5 * 60 * 1000, // 5 minutes
  });

  // Statistics query
  const {
    data: statistics = { total: 0, sent: 0, failed: 0, pending: 0 },
    refetch: refetchStats
  } = useQuery({
    queryKey: [NOTIFICATION_HISTORY_QUERY_KEY, 'stats'],
    queryFn: () => notificationHistoryService.getStatistics(),
    staleTime: 0,
  });

  // Create notification mutation
  const createNotificationMutation = useMutation({
    mutationFn: (data: CreateNotificationData) => notificationHistoryService.createHistory(data),
    onSuccess: () => {
      // Invalidate and refetch immediately
      queryClient.invalidateQueries({ queryKey: [NOTIFICATION_HISTORY_QUERY_KEY] });
    },
  });

  // Update notification mutation
  const updateNotificationMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<NotificationHistory> }) =>
      notificationHistoryService.updateHistory(id, updates),
    onSuccess: () => {
      // Invalidate and refetch immediately
      queryClient.invalidateQueries({ queryKey: [NOTIFICATION_HISTORY_QUERY_KEY] });
    },
  });

  // Mark as sent mutation
  const markAsSentMutation = useMutation({
    mutationFn: ({ id, sentCount, failedCount }: { id: string; sentCount: number; failedCount?: number }) =>
      notificationHistoryService.markAsSent(id, sentCount, failedCount),
    onSuccess: () => {
      // Invalidate and refetch immediately
      queryClient.invalidateQueries({ queryKey: [NOTIFICATION_HISTORY_QUERY_KEY] });
    },
  });

  // Smart polling logic - only poll when there are pending/processing notifications
  useEffect(() => {
    const hasPendingNotifications = history.some(
      item => item.status === 'pending' || item.status === 'processing'
    );

    // Clear existing interval
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }

    // Start polling if there are pending notifications
    if (hasPendingNotifications) {
      console.log('Starting intelligent polling for pending notifications');
      pollingIntervalRef.current = setInterval(() => {
        console.log('Polling for notification updates...');
        refetch();
        refetchStats();
      }, 2000); // Poll every 2 seconds
    } else {
      console.log('No pending notifications, stopping polling');
    }

    // Cleanup on unmount or when dependencies change
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    };
  }, [history, refetch, refetchStats]);

  // Manual refresh function
  const refreshHistory = async () => {
    console.log('Manual refresh triggered');
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: [NOTIFICATION_HISTORY_QUERY_KEY] }),
      refetch(),
      refetchStats()
    ]);
  };

  return {
    history,
    statistics,
    isLoading,
    error,
    refreshHistory,
    createNotification: createNotificationMutation.mutateAsync,
    updateNotification: updateNotificationMutation.mutateAsync,
    markAsSent: markAsSentMutation.mutateAsync,
    isCreating: createNotificationMutation.isPending,
    isUpdating: updateNotificationMutation.isPending,
    isMarkingAsSent: markAsSentMutation.isPending,
  };
};