/**
 * Configuración Central de Idiomas
 * FASE 1: Centralización de configuración para facilitar adición de nuevos idiomas
 * 
 * CORTAFUEGOS: Este archivo centraliza toda la configuración de idiomas
 * permitiendo rollback fácil si hay problemas
 */

// REMOVED: useSafetyMonitor hook - can't use React hooks in config modules
// Configuration modules must be hook-free

/**
 * Códigos de idioma soportados
 * IMPORTANTE: Añadir nuevos idiomas aquí primero
 */
export const SUPPORTED_LANGUAGES = ['es', 'en', 'fr', 'it', 'de', 'nl', 'pt', 'pl', 'dk'] as const;

/**
 * Tipo derivado automáticamente de la configuración
 * EXPORTADO para uso en otros archivos
 */
export type Language = typeof SUPPORTED_LANGUAGES[number];

/**
 * Nombres legibles de los idiomas
 */
export const LANGUAGE_NAMES: Record<Language, string> = {
  es: 'Español',
  en: 'English', 
  fr: 'Français',
  it: 'Italiano',
  de: 'Deutsch',
  nl: 'Nederlands',
  pt: 'Português',
  pl: 'Polski',
  dk: 'Dansk'
} as const;

/**
 * Configuración de detección automática del navegador
 */
export const BROWSER_LANGUAGE_MAP: Record<string, Language> = {
  'es': 'es',
  'es-ES': 'es',
  'es-MX': 'es',
  'es-AR': 'es',
  'en': 'en',
  'en-US': 'en', 
  'en-GB': 'en',
  'fr': 'fr',
  'fr-FR': 'fr',
  'fr-CA': 'fr',
  'it': 'it',
  'it-IT': 'it',
  'de': 'de',
  'de-DE': 'de',
  'de-AT': 'de',
  'de-CH': 'de',
  'nl': 'nl',
  'nl-NL': 'nl',
  'nl-BE': 'nl',
  'pt': 'pt',
  'pt-BR': 'pt',
  'pt-PT': 'pt',
  'pl': 'pl',
  'pl-PL': 'pl',
  'da': 'dk',
  'da-DK': 'dk'
} as const;

/**
 * Idioma por defecto del sistema
 */
export const DEFAULT_LANGUAGE: Language = 'en';

/**
 * Configuración para el localStorage
 */
export const LANGUAGE_STORAGE_KEY = 'selected-language';

/**
 * Configuración de la API de traducción
 */
export const TRANSLATION_CONFIG = {
  // Idiomas soportados por la API de Google Translate
  googleTranslateCodes: {
    es: 'es',
    en: 'en', 
    fr: 'fr',
    it: 'it',
    de: 'de',
    nl: 'nl',
    pt: 'pt',
    pl: 'pl',
    dk: 'da'
  } as Record<Language, string>,
  
  // Cache de traducción
  cacheEnabled: true,
  cacheExpirationDays: 7,
  
  // Configuración de retry
  maxRetries: 3,
  retryDelayMs: 1000
} as const;

/**
 * Validaciones de seguridad
 */
export const isValidLanguage = (lang: string): lang is Language => {
  return SUPPORTED_LANGUAGES.includes(lang as Language);
};

export const getSafeLanguage = (lang: string | null): Language => {
  if (lang && isValidLanguage(lang)) {
    return lang;
  }
  return DEFAULT_LANGUAGE;
};

export const detectBrowserLanguage = (): Language => {
  try {
    const browserLang = navigator.language;
    const mappedLang = BROWSER_LANGUAGE_MAP[browserLang];
    
    if (mappedLang) {
      return mappedLang;
    }
    
    // Fallback: buscar solo el código principal (ej: 'es' de 'es-MX')
    const primaryLang = browserLang.slice(0, 2);
    if (isValidLanguage(primaryLang)) {
      return primaryLang;
    }
    
    return DEFAULT_LANGUAGE;
  } catch {
    return DEFAULT_LANGUAGE;
  }
};

/**
 * Configuración para logging y debugging
 */
export const LANGUAGE_DEBUG = {
  logChanges: true,
  logTranslations: true,
  logErrors: true
} as const;

/**
 * Función de rollback de emergencia para esta configuración
 */
export const emergencyLanguageConfigRollback = (): void => {
  console.warn('[LanguageConfig] 🚨 Ejecutando rollback de emergencia');
  
  try {
    // Forzar idioma a español
    localStorage.setItem(LANGUAGE_STORAGE_KEY, DEFAULT_LANGUAGE);
    
    // Recargar para aplicar cambios
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  } catch (error) {
    console.error('[LanguageConfig] Error en rollback:', error);
  }
};

/**
 * Estado de la implementación por fases
 * Útil para debugging y monitoreo
 */
export const IMPLEMENTATION_STATUS = {
  phase: 'PHASE_1_CENTRALIZATION',
  version: '1.0.0',
  lastUpdate: new Date().toISOString(),
  criticalFiles: [
    'src/config/languages.ts',
    'src/contexts/language/LanguageContext.tsx',
    'src/contexts/language/types.ts'
  ],
  rollbackCheckpoint: 'Translation-Phase1',
  emergencyContact: 'emergencyLanguageConfigRollback()'
} as const;
