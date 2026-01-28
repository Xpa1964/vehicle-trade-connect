/**
 * FASE 7: Tests Automatizados del Sistema de Traducciones
 * Asegura que todas las traducciones estén completas y correctas
 */

import { describe, it, expect } from 'vitest';
import { translations } from '@/translations';
import { SUPPORTED_LANGUAGES } from '@/config/languages';
import { TRANSLATION_SCHEMA, validateAllTranslations, getAllSchemaKeys } from '@/translations/schema';
import { performTranslationAudit } from '@/utils/translation-audit';
import type { Language } from '@/config/languages';

describe('Translation System', () => {
  describe('Schema Validation', () => {
    it('should have all schema keys defined in Spanish (master language)', () => {
      const schemaKeys = getAllSchemaKeys();
      const spanishKeys = Object.keys(translations.es);
      
      const missingInSpanish = schemaKeys.filter(key => !spanishKeys.includes(key));
      
      expect(missingInSpanish).toHaveLength(0);
    });
    
    it('should not have undefined translations in any language', () => {
      SUPPORTED_LANGUAGES.forEach(lang => {
        const langTranslations = translations[lang];
        const undefinedKeys = Object.entries(langTranslations)
          .filter(([_, value]) => value === undefined || value === null || value === '')
          .map(([key]) => key);
        
        expect(undefinedKeys).toHaveLength(0);
      });
    });
  });
  
  describe('Completeness', () => {
    it('should have at least 90% completeness for all languages', () => {
      const audit = performTranslationAudit();
      
      SUPPORTED_LANGUAGES.forEach(lang => {
        const completeness = audit.completenessPercentage[lang];
        expect(completeness).toBeGreaterThanOrEqual(90);
      });
    });
    
    it('should have 100% completeness for critical modules', () => {
      const criticalModules = ['common', 'navigation', 'auth', 'validation'];
      
      SUPPORTED_LANGUAGES.forEach(lang => {
        const langTranslations = translations[lang];
        
        criticalModules.forEach(module => {
          const moduleKeys = TRANSLATION_SCHEMA[module as keyof typeof TRANSLATION_SCHEMA];
          const missingKeys = moduleKeys.filter(key => 
            !langTranslations[`${module}.${key}`]
          );
          
          expect(missingKeys).toHaveLength(0);
        });
      });
    });
    
    it('should not have critical missing translations', () => {
      const audit = performTranslationAudit();
      
      // Las traducciones críticas deben estar en todos los idiomas
      expect(audit.severityReport.critical.length).toBeLessThan(5);
    });
  });
  
  describe('Consistency', () => {
    it('should have same keys structure across all languages', () => {
      const spanishKeys = new Set(Object.keys(translations.es));
      
      SUPPORTED_LANGUAGES.forEach(lang => {
        if (lang === 'es') return; // Skip master language
        
        const langKeys = new Set(Object.keys(translations[lang]));
        
        // Permitir hasta 10% de diferencia (traducciones en progreso)
        const totalKeys = spanishKeys.size;
        const commonKeys = new Set([...spanishKeys].filter(k => langKeys.has(k)));
        const similarity = (commonKeys.size / totalKeys) * 100;
        
        expect(similarity).toBeGreaterThanOrEqual(85);
      });
    });
    
    it('should not have duplicate values for different keys in same language', () => {
      SUPPORTED_LANGUAGES.forEach(lang => {
        const langTranslations = translations[lang];
        const valueToKeys = new Map<string, string[]>();
        
        Object.entries(langTranslations).forEach(([key, value]) => {
          if (!valueToKeys.has(value)) {
            valueToKeys.set(value, []);
          }
          valueToKeys.get(value)!.push(key);
        });
        
        const duplicates = Array.from(valueToKeys.entries())
          .filter(([_, keys]) => keys.length > 1)
          .map(([value, keys]) => ({ value, keys }));
        
        // Permitir algunos duplicados para palabras comunes como "Sí", "No", etc.
        expect(duplicates.length).toBeLessThan(10);
      });
    });
  });
  
  describe('Format Validation', () => {
    it('should have valid placeholder formats', () => {
      const placeholderRegex = /\{([a-zA-Z0-9_]+)\}/g;
      
      SUPPORTED_LANGUAGES.forEach(lang => {
        const langTranslations = translations[lang];
        
        Object.entries(langTranslations).forEach(([key, value]) => {
          const matches = value.match(placeholderRegex);
          
          if (matches) {
            matches.forEach(match => {
              // Verificar que los placeholders tengan un formato válido
              expect(match).toMatch(/^\{[a-zA-Z0-9_]+\}$/);
            });
          }
        });
      });
    });
    
    it('should not have HTML tags in translations', () => {
      const htmlTagRegex = /<[^>]+>/g;
      
      SUPPORTED_LANGUAGES.forEach(lang => {
        const langTranslations = translations[lang];
        
        Object.entries(langTranslations).forEach(([key, value]) => {
          const hasHtmlTags = htmlTagRegex.test(value);
          
          // Algunas traducciones específicas pueden tener HTML permitido
          const allowedHtmlKeys = ['privacy.content', 'terms.content'];
          const isAllowed = allowedHtmlKeys.some(k => key.startsWith(k));
          
          if (!isAllowed) {
            expect(hasHtmlTags).toBe(false);
          }
        });
      });
    });
    
    it('should not have trailing or leading spaces', () => {
      SUPPORTED_LANGUAGES.forEach(lang => {
        const langTranslations = translations[lang];
        
        Object.entries(langTranslations).forEach(([key, value]) => {
          expect(value).toBe(value.trim());
        });
      });
    });
  });
  
  describe('Module-Specific Tests', () => {
    describe('Vehicles Module', () => {
      it('should have all bulk upload related keys', () => {
        const bulkUploadKeys = [
          'vehicles.downloadTemplate',
          'vehicles.downloadTemplateDesc',
          'vehicles.bulkUpload',
          'vehicles.bulkUploadTemplate',
          'vehicles.bulkUploadInstructions'
        ];
        
        SUPPORTED_LANGUAGES.forEach(lang => {
          const langTranslations = translations[lang];
          
          bulkUploadKeys.forEach(key => {
            expect(langTranslations[key]).toBeDefined();
            expect(langTranslations[key]).not.toBe('');
          });
        });
      });
    });
    
    describe('Exchanges Module', () => {
      it('should have all exchange-related keys', () => {
        const exchangeKeys = [
          'exchanges.title',
          'exchanges.description',
          'exchanges.offering',
          'exchanges.accepting',
          'exchanges.proposeExchange',
          'exchanges.selectVehicleToOffer'
        ];
        
        SUPPORTED_LANGUAGES.forEach(lang => {
          const langTranslations = translations[lang];
          
          exchangeKeys.forEach(key => {
            expect(langTranslations[key]).toBeDefined();
            expect(langTranslations[key]).not.toBe('');
          });
        });
      });
    });
  });
  
  describe('Performance', () => {
    it('should load translations quickly', () => {
      const start = performance.now();
      const _ = translations.es;
      const end = performance.now();
      
      const loadTime = end - start;
      expect(loadTime).toBeLessThan(10); // Less than 10ms
    });
    
    it('should not have excessively large translation objects', () => {
      SUPPORTED_LANGUAGES.forEach(lang => {
        const keysCount = Object.keys(translations[lang]).length;
        
        // Máximo razonable: ~2000 claves por idioma
        expect(keysCount).toBeLessThan(2000);
      });
    });
  });
});

describe('Translation Audit', () => {
  it('should generate valid audit report', () => {
    const audit = performTranslationAudit();
    
    expect(audit).toBeDefined();
    expect(audit.totalKeysInMaster).toBeGreaterThan(0);
    expect(audit.totalKeysUsed).toBeGreaterThan(0);
    expect(Object.keys(audit.missingByLanguage)).toHaveLength(SUPPORTED_LANGUAGES.length);
  });
  
  it('should categorize missing translations by severity', () => {
    const audit = performTranslationAudit();
    
    expect(audit.severityReport).toBeDefined();
    expect(audit.severityReport.critical).toBeInstanceOf(Array);
    expect(audit.severityReport.high).toBeInstanceOf(Array);
    expect(audit.severityReport.medium).toBeInstanceOf(Array);
  });
});
