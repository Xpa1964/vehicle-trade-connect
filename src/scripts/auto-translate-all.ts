/**
 * FASE 2: Traducción automática masiva
 * Traduce el archivo maestro a todos los idiomas
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LANGUAGES = ['en', 'fr', 'it', 'de', 'nl', 'pt', 'pl', 'dk'];

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Traduce un texto usando la edge function
 */
async function translateText(text: string, targetLang: string): Promise<string> {
  try {
    const { data, error } = await supabase.functions.invoke('translate-text', {
      body: {
        text,
        sourceLang: 'es',
        targetLang,
      },
    });

    if (error) throw error;
    return data.translatedText || text;
  } catch (error) {
    console.error(`❌ Error traduciendo a ${targetLang}:`, error);
    return text; // Fallback al texto original
  }
}

/**
 * Traduce un módulo completo
 */
async function translateModule(
  moduleName: string,
  translations: { [key: string]: string },
  targetLang: string
): Promise<{ [key: string]: string }> {
  console.log(`  🌐 Traduciendo módulo "${moduleName}" a ${targetLang}...`);
  
  const translated: { [key: string]: string } = {};
  const keys = Object.keys(translations);
  
  // Traducir en lotes de 5 para no sobrecargar
  for (let i = 0; i < keys.length; i += 5) {
    const batch = keys.slice(i, i + 5);
    
    const promises = batch.map(async (key) => {
      const translatedText = await translateText(translations[key], targetLang);
      translated[key] = translatedText;
      process.stdout.write('.');
    });
    
    await Promise.all(promises);
  }
  
  console.log(` ✅ ${keys.length} claves`);
  return translated;
}

/**
 * Genera código TypeScript para un módulo
 */
function generateModuleCode(translations: { [key: string]: string }): string {
  const sortedKeys = Object.keys(translations).sort();
  
  let code = 'export default {\n';
  
  sortedKeys.forEach(key => {
    const value = translations[key]
      .replace(/\\/g, '\\\\')
      .replace(/'/g, "\\'")
      .replace(/\n/g, '\\n');
    code += `  '${key}': '${value}',\n`;
  });
  
  code += '};\n';
  
  return code;
}

/**
 * Guarda traducciones en archivo
 */
function saveTranslations(
  moduleName: string,
  translations: { [key: string]: string },
  lang: string
): void {
  const langDir = path.join(__dirname, '..', 'translations', `${lang}-modules`);
  
  // Crear directorio si no existe
  if (!fs.existsSync(langDir)) {
    fs.mkdirSync(langDir, { recursive: true });
  }
  
  const filePath = path.join(langDir, `${moduleName}.ts`);
  const code = generateModuleCode(translations);
  
  fs.writeFileSync(filePath, code, 'utf-8');
  console.log(`    ✅ Guardado: ${filePath}`);
}

/**
 * Main
 */
async function main() {
  console.log('🚀 FASE 2: Traducción automática masiva\n');
  
  // Leer archivo maestro
  const masterPath = path.join(__dirname, 'master-translations-es.json');
  
  if (!fs.existsSync(masterPath)) {
    console.error('❌ No se encontró master-translations-es.json');
    console.error('   Ejecuta primero: extract-fallbacks-complete.ts');
    process.exit(1);
  }
  
  const masterData = JSON.parse(fs.readFileSync(masterPath, 'utf-8'));
  const modules = Object.keys(masterData);
  
  console.log(`📦 Módulos a traducir: ${modules.length}`);
  console.log(`🌍 Idiomas destino: ${LANGUAGES.join(', ')}\n`);
  
  for (const lang of LANGUAGES) {
    console.log(`\n🌐 Traduciendo a ${lang.toUpperCase()}...`);
    
    for (const moduleName of modules) {
      const esTranslations = masterData[moduleName];
      
      // Traducir módulo
      const translated = await translateModule(moduleName, esTranslations, lang);
      
      // Guardar archivo
      saveTranslations(moduleName, translated, lang);
      
      // Pequeña pausa para evitar rate limits
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  console.log('\n✅ FASE 2 COMPLETADA');
  console.log(`\n📊 Resumen:`);
  console.log(`  - Módulos traducidos: ${modules.length}`);
  console.log(`  - Idiomas generados: ${LANGUAGES.length}`);
  console.log(`  - Archivos creados: ${modules.length * LANGUAGES.length}`);
  console.log(`\n🎉 ¡Sistema de traducciones completamente restaurado!`);
}

main().catch(console.error);
