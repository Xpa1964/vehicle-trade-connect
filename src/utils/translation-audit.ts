/**
 * FASE 1: Sistema de Auditoría Automática de Traducciones
 * Detecta todas las claves faltantes y genera reportes detallados
 */

import { translations } from '@/translations';
import { SUPPORTED_LANGUAGES } from '@/config/languages';
import type { Language } from '@/config/languages';

export interface TranslationAuditReport {
  totalKeysInMaster: number;
  totalKeysUsed: number;
  missingByLanguage: Record<Language, string[]>;
  severityReport: {
    critical: string[];  // Claves usadas en 5+ componentes
    high: string[];      // Claves usadas en 2-4 componentes
    medium: string[];    // Claves usadas en 1 componente
  };
  completenessPercentage: Record<Language, number>;
  duplicatedKeys: string[];
  unusedKeys: string[];
}

/**
 * Extrae todas las claves únicas de todos los idiomas
 */
const getAllTranslationKeys = (): Set<string> => {
  const allKeys = new Set<string>();
  
  SUPPORTED_LANGUAGES.forEach(lang => {
    Object.keys(translations[lang] || {}).forEach(key => {
      allKeys.add(key);
    });
  });
  
  return allKeys;
};

/**
 * Identifica claves faltantes por idioma
 */
const findMissingKeysByLanguage = (allKeys: Set<string>): Record<Language, string[]> => {
  const missing: Record<Language, string[]> = {} as Record<Language, string[]>;
  
  SUPPORTED_LANGUAGES.forEach(lang => {
    missing[lang] = [];
    const langTranslations = translations[lang] || {};
    
    allKeys.forEach(key => {
      if (!langTranslations[key]) {
        missing[lang].push(key);
      }
    });
  });
  
  return missing;
};

/**
 * Calcula el porcentaje de completitud por idioma
 */
const calculateCompleteness = (
  allKeys: Set<string>, 
  missing: Record<Language, string[]>
): Record<Language, number> => {
  const completeness: Record<Language, number> = {} as Record<Language, number>;
  const totalKeys = allKeys.size;
  
  SUPPORTED_LANGUAGES.forEach(lang => {
    const missingCount = missing[lang].length;
    completeness[lang] = Math.round(((totalKeys - missingCount) / totalKeys) * 100);
  });
  
  return completeness;
};

/**
 * Detecta claves duplicadas (misma traducción para diferentes claves)
 */
const findDuplicatedKeys = (): string[] => {
  const duplicates: string[] = [];
  const masterLang = 'es' as Language;
  const masterTranslations = translations[masterLang];
  const valueToKeys = new Map<string, string[]>();
  
  Object.entries(masterTranslations).forEach(([key, value]) => {
    if (!valueToKeys.has(value)) {
      valueToKeys.set(value, []);
    }
    valueToKeys.get(value)!.push(key);
  });
  
  valueToKeys.forEach((keys, value) => {
    if (keys.length > 1) {
      duplicates.push(...keys);
    }
  });
  
  return duplicates;
};

/**
 * Categoriza las claves por severidad (cuántos componentes las usan)
 * NOTA: Esta es una aproximación basada en el módulo de la clave
 */
const categorizeBySeverity = (missingKeys: string[]): {
  critical: string[];
  high: string[];
  medium: string[];
} => {
  const critical: string[] = [];
  const high: string[] = [];
  const medium: string[] = [];
  
  // Módulos críticos que se usan en muchos componentes
  const criticalModules = ['common', 'navigation', 'auth', 'validation', 'forms'];
  const highModules = ['vehicles', 'exchanges', 'auctions', 'dashboard', 'profile'];
  
  missingKeys.forEach(key => {
    const module = key.split('.')[0];
    
    if (criticalModules.includes(module)) {
      critical.push(key);
    } else if (highModules.includes(module)) {
      high.push(key);
    } else {
      medium.push(key);
    }
  });
  
  return { critical, high, medium };
};

/**
 * Ejecuta una auditoría completa del sistema de traducciones
 */
