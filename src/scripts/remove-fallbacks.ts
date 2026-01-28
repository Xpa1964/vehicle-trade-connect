/**
 * FASE 3: Eliminación de fallbacks
 * Reemplaza t('key', { fallback: 'value' }) por t('key')
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Recursivamente encuentra todos los archivos .tsx y .ts
 */
function getAllFiles(dir: string, fileList: string[] = []): string[] {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
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
 * Elimina fallbacks de un archivo
 */
function removeFallbacksFromFile(filePath: string): number {
  let content = fs.readFileSync(filePath, 'utf-8');
  const originalContent = content;
  
  // Patrón para encontrar t('key', { fallback: 'value' })
  const patterns = [
    { 
      regex: /t\((['"][^'"]+['"])\s*,\s*\{\s*fallback:\s*['"][^'"]*['"]\s*\}/g,
      replacement: 't($1)'
    },
    { 
      regex: /t\((['"][^'"]+['"])\s*,\s*\{\s*fallback:\s*`[^`]*`\s*\}/g,
      replacement: 't($1)'
    },
  ];
  
  let replacements = 0;
  
  patterns.forEach(({ regex, replacement }) => {
    const matches = content.match(regex);
    if (matches) {
      replacements += matches.length;
      content = content.replace(regex, replacement);
    }
  });
  
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf-8');
  }
  
  return replacements;
}

/**
 * Main
 */
function main() {
  console.log('🧹 FASE 3: Eliminación de fallbacks\n');
  
  const srcDir = path.join(__dirname, '..');
  const files = getAllFiles(srcDir);
  
  console.log(`📁 Procesando ${files.length} archivos...\n`);
  
  let totalReplacements = 0;
  let filesModified = 0;
  
  files.forEach(file => {
    const replacements = removeFallbacksFromFile(file);
    if (replacements > 0) {
      totalReplacements += replacements;
      filesModified++;
      console.log(`  ✅ ${path.relative(srcDir, file)}: ${replacements} fallbacks eliminados`);
    }
  });
  
  console.log('\n✅ FASE 3 COMPLETADA');
  console.log(`\n📊 Resumen:`);
  console.log(`  - Archivos modificados: ${filesModified}`);
  console.log(`  - Fallbacks eliminados: ${totalReplacements}`);
  console.log(`\n🎉 El código ahora usa solo traducciones del sistema!`);
}

main();
