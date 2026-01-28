import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { analytics } from '@/utils/analytics';

/**
 * Hook to automatically track page views
 * Use this in your main App component or Layout
 */
export const usePageTracking = () => {
  const location = useLocation();

  useEffect(() => {
    // Track page view on route change
    analytics.trackPageView(location.pathname);
  }, [location.pathname]);
};

/**
 * Hook to track timing/performance metrics
 */
export const usePerformanceTracking = (
  category: string,
  variable: string,
  startTime: number
) => {
  useEffect(() => {
    return () => {
      const duration = performance.now() - startTime;
      analytics.trackTiming(category, variable, Math.round(duration));
    };
  }, [category, variable, startTime]);
};