export const performTranslationAudit = (): TranslationAuditReport => {
  console.group('🔍 [Translation Audit] Iniciando auditoría completa...');
  
  const allKeys = getAllTranslationKeys();
  const missingByLanguage = findMissingKeysByLanguage(allKeys);
  const completeness = calculateCompleteness(allKeys, missingByLanguage);
  const duplicatedKeys = findDuplicatedKeys();
  
  // Obtener todas las claves faltantes únicas
  const allMissingKeys = new Set<string>();
  Object.values(missingByLanguage).forEach(keys => {
    keys.forEach(key => allMissingKeys.add(key));
  });
  
  const severityReport = categorizeBySeverity(Array.from(allMissingKeys));
  
  const report: TranslationAuditReport = {
    totalKeysInMaster: translations['es'] ? Object.keys(translations['es']).length : 0,
    totalKeysUsed: allKeys.size,
    missingByLanguage,
    severityReport,
    completenessPercentage: completeness,
    duplicatedKeys,
    unusedKeys: [] // Se puede implementar analizando el código
  };
  
  // Imprimir reporte en consola
  console.log('📊 Total de claves únicas:', allKeys.size);
  console.log('📊 Claves en idioma maestro (ES):', report.totalKeysInMaster);
  console.log('\n📈 Completitud por idioma:');
  Object.entries(completeness).forEach(([lang, percent]) => {
    const emoji = percent === 100 ? '✅' : percent >= 90 ? '⚠️' : '❌';
    console.log(`  ${emoji} ${lang.toUpperCase()}: ${percent}%`);
  });
  
  console.log('\n🚨 Claves faltantes por severidad:');
  console.log(`  CRÍTICO: ${severityReport.critical.length} claves`);
  console.log(`  ALTO: ${severityReport.high.length} claves`);
  console.log(`  MEDIO: ${severityReport.medium.length} claves`);
  
  console.log('\n🔸 Claves duplicadas:', duplicatedKeys.length);
  
  console.log('\n📋 Detalle de claves faltantes por idioma:');
  Object.entries(missingByLanguage).forEach(([lang, keys]) => {
    if (keys.length > 0) {
      console.log(`\n  ${lang.toUpperCase()} (${keys.length} faltantes):`);
      const grouped = groupKeysByModule(keys);
      Object.entries(grouped).forEach(([module, moduleKeys]) => {
        console.log(`    📦 ${module}: ${moduleKeys.length} claves`);
        if (moduleKeys.length <= 5) {
          moduleKeys.forEach(key => console.log(`      - ${key}`));
        } else {
          moduleKeys.slice(0, 3).forEach(key => console.log(`      - ${key}`));
          console.log(`      ... y ${moduleKeys.length - 3} más`);
        }
      });
    }
  });
  
  console.groupEnd();
  
  return report;
};

/**
 * Agrupa claves por módulo (primera parte antes del punto)
 */
const groupKeysByModule = (keys: string[]): Record<string, string[]> => {
  const grouped: Record<string, string[]> = {};
  
  keys.forEach(key => {
    const module = key.split('.')[0];
    if (!grouped[module]) {
      grouped[module] = [];
    }
    grouped[module].push(key);
  });
  
  return grouped;
};

/**
 * Exporta el reporte en formato JSON
 */
export const exportAuditReport = (report: TranslationAuditReport): string => {
  return JSON.stringify(report, null, 2);
};

/**
 * Genera un reporte en formato Markdown
 */
export const generateMarkdownReport = (report: TranslationAuditReport): string => {
  let markdown = '# 🔍 Reporte de Auditoría de Traducciones\n\n';
  
  markdown += `## 📊 Resumen General\n\n`;
  markdown += `- **Total de claves únicas:** ${report.totalKeysUsed}\n`;
  markdown += `- **Claves en idioma maestro (ES):** ${report.totalKeysInMaster}\n\n`;
  
  markdown += `## 📈 Completitud por Idioma\n\n`;
  markdown += `| Idioma | Completitud | Claves Faltantes |\n`;
  markdown += `|--------|-------------|------------------|\n`;
  
  Object.entries(report.completenessPercentage).forEach(([lang, percent]) => {
    const missing = report.missingByLanguage[lang as Language].length;
    const emoji = percent === 100 ? '✅' : percent >= 90 ? '⚠️' : '❌';
    markdown += `| ${emoji} ${lang.toUpperCase()} | ${percent}% | ${missing} |\n`;
  });
  
  markdown += `\n## 🚨 Severidad de Claves Faltantes\n\n`;
  markdown += `- **CRÍTICO:** ${report.severityReport.critical.length} claves\n`;
  markdown += `- **ALTO:** ${report.severityReport.high.length} claves\n`;
  markdown += `- **MEDIO:** ${report.severityReport.medium.length} claves\n\n`;
  
  if (report.severityReport.critical.length > 0) {
    markdown += `### ⚠️ Claves Críticas Faltantes\n\n`;
    report.severityReport.critical.forEach(key => {
      markdown += `- \`${key}\`\n`;
    });
    markdown += `\n`;
  }
  
  return markdown;
};

// Ejecutar auditoría automáticamente en desarrollo
if (import.meta.env.DEV) {
  setTimeout(() => {
    performTranslationAudit();
  }, 2000);
}
