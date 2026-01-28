import { useState, useEffect, useCallback } from 'react';
import { getWebVitalsHistory, WebVitalMetric } from '@/utils/webVitals';

interface WebVitalsState {
  CLS: number | null;
  INP: number | null;
  LCP: number | null;
  TTFB: number | null;
}

interface WebVitalsRatings {
  CLS: 'good' | 'needs-improvement' | 'poor' | 'unknown';
  INP: 'good' | 'needs-improvement' | 'poor' | 'unknown';
  LCP: 'good' | 'needs-improvement' | 'poor' | 'unknown';
  TTFB: 'good' | 'needs-improvement' | 'poor' | 'unknown';
}

interface WebVitalsHistory {
  CLS: WebVitalMetric[];
  INP: WebVitalMetric[];
  LCP: WebVitalMetric[];
  TTFB: WebVitalMetric[];
}

export function useWebVitalsMonitor() {
  const [currentMetrics, setCurrentMetrics] = useState<WebVitalsState>({
    CLS: null,
    INP: null,
    LCP: null,
    TTFB: null,
  });

  const [ratings, setRatings] = useState<WebVitalsRatings>({
    CLS: 'unknown',
    INP: 'unknown',
    LCP: 'unknown',
    TTFB: 'unknown',
  });

  const [history, setHistory] = useState<WebVitalsHistory>({
    CLS: [],
    INP: [],
    LCP: [],
    TTFB: [],
  });

  /**
   * Carga métricas desde localStorage
   */
  const loadMetrics = useCallback(() => {
    const allMetrics = getWebVitalsHistory();
    
    // Agrupar por tipo de métrica (FID removed in web-vitals v4)
    const grouped: WebVitalsHistory = {
      CLS: [],
      INP: [],
      LCP: [],
      TTFB: [],
    };

    allMetrics.forEach(metric => {
      if (metric.name in grouped) {
        grouped[metric.name as keyof WebVitalsHistory].push(metric);
      }
    });

    // Obtener valores más recientes
    const latest: WebVitalsState = {
      CLS: grouped.CLS.length > 0 ? grouped.CLS[grouped.CLS.length - 1].value : null,
      INP: grouped.INP.length > 0 ? grouped.INP[grouped.INP.length - 1].value : null,
      LCP: grouped.LCP.length > 0 ? grouped.LCP[grouped.LCP.length - 1].value : null,
      TTFB: grouped.TTFB.length > 0 ? grouped.TTFB[grouped.TTFB.length - 1].value : null,
    };

    // Obtener ratings más recientes
    const latestRatings: WebVitalsRatings = {
      CLS: grouped.CLS.length > 0 ? grouped.CLS[grouped.CLS.length - 1].rating : 'unknown',
      INP: grouped.INP.length > 0 ? grouped.INP[grouped.INP.length - 1].rating : 'unknown',
      LCP: grouped.LCP.length > 0 ? grouped.LCP[grouped.LCP.length - 1].rating : 'unknown',
      TTFB: grouped.TTFB.length > 0 ? grouped.TTFB[grouped.TTFB.length - 1].rating : 'unknown',
    };

    setCurrentMetrics(latest);
    setRatings(latestRatings);
    setHistory(grouped);
  }, []);

  /**
   * Listener para nuevas métricas en tiempo real
   */
  useEffect(() => {
    const handleWebVital = (event: Event) => {
      const customEvent = event as CustomEvent<WebVitalMetric>;
      const metric = customEvent.detail;

      setCurrentMetrics(prev => ({
        ...prev,
        [metric.name]: metric.value,
      }));

      setRatings(prev => ({
        ...prev,
        [metric.name]: metric.rating,
      }));

      setHistory(prev => ({
        ...prev,
        [metric.name]: [...prev[metric.name as keyof WebVitalsHistory], metric],
      }));
    };

    window.addEventListener('web-vital', handleWebVital);

    // Cargar métricas iniciales
    loadMetrics();

    return () => {
      window.removeEventListener('web-vital', handleWebVital);
    };
  }, [loadMetrics]);

  /**
   * Obtiene el historial de una métrica específica (últimas 20 muestras)
   */
  const getMetricHistory = useCallback((metricName: keyof WebVitalsHistory) => {
    return history[metricName].slice(-20);
  }, [history]);

  /**
   * Formatea el valor de una métrica según su tipo
   */
  const formatMetricValue = useCallback((metricName: string, value: number | null): string => {
    if (value === null) return 'N/A';

    switch (metricName) {
      case 'CLS':
        return value.toFixed(3);
      case 'INP':
        return `${Math.round(value)}ms`;
      case 'LCP':
        return `${(value / 1000).toFixed(2)}s`;
      case 'TTFB':
        return `${Math.round(value)}ms`;
      default:
        return value.toFixed(2);
    }
  }, []);

  return {
    currentMetrics,
    ratings,
    history,
    getMetricHistory,
    formatMetricValue,
    refresh: loadMetrics,
  };
}
