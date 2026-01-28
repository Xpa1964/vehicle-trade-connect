/**
 * FASE 6: Hook de Monitoreo de Traducciones en Producción
 * Detecta y reporta traducciones faltantes en tiempo real
 */

import { useEffect, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';

interface MissingTranslationReport {
  key: string;
  language: string;
  page: string;
  timestamp: string;
  userAgent: string;
}

// Cache local para evitar reportar múltiples veces la misma clave
const reportedKeys = new Set<string>();

// Cola de reportes para envío por lotes
let reportQueue: MissingTranslationReport[] = [];
let flushTimeout: NodeJS.Timeout | null = null;

/**
 * Envía los reportes acumulados a la base de datos
 */
const flushReports = async () => {
  if (reportQueue.length === 0) return;
  
  const reportsToSend = [...reportQueue];
  reportQueue = [];
  
  try {
    // En producción, descomentar para guardar en BD
    // await supabase.from('missing_translations').insert(reportsToSend);
    
    // Por ahora solo log en consola
    console.group('📊 [Translation Monitor] Reportando traducciones faltantes');
    console.table(reportsToSend);
    console.groupEnd();
  } catch (error) {
    console.error('[Translation Monitor] Error enviando reportes:', error);
  }
};

/**
 * Programa el envío de reportes cada 30 segundos
 */
const scheduleFlush = () => {
  if (flushTimeout) {
    clearTimeout(flushTimeout);
  }
  
  flushTimeout = setTimeout(() => {
    flushReports();
  }, 30000); // 30 segundos
};

/**
 * Reporta una traducción faltante
 */
const reportMissingTranslation = (
  key: string,
  language: string,
  page: string
) => {
  // Evitar reportar múltiples veces la misma clave
  const cacheKey = `${language}:${key}`;
  if (reportedKeys.has(cacheKey)) {
    return;
  }
  
  reportedKeys.add(cacheKey);
  
  const report: MissingTranslationReport = {
    key,
    language,
    page,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent
  };
  
  reportQueue.push(report);
  scheduleFlush();
  
  // En desarrollo, mostrar advertencia inmediata
  if (import.meta.env.DEV) {
    console.warn(
      `🚨 [Translation Monitor] Missing translation: ${key} (${language}) on ${page}`
    );
  }
};

/**
 * Hook para monitorear traducciones faltantes
 */
export const useTranslationMonitor = () => {
  const { currentLanguage, t } = useLanguage();
  const originalT = useRef(t);
  const currentPage = useRef(window.location.pathname);
  
  useEffect(() => {
    // Actualizar página actual cuando cambia la ruta
    currentPage.current = window.location.pathname;
  }, [window.location.pathname]);
  
  useEffect(() => {
    // Solo monitorear en producción o si está habilitado en desarrollo
    const shouldMonitor = !import.meta.env.DEV || import.meta.env.VITE_MONITOR_TRANSLATIONS === 'true';
    
    if (!shouldMonitor) {
      return;
    }
    
    // Interceptar llamadas a la función t() para detectar fallbacks
    const monitoredT = (key: string, params?: any): string => {
      const result = originalT.current(key, params);
      
      // Detectar si se usó un fallback
      const usedFallback = result === params?.fallback || 
                          result === key || 
                          result.startsWith('[MISSING:');
      
      if (usedFallback) {
        reportMissingTranslation(key, currentLanguage, currentPage.current);
      }
      
      return result;
    };
    
    // Retornar función para limpiar
    return () => {
      if (flushTimeout) {
        clearTimeout(flushTimeout);
      }
      // Enviar reportes pendientes antes de desmontar
      flushReports();
    };
  }, [currentLanguage]);
  
  return {
    reportMissingTranslation: (key: string) => 
      reportMissingTranslation(key, currentLanguage, currentPage.current)
  };
};

/**
 * Hook alternativo para uso manual en componentes específicos
 */
export const useTranslationAlert = (componentName: string) => {
  const { currentLanguage } = useLanguage();
  
  const alertMissing = (key: string) => {
    console.warn(
      `[${componentName}] Missing translation: ${key} for language: ${currentLanguage}`
    );
    reportMissingTranslation(key, currentLanguage, componentName);
  };
  
  return { alertMissing };
};

/**
 * Limpia el cache de claves reportadas (útil para testing)
 */
export const clearReportedKeys = () => {
  reportedKeys.clear();
  reportQueue = [];
  if (flushTimeout) {
    clearTimeout(flushTimeout);
    flushTimeout = null;
  }
};

/**
 * Obtiene estadísticas de monitoreo
 */
export const getMonitoringStats = () => {
  return {
    totalReported: reportedKeys.size,
    pendingReports: reportQueue.length,
    reportedKeys: Array.from(reportedKeys)
  };
};
