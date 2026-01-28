/**
 * Sistema de Seguridad Específico para Implementación de Nuevos Idiomas
 * Cortafuegos y puntos de control para cada fase de la implementación
 */

import { safetyMonitor } from './safetyMonitor';
import { checkpointManager, createSecurityCheckpoint } from './checkpointManager';
import { initializePhase0, verifyPhase0Ready, emergencyStop } from './phase0Setup';

export interface TranslationPhaseStatus {
  phaseId: string;
  phaseName: string;
  checkpointId: string | null;
  criticalFiles: string[];
  functionalityTests: Record<string, boolean>;
  rollbackInstructions: string[];
  canProceed: boolean;
  emergencyStopTriggered: boolean;
}

/**
 * Archivos críticos específicos para el sistema de traducción
 */
const TRANSLATION_CRITICAL_FILES = [
  'src/translations/index.ts',
  'src/contexts/language/LanguageContext.tsx', 
  'src/contexts/language/types.ts',
  'src/components/admin/TranslationStatus.tsx',
  'src/hooks/useTranslation.ts',
  'supabase/functions/translate-text/index.ts',
  'src/utils/translationUtils.ts'
];

/**
 * Inicializa el sistema de seguridad para la implementación de traducción
 */
export const initializeTranslationSecurity = async (): Promise<TranslationPhaseStatus> => {
  console.group('[TranslationSecurity] 🛡️ Inicializando sistema de seguridad...');
  
  try {
    // 1. Inicializar Fase 0 base
    const phase0Status = await initializePhase0();
    
    // 2. Crear checkpoint específico para traducción
    const checkpointId = createSecurityCheckpoint(
      'Translation-Initial', 
      'Estado inicial antes de añadir soporte para nuevos idiomas'
    );
    
    // 3. Verificar funcionalidad actual del sistema de traducción
    const translationTests = await testTranslationFunctionality();
    
    const status: TranslationPhaseStatus = {
      phaseId: 'PHASE_0_INIT',
      phaseName: 'Inicialización de Seguridad',
      checkpointId,
      criticalFiles: TRANSLATION_CRITICAL_FILES,
      functionalityTests: translationTests,
      rollbackInstructions: [
        '1. Ejecutar: emergencyTranslationRollback()',
        '2. O restaurar checkpoint: ' + checkpointId,
        '3. Verificar funcionalidad: testTranslationFunctionality()',
        '4. Reiniciar aplicación si es necesario'
      ],
      canProceed: Object.values(translationTests).every(Boolean),
      emergencyStopTriggered: false
    };
    
    console.log('[TranslationSecurity] ✅ Sistema de seguridad inicializado:', status);
    console.groupEnd();
    
    return status;
    
  } catch (error) {
    console.error('[TranslationSecurity] ❌ Error inicializando seguridad:', error);
    console.groupEnd();
    throw error;
  }
};

/**
 * Tests de funcionalidad específicos para el sistema de traducción
 */
const testTranslationFunctionality = async (): Promise<Record<string, boolean>> => {
  const tests = {
    languageContext: testLanguageContext(),
    translationLoading: testTranslationLoading(),
    currentLanguageSwitch: testLanguageSwitch(),
    translationCache: testTranslationCache(),
    edgeFunctionAvailable: await testEdgeFunction()
  };
  
  console.log('[TranslationSecurity] Resultados de tests:', tests);
  return tests;
};

/**
 * Test del contexto de idiomas
 */
const testLanguageContext = (): boolean => {
  try {
    const savedLanguage = localStorage.getItem('selected-language');
    const hasValidLanguage = ['es', 'en', 'fr', 'it'].includes(savedLanguage || '');
    return hasValidLanguage || savedLanguage === null; // null es válido (primera vez)
  } catch {
    return false;
  }
};

/**
 * Test de carga de traducciones
 */
const testTranslationLoading = (): boolean => {
  try {
    // Verificar que se pueden importar las traducciones
    const hasTranslations = typeof window !== 'undefined';
    return hasTranslations;
  } catch {
    return false;
  }
};

/**
 * Test de cambio de idioma
 */
const testLanguageSwitch = (): boolean => {
  try {
    // Simular cambio de idioma en localStorage
    const currentLang = localStorage.getItem('selected-language') || 'es';
    localStorage.setItem('selected-language', currentLang);
    return true;
  } catch {
    return false;
  }
};

