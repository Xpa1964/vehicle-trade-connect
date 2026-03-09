
import { translations } from '@/translations/index';

/**
 * Standalone translation function for non-React contexts.
 * Reads the current language from localStorage.
 */
export const getTranslation = (key: string): string => {
  const lang = localStorage.getItem('preferredLanguage') || 'es';
  return translations[lang as keyof typeof translations]?.[key] || translations['en']?.[key] || translations['es']?.[key] || key;
};
