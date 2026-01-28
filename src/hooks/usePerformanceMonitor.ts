import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export interface PerformanceMetrics {
  activeUsers: number;
  activeQueries: number;
  realtimeChannels: number;
  averageResponseTime: number;
  dbQueriesPerMinute: number;
  memoryUsage: number;
  cpuUsage: number;
  errorCount: number;
  timestamp: string;
}

export interface PerformanceAlert {
  id: string;
  alertType: 'yellow' | 'red' | 'critical';
  thresholdValue: number;
  currentValue: number;
  message: string;
  isActive: boolean;
  createdAt: string;
}

export const usePerformanceMonitor = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    activeUsers: 0,
    activeQueries: 0,
    realtimeChannels: 0,
    averageResponseTime: 0,
    dbQueriesPerMinute: 0,
    memoryUsage: 0,
    cpuUsage: 0,
    errorCount: 0,
    timestamp: new Date().toISOString()
  });

  const [alerts, setAlerts] = useState<PerformanceAlert[]>([]);
  const [isCollecting, setIsCollecting] = useState(false);
  const queryClient = useQueryClient();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const activeUsersRef = useRef(new Set<string>());
  const metricsBuffer = useRef<PerformanceMetrics[]>([]);

  // Real-time metrics collection
  const collectMetrics = useCallback(async () => {
    try {
      const startTime = performance.now();
      
      // Count active queries from React Query
      const queryCache = queryClient.getQueryCache();
      const activeQueries = queryCache.getAll().filter(query => 
        query.state.fetchStatus === 'fetching'
      ).length;

      // Estimate active users (simplified - in real app would track sessions)
      const currentUser = supabase.auth.getUser();
      if (currentUser) {
        activeUsersRef.current.add(await currentUser.then(u => u.data.user?.id || ''));
      }

      // Count realtime channels (estimate from current connections)
      const realtimeChannels = supabase.getChannels().length;

      // Calculate response time
      const responseTime = performance.now() - startTime;

      // Get memory usage (if available)
      const memoryUsage = (performance as any).memory?.usedJSHeapSize || 0;

      const newMetrics: PerformanceMetrics = {
        activeUsers: activeUsersRef.current.size,
        activeQueries,
        realtimeChannels,
        averageResponseTime: responseTime,
        dbQueriesPerMinute: 0, // Will be calculated server-side
        memoryUsage: memoryUsage / 1024 / 1024, // Convert to MB
        cpuUsage: 0, // Placeholder for now
        errorCount: 0, // Track errors globally
        timestamp: new Date().toISOString()
      };

      setMetrics(newMetrics);
      metricsBuffer.current.push(newMetrics);

      // Send metrics to server every 30 seconds (batch)
      if (metricsBuffer.current.length >= 6) { // 6 * 5 seconds = 30 seconds
        await sendMetricsToServer(metricsBuffer.current);
        metricsBuffer.current = [];
      }

      // Check for alerts
      checkAlerts(newMetrics);
    } catch (error) {
      console.error('[PerformanceMonitor] Error collecting metrics:', error);
    }
  }, [queryClient]);

  // Send metrics to server
  const sendMetricsToServer = async (metricsBatch: PerformanceMetrics[]) => {
    try {
      // Transform camelCase to snake_case for database
      const transformedMetrics = metricsBatch.map(metrics => ({
        active_users: metrics.activeUsers,
        active_queries: metrics.activeQueries,
        realtime_channels: metrics.realtimeChannels,
        average_response_time: metrics.averageResponseTime,
        db_queries_per_minute: metrics.dbQueriesPerMinute,
        memory_usage: metrics.memoryUsage,
        cpu_usage: metrics.cpuUsage,
        error_count: metrics.errorCount,
        timestamp: new Date(metrics.timestamp).toISOString()
      }));
      
      const { error } = await supabase.functions.invoke('performance-collector', {
        body: { metrics: transformedMetrics }
      });
      
      if (error) {
        console.error('[PerformanceMonitor] Error sending metrics:', error);
      }
    } catch (error) {
      console.error('[PerformanceMonitor] Error invoking function:', error);
    }
  };

  // Check for performance alerts
  const checkAlerts = (currentMetrics: PerformanceMetrics) => {
    const newAlerts: PerformanceAlert[] = [];

    // Yellow alert: 25+ active users
    if (currentMetrics.activeUsers >= 25) {
      newAlerts.push({
        id: 'yellow-users',
        alertType: 'yellow',
        thresholdValue: 25,
        currentValue: currentMetrics.activeUsers,
        message: `Approaching user limit: ${currentMetrics.activeUsers} active users`,
        isActive: true,
        createdAt: new Date().toISOString()
      });
    }

    // Red alert: 50+ active users
    if (currentMetrics.activeUsers >= 50) {
      newAlerts.push({
        id: 'red-users',
        alertType: 'red',
        thresholdValue: 50,
        currentValue: currentMetrics.activeUsers,
        message: `High user load: ${currentMetrics.activeUsers} active users - consider optimizations`,
        isActive: true,
        createdAt: new Date().toISOString()
      });
    }

    // Critical alert: 100+ active users
    if (currentMetrics.activeUsers >= 100) {
      newAlerts.push({
        id: 'critical-users',
        alertType: 'critical',
        thresholdValue: 100,
        currentValue: currentMetrics.activeUsers,
        message: `CRITICAL: ${currentMetrics.activeUsers} active users - emergency optimizations needed`,
        isActive: true,
        createdAt: new Date().toISOString()
      });
    }

    // Memory usage alerts
    if (currentMetrics.memoryUsage > 500) { // 500MB
      newAlerts.push({
        id: 'memory-high',
        alertType: currentMetrics.memoryUsage > 1000 ? 'critical' : 'red',
        thresholdValue: 500,
        currentValue: currentMetrics.memoryUsage,
        message: `High memory usage: ${currentMetrics.memoryUsage.toFixed(1)}MB`,
        isActive: true,
        createdAt: new Date().toISOString()
      });
    }

    setAlerts(newAlerts);
  };

  // Start monitoring
  const startMonitoring = useCallback(() => {
    if (intervalRef.current) {
      console.log('[PerformanceMonitor] Already monitoring, skipping...');
      return;
    }
    
    setIsCollecting(true);
    intervalRef.current = setInterval(collectMetrics, 10000); // Every 10 seconds (reduced)
    collectMetrics(); // Initial collection
    
    console.log('[PerformanceMonitor] Started monitoring');
  }, [collectMetrics]);

  // Stop monitoring
  const stopMonitoring = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsCollecting(false);
    
    // Send remaining metrics
    if (metricsBuffer.current.length > 0) {
      sendMetricsToServer(metricsBuffer.current).catch(err =>
        console.error('[PerformanceMonitor] Error sending final metrics:', err)
      );
      metricsBuffer.current = [];
    }
    
    console.log('[PerformanceMonitor] Stopped monitoring');
  }, []);

  // Fetch historical metrics
  const { data: historicalMetrics, isLoading: isLoadingHistory } = useQuery({
    queryKey: ['performance-metrics-history'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('performance_metrics')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(100);

      if (error) throw error;
      return data;
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Fetch active alerts
  const { data: activeAlerts, isLoading: isLoadingAlerts } = useQuery({
    queryKey: ['performance-alerts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('performance_alerts')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    refetchInterval: 10000, // Refetch every 10 seconds
  });

  // Singleton monitoring - only one instance active
  useEffect(() => {
    let mounted = true;
    
    const initMonitoring = async () => {
      if (mounted) {
        startMonitoring();
      }
    };
    
    initMonitoring();
    
    return () => {
      mounted = false;
      stopMonitoring();
    };
  }, []); // Empty deps to run once

  // Clear old active users periodically
  useEffect(() => {
    const clearUsersInterval = setInterval(() => {
      activeUsersRef.current.clear();
    }, 300000); // Clear every 5 minutes

    return () => clearInterval(clearUsersInterval);
  }, []);

  return {
    // Current metrics
    metrics,
    alerts,
    
    // Historical data
    historicalMetrics,
    activeAlerts,
    
    // Loading states
    isCollecting,
    isLoadingHistory,
    isLoadingAlerts,
    
    // Controls
    startMonitoring,
    stopMonitoring,
    
    // Utilities
    sendMetricsToServer: () => {
      if (metricsBuffer.current.length > 0) {
        sendMetricsToServer(metricsBuffer.current);
        metricsBuffer.current = [];
      }
    }
  };
};