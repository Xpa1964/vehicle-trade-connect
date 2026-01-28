/**
 * Sistema de Monitoreo de Seguridad - Fase 0
 * Detecta bucles infinitos y problemas de rendimiento antes de que rompan la app
 */

interface RenderCount {
  component: string;
  count: number;
  lastRender: number;
}

interface LoopDetectionConfig {
  maxRenders: number;
  timeWindow: number; // ms
  alertThreshold: number;
}

class SafetyMonitor {
  private renderCounts = new Map<string, RenderCount>();
  private config: LoopDetectionConfig = {
    maxRenders: 10,
    timeWindow: 5000, // 5 segundos
    alertThreshold: 5 // Alertar después de 5 renders rápidos
  };

  /**
   * Registra un render de componente y detecta posibles bucles
   */
  trackRender(componentName: string): boolean {
    const now = Date.now();
    const existing = this.renderCounts.get(componentName);

    if (!existing) {
      this.renderCounts.set(componentName, {
        component: componentName,
        count: 1,
        lastRender: now
      });
      return true;
    }

    // Si han pasado más de 5 segundos, resetear contador
    if (now - existing.lastRender > this.config.timeWindow) {
      this.renderCounts.set(componentName, {
        component: componentName,
        count: 1,
        lastRender: now
      });
      return true;
    }

    // Incrementar contador
    existing.count++;
    existing.lastRender = now;

    // Detectar posible problema
    if (existing.count >= this.config.alertThreshold) {
      console.warn(`[SafetyMonitor] ALERTA: ${componentName} se ha renderizado ${existing.count} veces en ${this.config.timeWindow}ms`);
      
      if (existing.count >= this.config.maxRenders) {
        console.error(`[SafetyMonitor] BUCLE INFINITO DETECTADO: ${componentName} - BLOQUEANDO RENDERS`);
        this.logCriticalError(componentName, existing.count);
        return false; // Bloquear renders adicionales
      }
    }

    return true;
  }

  /**
   * Log crítico para bucles infinitos
   */
  private logCriticalError(component: string, renderCount: number): void {
    const errorData = {
      component,
      renderCount,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    // Guardar en localStorage para debug
    try {
      const existingErrors = JSON.parse(localStorage.getItem('safety_monitor_errors') || '[]');
      existingErrors.push(errorData);
      // Mantener solo los últimos 10 errores
      if (existingErrors.length > 10) {
        existingErrors.splice(0, existingErrors.length - 10);
      }
      localStorage.setItem('safety_monitor_errors', JSON.stringify(existingErrors));
    } catch (e) {
      console.error('[SafetyMonitor] Error guardando log:', e);
    }
  }

  /**
   * Resetea contadores para un componente específico
   */
  resetComponent(componentName: string): void {
    this.renderCounts.delete(componentName);
    console.log(`[SafetyMonitor] Reset contador para: ${componentName}`);
  }

  /**
   * Obtiene estadísticas actuales
   */
  getStats(): RenderCount[] {
    return Array.from(this.renderCounts.values());
  }

  /**
   * Limpia todos los contadores
   */
  clearAll(): void {
    this.renderCounts.clear();
    console.log('[SafetyMonitor] Todos los contadores limpiados');
  }
}

// Instancia singleton
export const safetyMonitor = new SafetyMonitor();

/**
 * Hook para usar en componentes que queremos monitorear
 */
export const useSafetyMonitor = (componentName: string) => {
  const canRender = safetyMonitor.trackRender(componentName);
  
  if (!canRender) {
    console.error(`[useSafetyMonitor] Render bloqueado para ${componentName} - posible bucle infinito`);
  }
  
  return { canRender };
};

/**
 * Función para obtener errores guardados
 */
export const getSafetyErrors = (): any[] => {
  try {
    return JSON.parse(localStorage.getItem('safety_monitor_errors') || '[]');
  } catch {
    return [];
  }
};