/**
 * FASE 4: Sistema de protección CI/CD
 * Verifica que no haya claves de traducción faltantes
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const REQUIRED_LANGUAGES = ['es', 'en', 'fr', 'it', 'de', 'nl', 'pt', 'pl', 'dk'];

interface TranslationKeys {
  [key: string]: string;
}

interface LanguageTranslations {
  [lang: string]: TranslationKeys;
}

/**
 * Carga todas las traducciones de un idioma
 */
function loadLanguageTranslations(lang: string): TranslationKeys {
  const langDir = path.join(__dirname, '..', 'translations', `${lang}-modules`);
  const allTranslations: TranslationKeys = {};
  
  if (!fs.existsSync(langDir)) {
    return allTranslations;
  }
  
  const files = fs.readdirSync(langDir).filter(f => f.endsWith('.ts'));
  
  files.forEach(file => {
    try {
      const content = fs.readFileSync(path.join(langDir, file), 'utf-8');
      const match = content.match(/export default \{([^}]+)\}/s);
      
      if (match) {
        const entriesStr = match[1];
        const entryPattern = /'([^']+)':\s*'([^']+)',?/g;
        let entryMatch;
        
        while ((entryMatch = entryPattern.exec(entriesStr)) !== null) {
          allTranslations[entryMatch[1]] = entryMatch[2];
        }
      }
    } catch (error) {
      console.warn(`⚠️  Error leyendo ${file}: ${error}`);
    }
  });
  
  return allTranslations;
}

/**
 * Encuentra claves faltantes entre idiomas
 */
function findMissingKeys(allTranslations: LanguageTranslations): {
  [lang: string]: string[];
} {
  const missingByLang: { [lang: string]: string[] } = {};
  
  // Usar ES como referencia (idioma base)
  const baseKeys = new Set(Object.keys(allTranslations['es'] || {}));
  
  REQUIRED_LANGUAGES.forEach(lang => {
    if (lang === 'es') return; // Skip base language
    
    const langKeys = new Set(Object.keys(allTranslations[lang] || {}));
    const missing: string[] = [];
    
    baseKeys.forEach(key => {
      if (!langKeys.has(key)) {
        missing.push(key);
      }
    });
    
    if (missing.length > 0) {
      missingByLang[lang] = missing;
    }
  });
  
  return missingByLang;
}

/**
 * Busca uso de fallbacks en el código
 */
function findFallbackUsage(): string[] {
  const srcDir = path.join(__dirname, '..');
  const filesWithFallbacks: string[] = [];
  
  function scanDir(dir: string) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        if (!['node_modules', 'dist', 'build', '.git', 'supabase'].includes(file)) {
          scanDir(filePath);
        }
      } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        const content = fs.readFileSync(filePath, 'utf-8');
        if (/t\([^)]+,\s*\{\s*fallback:/.test(content)) {
          filesWithFallbacks.push(path.relative(srcDir, filePath));
        }
      }
    });
  }
  
  scanDir(srcDir);
  return filesWithFallbacks;
}

/**
 * Main
 */
function main() {
  console.log('🔒 FASE 4: Verificación de integridad del sistema de traducciones\n');
  
  // Cargar todas las traducciones
  const allTranslations: LanguageTranslations = {};
  
  REQUIRED_LANGUAGES.forEach(lang => {
    console.log(`📖 Cargando traducciones de ${lang}...`);
    allTranslations[lang] = loadLanguageTranslations(lang);
    console.log(`   ✅ ${Object.keys(allTranslations[lang]).length} claves`);
  });
  
  console.log('\n🔍 Verificando completitud...\n');
  
  // Encontrar claves faltantes
  const missingKeys = findMissingKeys(allTranslations);
  
  let hasErrors = false;
  
  if (Object.keys(missingKeys).length > 0) {
    console.error('❌ ERRORES ENCONTRADOS: Claves faltantes\n');
    
    Object.entries(missingKeys).forEach(([lang, keys]) => {
      console.error(`  🔴 ${lang.toUpperCase()}: ${keys.length} claves faltantes`);
      if (keys.length <= 10) {
        keys.forEach(key => console.error(`     - ${key}`));
      } else {
        keys.slice(0, 10).forEach(key => console.error(`     - ${key}`));
        console.error(`     ... y ${keys.length - 10} más`);
      }
    });
    
    hasErrors = true;
  } else {
    console.log('✅ Todas las traducciones están completas');
  }
  
  // Verificar uso de fallbacks
  console.log('\n🔍 Verificando uso de fallbacks...\n');
  const fallbackFiles = findFallbackUsage();
  
  if (fallbackFiles.length > 0) {
    console.warn('⚠️  ADVERTENCIA: Archivos con fallbacks encontrados\n');
    fallbackFiles.forEach(file => {
      console.warn(`  🟡 ${file}`);
    });
    console.warn('\n   Ejecuta remove-fallbacks.ts para limpiar');
  } else {
    console.log('✅ No hay fallbacks en el código');
  }
  
  // Resumen final
  console.log('\n' + '='.repeat(60));
  
  if (hasErrors) {
    console.error('\n❌ VERIFICACIÓN FALLIDA');
    console.error('\nEjecuta: npm run translate:auto para completar traducciones\n');
    process.exit(1);
  } else {
    console.log('\n✅ VERIFICACIÓN EXITOSA');
    console.log('\n🎉 El sistema de traducciones está 100% completo!\n');
    
    // Estadísticas
    console.log('📊 Estadísticas:');
    REQUIRED_LANGUAGES.forEach(lang => {
      const count = Object.keys(allTranslations[lang] || {}).length;
      console.log(`  ${lang.toUpperCase()}: ${count} claves`);
    });
  }
  
  console.log('\n' + '='.repeat(60));
}

main();
