import { onCLS, onLCP, onINP, onTTFB, Metric } from 'web-vitals';

/**
 * Core Web Vitals Reporter
 * Captura y reporta métricas de rendimiento en tiempo real
 * Compatible con Google Analytics 4 y almacenamiento local
 */

export interface WebVitalMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  timestamp: number;
}

// Thresholds según Google Web Vitals (FID deprecated, replaced by INP)
const THRESHOLDS = {
  CLS: { good: 0.1, poor: 0.25 },
  INP: { good: 200, poor: 500 },
  LCP: { good: 2500, poor: 4000 },
  TTFB: { good: 800, poor: 1800 },
};

// Storage key para historial local
const STORAGE_KEY = 'kontact_web_vitals_history';
const MAX_HISTORY_SIZE = 100;

/**
 * Determina el rating basado en thresholds de Google
 */
function getRating(name: string, value: number): 'good' | 'needs-improvement' | 'poor' {
  const threshold = THRESHOLDS[name as keyof typeof THRESHOLDS];
  if (!threshold) return 'good';
  
  if (value <= threshold.good) return 'good';
  if (value <= threshold.poor) return 'needs-improvement';
  return 'poor';
}

/**
 * Guarda métricas en localStorage para el dashboard
 */
function saveToLocalStorage(metric: WebVitalMetric): void {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const history: WebVitalMetric[] = stored ? JSON.parse(stored) : [];
    
    // Agregar nueva métrica
    history.push(metric);
    
    // Mantener solo las últimas MAX_HISTORY_SIZE métricas
    const trimmed = history.slice(-MAX_HISTORY_SIZE);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch (error) {
    console.error('[WebVitals] Error saving to localStorage:', error);
  }
}

/**
 * Envía métricas a Google Analytics 4
 */
function sendToAnalytics(metric: WebVitalMetric): void {
  // Solo enviar en producción si GA está disponible
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'web_vitals', {
      event_category: 'Web Vitals',
      event_label: metric.name,
      value: Math.round(metric.value),
      metric_rating: metric.rating,
      non_interaction: true,
    });
  }
}

/**
 * Handler genérico para todas las métricas
 */
function handleMetric(metric: Metric): void {
  const webVitalMetric: WebVitalMetric = {
    name: metric.name,
    value: metric.value,
    rating: getRating(metric.name, metric.value),
    timestamp: Date.now(),
  };

  // Log en desarrollo
  if (import.meta.env.DEV) {
    console.log(`[WebVitals] ${metric.name}:`, {
      value: metric.value.toFixed(2),
      rating: webVitalMetric.rating,
      delta: metric.delta,
    });
  }

  // Guardar en localStorage
  saveToLocalStorage(webVitalMetric);

  // Enviar a GA4
  sendToAnalytics(webVitalMetric);

  // Dispatch custom event para listeners en tiempo real
  window.dispatchEvent(new CustomEvent('web-vital', { detail: webVitalMetric }));
}

/**
 * Inicializa el monitoreo de Web Vitals
 * Note: FID deprecated in web-vitals v4, replaced by INP
 */
export function reportWebVitals(): void {
  try {
    // Core Web Vitals (CLS, INP, LCP) + TTFB
    onCLS(handleMetric);
    onLCP(handleMetric);
    onINP(handleMetric);
    onTTFB(handleMetric);

    console.log('[WebVitals] Monitoring initialized (CLS, INP, LCP, TTFB)');
  } catch (error) {
    console.error('[WebVitals] Error initializing:', error);
  }
}

/**
 * Obtiene el historial de métricas desde localStorage
 */
export function getWebVitalsHistory(): WebVitalMetric[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('[WebVitals] Error reading history:', error);
    return [];
  }
}

/**
 * Limpia el historial de métricas
 */
export function clearWebVitalsHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
    console.log('[WebVitals] History cleared');
  } catch (error) {
    console.error('[WebVitals] Error clearing history:', error);
  }
}

/**
 * Obtiene la última métrica registrada por nombre
 */
export function getLatestMetric(name: string): WebVitalMetric | null {
  const history = getWebVitalsHistory();
  const filtered = history.filter(m => m.name === name);
  return filtered.length > 0 ? filtered[filtered.length - 1] : null;
}
