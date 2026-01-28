/**
 * Script de extracción masiva de fallbacks
 * Escanea todo el código y extrae traducciones desde los fallbacks
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface TranslationEntry {
  key: string;
  value: string;
  file: string;
  line: number;
}

interface GroupedTranslations {
  [module: string]: {
    [key: string]: string;
  };
}

/**
 * Recursivamente encuentra todos los archivos .tsx y .ts
 */
function getAllFiles(dir: string, fileList: string[] = []): string[] {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // Skip node_modules, dist, build, etc.
      if (!['node_modules', 'dist', 'build', '.git', 'supabase'].includes(file)) {
        getAllFiles(filePath, fileList);
      }
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

/**
 * Extrae todos los fallbacks de un archivo
 */
function extractFallbacksFromFile(filePath: string): TranslationEntry[] {
  const content = fs.readFileSync(filePath, 'utf-8');
  const entries: TranslationEntry[] = [];
  
  // Patrón para encontrar t('key', { fallback: 'value' })
  // Soporta comillas simples y dobles, y múltiples líneas
  const patterns = [
    /t\(['"]([^'"]+)['"],\s*\{\s*fallback:\s*['"]([^'"]+)['"]\s*\}/g,
    /t\(['"]([^'"]+)['"],\s*\{\s*fallback:\s*`([^`]+)`\s*\}/g,
  ];
  
  const lines = content.split('\n');
  
  patterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      const key = match[1];
      const value = match[2];
      
      // Encontrar el número de línea
      const lineNumber = content.substring(0, match.index).split('\n').length;
      
      entries.push({
        key,
        value,
        file: filePath,
        line: lineNumber,
      });
    }
  });
  
  return entries;
}

/**
 * Agrupa traducciones por módulo
 */
function groupByModule(entries: TranslationEntry[]): GroupedTranslations {
  const grouped: GroupedTranslations = {};
  
  entries.forEach(entry => {
    const parts = entry.key.split('.');
    const module = parts[0]; // Primera parte es el módulo (exchanges, vehicles, etc.)
    
    if (!grouped[module]) {
      grouped[module] = {};
    }
    
    grouped[module][entry.key] = entry.value;
  });
  
  return grouped;
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
 * Guarda traducciones en un archivo JSON maestro
 */
function saveMasterJSON(grouped: GroupedTranslations, outputPath: string): void {
  fs.writeFileSync(outputPath, JSON.stringify(grouped, null, 2), 'utf-8');
  console.log(`✅ Archivo maestro guardado: ${outputPath}`);
}

/**
 * Actualiza archivos de traducción existentes
 */
function updateTranslationFiles(grouped: GroupedTranslations, lang: string): void {
  const langDir = path.join(__dirname, '..', 'translations', `${lang}-modules`);
  
  // Crear directorio si no existe
  if (!fs.existsSync(langDir)) {
    fs.mkdirSync(langDir, { recursive: true });
  }
  
  Object.entries(grouped).forEach(([module, translations]) => {
    const filePath = path.join(langDir, `${module}.ts`);
    
    // Leer archivo existente si existe
    let existingTranslations: { [key: string]: string } = {};
    if (fs.existsSync(filePath)) {
      try {
        const content = fs.readFileSync(filePath, 'utf-8');
        const match = content.match(/export default \{([^}]+)\}/s);
        if (match) {
          const entriesStr = match[1];
          const entryPattern = /'([^']+)':\s*'([^']+)',?/g;
          let entryMatch;
          while ((entryMatch = entryPattern.exec(entriesStr)) !== null) {
            existingTranslations[entryMatch[1]] = entryMatch[2];
          }
        }
      } catch (error) {
        console.warn(`⚠️  No se pudo leer ${filePath}: ${error}`);
      }
    }
    
    // Merge: mantener existentes + agregar nuevas
    const merged = { ...translations, ...existingTranslations };
    
    const code = generateModuleCode(merged);
    fs.writeFileSync(filePath, code, 'utf-8');
    
    console.log(`✅ Actualizado: ${filePath} (${Object.keys(merged).length} claves)`);
  });
}

/**
 * Main
 */
async function main() {
  console.log('🔍 FASE 1: Extracción masiva de fallbacks\n');
  
  const srcDir = path.join(__dirname, '..');
  const files = getAllFiles(srcDir);
  
  console.log(`📁 Escaneando ${files.length} archivos...\n`);
  
  let allEntries: TranslationEntry[] = [];
  
  files.forEach(file => {
    const entries = extractFallbacksFromFile(file);
    if (entries.length > 0) {
      console.log(`  📄 ${path.relative(srcDir, file)}: ${entries.length} fallbacks`);
      allEntries = allEntries.concat(entries);
    }
  });
  
  console.log(`\n✅ Total de fallbacks encontrados: ${allEntries.length}\n`);
  
  // Agrupar por módulo
  const grouped = groupByModule(allEntries);
  
  console.log('📦 Módulos encontrados:');
  Object.entries(grouped).forEach(([module, translations]) => {
    console.log(`  - ${module}: ${Object.keys(translations).length} claves`);
  });
  
  // Guardar archivo maestro JSON
  const masterPath = path.join(__dirname, 'master-translations-es.json');
  saveMasterJSON(grouped, masterPath);
  
  // Actualizar archivos de traducción ES
  console.log('\n📝 Actualizando archivos de traducción ES...');
  updateTranslationFiles(grouped, 'es');
  
  console.log('\n✅ FASE 1 COMPLETADA');
  console.log(`\n📊 Resumen:`);
  console.log(`  - Fallbacks extraídos: ${allEntries.length}`);
  console.log(`  - Módulos actualizados: ${Object.keys(grouped).length}`);
  console.log(`  - Archivo maestro: ${masterPath}`);
  console.log(`\n🚀 Siguiente paso: Ejecutar traducción automática a otros idiomas`);
}

main().catch(console.error);
