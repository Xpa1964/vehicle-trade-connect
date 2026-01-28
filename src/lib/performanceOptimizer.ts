import { queryClient } from './react-query';

interface OptimizationConfig {
  staleTime?: number;
  gcTime?: number;
  refetchOnWindowFocus?: boolean;
  refetchOnMount?: boolean | 'always';
}

class PerformanceOptimizer {
  private originalConfig: OptimizationConfig | null = null;
  private isOptimized = false;

  applyReactQueryOptimization(level: 'moderate' | 'aggressive' = 'moderate') {
    if (this.isOptimized) {
      console.log('[PerformanceOptimizer] Already optimized');
      return;
    }

    // Store original config
    this.originalConfig = {
      staleTime: queryClient.getDefaultOptions().queries?.staleTime as number,
      gcTime: queryClient.getDefaultOptions().queries?.gcTime as number,
      refetchOnWindowFocus: queryClient.getDefaultOptions().queries?.refetchOnWindowFocus as boolean,
      refetchOnMount: queryClient.getDefaultOptions().queries?.refetchOnMount as boolean | 'always',
    };

    const config: OptimizationConfig = level === 'aggressive' ? {
      staleTime: 60000, // 1 minute
      gcTime: 600000, // 10 minutes
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    } : {
      staleTime: 30000, // 30 seconds
      gcTime: 300000, // 5 minutes
      refetchOnWindowFocus: false,
      refetchOnMount: 'always',
    };

    queryClient.setDefaultOptions({
      queries: {
        ...queryClient.getDefaultOptions().queries,
        ...config,
      },
    });

    this.isOptimized = true;
    console.log('[PerformanceOptimizer] React Query optimization applied:', level);
  }

  rollbackReactQueryOptimization() {
    if (!this.isOptimized || !this.originalConfig) {
      console.log('[PerformanceOptimizer] Nothing to rollback');
      return;
    }

    queryClient.setDefaultOptions({
      queries: {
        ...queryClient.getDefaultOptions().queries,
        ...this.originalConfig,
      },
    });

    this.isOptimized = false;
    this.originalConfig = null;
    console.log('[PerformanceOptimizer] React Query optimization rolled back');
  }

  clearQueryCache() {
    queryClient.clear();
    console.log('[PerformanceOptimizer] Query cache cleared');
  }

  getOptimizationStatus() {
    return {
      isOptimized: this.isOptimized,
      currentConfig: this.isOptimized ? queryClient.getDefaultOptions().queries : null,
    };
  }
}

export const performanceOptimizer = new PerformanceOptimizer();
