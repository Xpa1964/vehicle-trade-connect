import { useLanguage } from '@/contexts/LanguageContext';

/**
 * Generates a slug from equipment name for translation lookup
 */
export const generateEquipmentSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[áàäâ]/g, 'a')
    .replace(/[éèëê]/g, 'e')
    .replace(/[íìïî]/g, 'i')
    .replace(/[óòöô]/g, 'o')
    .replace(/[úùüû]/g, 'u')
    .replace(/[ñ]/g, 'n')
    .replace(/[ç]/g, 'c')
    .replace(/\s+/g, '_')
    .replace(/[^a-z_]/g, '')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');
};

/**
 * Hook to get translated equipment name with fallback
 * @param standardName - The standard_name from database
 * @param name - The name from database as fallback
 */
export const useEquipmentTranslation = () => {
  const { t } = useLanguage();
  
  return (standardName: string | null, name: string | null): string => {
    if (standardName) {
      const translationKey = `equipment.${generateEquipmentSlug(standardName)}`;
      const translated = t(translationKey);
      
      if (translated !== translationKey) {
        return translated;
      }
    }
    
    return name || standardName || t('vehicles.equipment');
  };
};