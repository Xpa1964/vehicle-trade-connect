
import es from '@/translations/es';
import en from '@/translations/en';

const translations: Record<string, Record<string, string>> = { es, en };

/**
 * Standalone translation function for non-React contexts.
 * Reads the current language from localStorage.
 */
export const getTranslation = (key: string): string => {
  const lang = localStorage.getItem('preferredLanguage') || 'es';
  return translations[lang]?.[key] || translations['en']?.[key] || translations['es']?.[key] || key;
};
