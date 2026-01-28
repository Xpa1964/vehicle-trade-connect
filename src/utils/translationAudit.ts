import { findMissingTranslations, groupTranslationsByModule, calculateTranslationCompleteness } from './translationUtils';

/**
 * Performs a complete audit of the translation system
 */
export const performTranslationAudit = async () => {
  console.log('🔍 Starting Translation Audit...\n');
  
  // Find all missing translations
  const missingTranslations = await findMissingTranslations();
  
  // Group by module
  const groupedMissing = groupTranslationsByModule(missingTranslations);
  
  // Calculate completeness
  const completeness = await calculateTranslationCompleteness();
  
  // Report results
  console.log('📊 Translation Completeness:');
  Object.entries(completeness).forEach(([lang, percentage]) => {
    const status = percentage === 100 ? '✅' : '⚠️';
    console.log(`${status} ${lang.toUpperCase()}: ${percentage}%`);
  });
  
  console.log('\n📋 Missing Translations Summary:');
  if (Object.keys(groupedMissing).length === 0) {
    console.log('✅ No missing translations found! All languages are complete.');
  } else {
    Object.entries(groupedMissing).forEach(([module, differences]) => {
      console.log(`\n📦 Module: ${module}`);
      differences.forEach(diff => {
        console.log(`  🔸 ${diff.key} (missing in: ${diff.missingIn.join(', ')})`);
      });
    });
  }
  
  console.log('\n🎯 Audit Complete!');
  
  return {
    missingTranslations,
    groupedMissing,
    completeness,
    isComplete: Object.values(completeness).every(p => p === 100)
  };
};

// Execute audit if file is run directly
if (import.meta.env.DEV) {
  // This will only run in development mode
  setTimeout(async () => {
    try {
      await performTranslationAudit();
    } catch (error) {
      console.error('Translation audit error:', error);
    }
  }, 1000);
}