import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { translations } from '@/translations';
import { 
  SUPPORTED_LANGUAGES, 
  LANGUAGE_STORAGE_KEY, 
  DEFAULT_LANGUAGE,
  getSafeLanguage,
  detectBrowserLanguage,
  LANGUAGE_DEBUG
} from '@/config/languages';
import { Language as ConfigLanguage } from '@/config/languages';

// Types
export type Language = ConfigLanguage;

export interface LanguageContextType {
  currentLanguage: Language;
  changeLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number | undefined | null> & { fallback?: string }) => string;
}

export interface LanguageProviderProps {
  children: ReactNode;
  onReady?: () => void;
}

// Default context value to prevent undefined errors
const defaultValue: LanguageContextType = {
  currentLanguage: DEFAULT_LANGUAGE,
  changeLanguage: () => {},
  t: (key: string, params?: any) => params?.fallback || key
};

// Context with default value
export const LanguageContext = createContext<LanguageContextType>(defaultValue);

// Provider
export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children, onReady }) => {
  console.log('🔧 [DEBUG] LanguageProvider montándose...');
  
  // Simple initial state - complex logic moved to useEffect
  const [currentLanguage, setCurrentLanguage] = useState<Language>(DEFAULT_LANGUAGE);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize language from localStorage or browser detection
  useEffect(() => {
    try {
      // Intentar recuperar el idioma guardado
      const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
      const safeSavedLanguage = getSafeLanguage(savedLanguage);
      
      if (savedLanguage) {
        if (LANGUAGE_DEBUG.logChanges) {
          console.log('[LanguageProvider] Idioma recuperado:', safeSavedLanguage);
        }
        setCurrentLanguage(safeSavedLanguage);
      } else {
        // Para KONTACT VO, siempre iniciar en español
        if (LANGUAGE_DEBUG.logChanges) {
          console.log('[LanguageProvider] Iniciando en español (idioma por defecto)');
        }
        setCurrentLanguage(DEFAULT_LANGUAGE);
        localStorage.setItem(LANGUAGE_STORAGE_KEY, DEFAULT_LANGUAGE);
      }
    } catch (error) {
      console.error('[LanguageProvider] Error inicializando idioma:', error);
      setCurrentLanguage(DEFAULT_LANGUAGE);
    } finally {
      setIsInitialized(true);
      // Notify parent that language context is ready
      onReady?.();
    }
  }, [onReady]);

  // Persistir el idioma seleccionado
  useEffect(() => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, currentLanguage);
  }, [currentLanguage]);

  const changeLanguage = (language: Language) => {
    console.log('🌐 [LanguageContext] Changing language from', currentLanguage, 'to', language);
    setCurrentLanguage(language);
  };

  const t = (key: string, params?: { [key: string]: any; fallback?: string }): string => {
    // 1. Intentar idioma actual
    let translation = translations[currentLanguage]?.[key];
    
    if (translation) {
      // Replace placeholders with actual values
      if (params) {
        return Object.keys(params).reduce((result, paramKey) => {
          if (paramKey === 'fallback') return result;
          const placeholder = `{${paramKey}}`;
          return result.replace(new RegExp(placeholder, 'g'), String(params[paramKey]));
        }, translation);
      }
      return translation;
    }
    
    // 2. Fallback inteligente: inglés -> español -> fallback manual -> clave
    const fallbackChain: Language[] = ['en', 'es'];
    
    for (const fallbackLang of fallbackChain) {
      if (fallbackLang === currentLanguage) continue;
      
      translation = translations[fallbackLang]?.[key];
      if (translation) {
        if (import.meta.env.DEV) {
          console.warn(
            `🌐 [LanguageContext] Using ${fallbackLang.toUpperCase()} fallback for key: ${key} (requested: ${currentLanguage})`
          );
        }
        
        // Replace placeholders if needed
        if (params) {
          return Object.keys(params).reduce((result, paramKey) => {
            if (paramKey === 'fallback') return result;
            const placeholder = `{${paramKey}}`;
            return result.replace(new RegExp(placeholder, 'g'), String(params[paramKey]));
          }, translation);
        }
        return translation;
      }
    }
    
    // 3. Manual fallback parameter is intentionally ignored to prevent
    // Spanish text from leaking through when another language is selected.
    // The fallback chain (current -> en -> es) handles all cases.
    
    // 4. En desarrollo, mostrar la clave claramente. En producción, última parte de la clave
    if (import.meta.env.DEV) {
      console.error(`❌ [LanguageContext] Missing translation: ${key} (${currentLanguage})`);
      return `[MISSING: ${key}]`;
    }
    
    // En producción, mostrar última parte de la clave (ej: "exchanges.title" -> "title")
    return key.split('.').pop() || key;
  };

  const value: LanguageContextType = {
    currentLanguage,
    changeLanguage,
    t
  };

  console.log('✅ [DEBUG] LanguageProvider inicializado con idioma:', currentLanguage);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

// Hook - now safe because context always has a default value
export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  return context;
}

// Default export para compatibilidad
export default LanguageProvider;