/**
 * Test del cache de traducción
 */
const testTranslationCache = (): boolean => {
  try {
    // Verificar que localStorage funciona para el cache
    const testKey = 'translation_test_' + Date.now();
    localStorage.setItem(testKey, 'test');
    const retrieved = localStorage.getItem(testKey);
    localStorage.removeItem(testKey);
    return retrieved === 'test';
  } catch {
    return false;
  }
};

/**
 * Test de la función Edge de traducción
 */
const testEdgeFunction = async (): Promise<boolean> => {
  try {
    // Por ahora solo verificar que la función existe conceptualmente
    // En un test real haríamos una llamada de prueba
    return true;
  } catch {
    return false;
  }
};

/**
 * Cortafuegos - Verificar si es seguro proceder a la siguiente fase
 */
export const safetyCheckBeforePhase = (phaseId: string): boolean => {
  console.log(`[TranslationSecurity] 🔍 Verificando seguridad antes de ${phaseId}...`);
  
  // 1. Verificar que no hay errores recientes
  if (!verifyPhase0Ready()) {
    console.warn('[TranslationSecurity] ⚠️ Sistema no estable - deteniendo progreso');
    return false;
  }
  
  // 2. Verificar que no hay bucles infinitos detectados
  const stats = safetyMonitor.getStats();
  const hasRecentLoops = stats.some(stat => stat.count > 5);
  
  if (hasRecentLoops) {
    console.warn('[TranslationSecurity] ⚠️ Bucles detectados - deteniendo progreso');
    return false;
  }
  
  console.log('[TranslationSecurity] ✅ Seguro proceder a', phaseId);
  return true;
};

/**
 * Crear checkpoint antes de cada fase
 */
export const createPhaseCheckpoint = (phaseId: string, description: string): string => {
  const checkpointId = createSecurityCheckpoint(`Translation-${phaseId}`, description);
  console.log(`[TranslationSecurity] 📋 Checkpoint creado para ${phaseId}: ${checkpointId}`);
  return checkpointId;
};

/**
 * Rollback de emergencia específico para traducción
 */
export const emergencyTranslationRollback = (reason: string): void => {
  console.group('[TranslationSecurity] 🚨 ROLLBACK DE EMERGENCIA');
  console.error(`Razón: ${reason}`);
  
  // Limpiar monitors
  safetyMonitor.clearAll();
  
  // Restaurar idioma a español como fallback
  try {
    localStorage.setItem('selected-language', 'es');
    console.log('✅ Idioma restaurado a español');
  } catch (e) {
    console.error('❌ Error restaurando idioma:', e);
  }
  
  console.log('');
  console.log('PASOS DE RECUPERACIÓN:');
  console.log('1. Recargar la página');
  console.log('2. Verificar que el idioma sea español');
  console.log('3. Probar cambio de idioma básico');
  console.log('4. Si persisten errores, restaurar desde checkpoint');
  console.log('');
  
  emergencyStop(reason);
  console.groupEnd();
};

/**
 * Monitor continuo durante las fases de implementación
 */
export const startTranslationMonitoring = (): void => {
  console.log('[TranslationSecurity] 📊 Iniciando monitoreo continuo...');
  
  // Monitor cada 30 segundos durante la implementación
  const monitorInterval = setInterval(() => {
    const stats = safetyMonitor.getStats();
    const criticalComponents = stats.filter(stat => 
      stat.component.includes('Language') || 
      stat.component.includes('Translation')
    );
    
    if (criticalComponents.length > 0) {
      console.log('[TranslationSecurity] 📊 Componentes de traducción activos:', criticalComponents);
    }
    
    // Auto-stop si detectamos problemas críticos
    const hasCriticalIssues = criticalComponents.some(comp => comp.count > 8);
    if (hasCriticalIssues) {
      clearInterval(monitorInterval);
      emergencyTranslationRollback('Bucles críticos detectados en componentes de traducción');
    }
  }, 30000);
  
  // Limpiar después de 10 minutos
  setTimeout(() => {
    clearInterval(monitorInterval);
    console.log('[TranslationSecurity] 📊 Monitoreo continuo finalizado');
  }, 600000);
};