// Translation registry
import es from './es';
import en from './en';
import fr from './fr';
import it from './it';
import de from './de';
import nl from './nl';
import pt from './pt';
import pl from './pl';
import dk from './dk';
import type { Language } from '@/config/languages';

export type { Language };

export const translations: Record<Language, Record<string, string>> = {
  es,
  en,
  fr,
  it,
  de,
  nl,
  pt,
  pl,
  dk
};

export const languageNames: Record<Language, string> = {
  es: 'Español',
  en: 'English',
  fr: 'Français',
  it: 'Italiano',
  de: 'Deutsch',
  nl: 'Nederlands',
  pt: 'Português',
  pl: 'Polski',
  dk: 'Dansk'
};