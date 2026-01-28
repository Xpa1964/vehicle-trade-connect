
import { Language } from '@/translations';

export interface TranslationDifference {
  key: string;
  missingIn: Language[];
  availableIn: Language[];
  spanishValue?: string;
}

// Force fresh import of translations to avoid caching
const getLatestTranslations = async () => {
  try {
    const [es, en, fr, it, de, nl, pt] = await Promise.all([
      import('@/translations/es').then(m => m.default),
      import('@/translations/en').then(m => m.default),
      import('@/translations/fr').then(m => m.default),
      import('@/translations/it').then(m => m.default),
      import('@/translations/de').then(m => m.default),
      import('@/translations/nl').then(m => m.default),
      import('@/translations/pt').then(m => m.default),
    ]);
    
    return { es, en, fr, it, de, nl, pt };
  } catch (error) {
    console.error('Error importing translations:', error);
    // Fallback to static import
    const { translations } = await import('@/translations');
    return translations;
  }
};

/**
 * Finds translation keys that are missing in one or more languages
 */
export const findMissingTranslations = async (): Promise<TranslationDifference[]> => {
  console.log('🔍 Starting translation analysis...');
  
  // Get fresh translations to avoid caching
  const translations = await getLatestTranslations();
  
  // Get all unique keys across all languages
  const allKeys = new Set<string>();
  
  Object.values(translations).forEach(langTranslations => {
    Object.keys(langTranslations).forEach(key => {
      allKeys.add(key);
    });
  });
  
  console.log(`📊 Total unique keys found: ${allKeys.size}`);
  
  // Check if rating keys are present
  const ratingKeys = Array.from(allKeys).filter(key => key.startsWith('rating.'));
  console.log(`⭐ Rating keys found: ${ratingKeys.length}`, ratingKeys);
  
  // Check which languages have each key
  const differences: TranslationDifference[] = [];
  
  allKeys.forEach(key => {
    const missingIn: Language[] = [];
    const availableIn: Language[] = [];
    
    Object.entries(translations).forEach(([lang, langTranslations]) => {
      if (key in langTranslations) {
        availableIn.push(lang as Language);
      } else {
        missingIn.push(lang as Language);
      }
    });
    
    if (missingIn.length > 0) {
      differences.push({
        key,
        missingIn,
        availableIn,
        spanishValue: translations.es[key]
      });
    }
  });
  
  console.log(`❌ Total missing translations: ${differences.length}`);
  const ratingMissing = differences.filter(d => d.key.startsWith('rating.'));
  console.log(`⭐ Missing rating translations: ${ratingMissing.length}`, ratingMissing);
  
  return differences;
};

/**
 * Groups translation keys by their module/section
 */
export const groupTranslationsByModule = (
  translationDifferences: TranslationDifference[]
): Record<string, TranslationDifference[]> => {
  const grouped: Record<string, TranslationDifference[]> = {};
  
  translationDifferences.forEach(diff => {
    // Extract module name from the key (e.g., "vehicles.brand" => "vehicles")
    const moduleName = diff.key.split('.')[0];
    
    if (!grouped[moduleName]) {
      grouped[moduleName] = [];
    }
    
    grouped[moduleName].push(diff);
  });
  
  return grouped;
};

/**
 * Calculates translation completion percentage for each language
 */
export const calculateTranslationCompleteness = async (): Promise<Record<Language, number>> => {
  const translations = await getLatestTranslations();
  const totalKeys = Object.keys(translations.es).length; // Using Spanish as reference
  const completeness: Record<Language, number> = {} as Record<Language, number>;
  
  Object.keys(translations).forEach(lang => {
    const langKeys = Object.keys(translations[lang as Language]).length;
    completeness[lang as Language] = Math.round((langKeys / totalKeys) * 100);
  });
  
  return completeness;
};
