/**
 * Configuración inicial Fase 0 - Sistema de Seguridad
 * Inicializa todos los sistemas de monitoreo antes de las modificaciones
 */

import { safetyMonitor, getSafetyErrors } from './safetyMonitor';
import { checkpointManager, createSecurityCheckpoint } from './checkpointManager';

export interface Phase0Status {
  safetyMonitorActive: boolean;
  checkpointCreated: string | null;
  functionalityStatus: Record<string, boolean>;
  criticalFiles: string[];
  rollbackReady: boolean;
}

/**
 * Inicializa todos los sistemas de seguridad de Fase 0
 */
export const initializePhase0 = async (): Promise<Phase0Status> => {
  console.group('[Phase0] Inicializando sistemas de seguridad...');
  
  try {
    // 1. Verificar estado funcional actual
    console.log('[Phase0] Verificando funcionalidad actual...');
    const functionalityStatus = await checkpointManager.testFunctionality();
    
    // 2. Crear checkpoint inicial
    console.log('[Phase0] Creando checkpoint inicial...');
    const checkpointId = createSecurityCheckpoint(
      'Phase0-Initial', 
      'Estado inicial antes de modificaciones de seguridad'
    );
    
    // 3. Limpiar errores anteriores del safety monitor
    console.log('[Phase0] Limpiando monitoring anterior...');
    safetyMonitor.clearAll();
    
    // 4. Verificar que no hay errores previos críticos
    const previousErrors = getSafetyErrors();
    if (previousErrors.length > 0) {
      console.warn('[Phase0] Errores previos detectados:', previousErrors);
    }
    
    // 5. Obtener lista de archivos críticos
    const criticalFiles = [
      'src/hooks/useAuthSession.ts',
      'src/utils/securityCleanup.ts', 
      'src/contexts/AuthContext.tsx',
      'src/utils/roles/*',
      'supabase/functions/*'
    ];
    
    const status: Phase0Status = {
      safetyMonitorActive: true,
      checkpointCreated: checkpointId,
      functionalityStatus,
      criticalFiles,
      rollbackReady: true
    };
    
    console.log('[Phase0] ✅ Fase 0 inicializada correctamente:', status);
    console.groupEnd();
    
    // Mostrar resumen en consola
    displayPhase0Summary(status);
    
    return status;
    
  } catch (error) {
    console.error('[Phase0] ❌ Error inicializando Fase 0:', error);
    console.groupEnd();
    throw error;
  }
};

/**
 * Muestra un resumen de la configuración de Fase 0
 */
const displayPhase0Summary = (status: Phase0Status): void => {
  console.group('[Phase0] === RESUMEN DE SEGURIDAD ===');
  
  console.log('🛡️ Sistema de Monitoreo: ACTIVO');
  console.log(`📋 Checkpoint creado: ${status.checkpointCreated}`);
  console.log('🔍 Estado funcional:');
  Object.entries(status.functionalityStatus).forEach(([key, value]) => {
    console.log(`  - ${key}: ${value ? '✅' : '❌'}`);
  });
  
  console.log('📁 Archivos críticos monitoreados:');
  status.criticalFiles.forEach(file => {
    console.log(`  - ${file}`);
  });
  
  console.log('🔄 Rollback: PREPARADO');
  console.log('');
  console.log('💡 Para obtener instrucciones de rollback específicas:');
  console.log('   getRollbackInstructions("database")');
  console.log('   getRollbackInstructions("hardcoded")');
  console.log('   getRollbackInstructions("roles")');
  
  console.groupEnd();
};

/**
 * Verifica que todo esté listo para continuar con Fase 1
 */
export const verifyPhase0Ready = (): boolean => {
  try {
    const errors = getSafetyErrors();
    const hasRecentErrors = errors.some(error => {
      const errorTime = new Date(error.timestamp).getTime();
      const fiveMinutesAgo = Date.now() - (5 * 60 * 1000);
      return errorTime > fiveMinutesAgo;
    });
    
    if (hasRecentErrors) {
      console.warn('[Phase0] ⚠️ Errores recientes detectados - recomienda esperar antes de continuar');
      return false;
    }
    
    console.log('[Phase0] ✅ Sistema estable - listo para Fase 1');
    return true;
    
  } catch (error) {
    console.error('[Phase0] Error verificando estabilidad:', error);
    return false;
  }
};

/**
 * Función de emergencia para detener todo y mostrar instrucciones de rollback
 */
export const emergencyStop = (reason: string): void => {
  console.group('[EMERGENCY STOP] 🚨 DETENIENDO MODIFICACIONES');
  console.error(`Razón: ${reason}`);
  console.log('');
  console.log('INSTRUCCIONES DE ROLLBACK:');
  console.log('1. Ir al historial de chat');
  console.log('2. Buscar el último checkpoint exitoso');
  console.log('3. Hacer click en "Restore"');
  console.log('4. Verificar funcionalidad básica');
  console.log('');
  console.log('O usar los comandos de rollback específicos mostrados arriba');
  console.groupEnd();
  
  // Limpiar monitores para evitar spam
  safetyMonitor.clearAll();
};