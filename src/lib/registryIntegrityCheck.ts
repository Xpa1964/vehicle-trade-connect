/**
 * Registry Integrity Check (Development Only)
 * 
 * Validates the entire STATIC_IMAGE_REGISTRY on app boot.
 * Outputs a single grouped warning if errors exist.
 * 
 * Runs ONLY in development mode - silent in production.
 */

import { 
  STATIC_IMAGE_REGISTRY, 
  validateRegistry, 
  getRegistryStats,
  isProductImagePath
} from '@/config/staticImageRegistry';

const isDev = import.meta.env.DEV;

interface IntegrityReport {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  stats: ReturnType<typeof getRegistryStats>;
  missingPaths: string[];
  duplicatePaths: string[];
}

/**
 * Check if an image path exists (best-effort for public assets)
 */
const checkPathExists = async (path: string): Promise<boolean> => {
  // Skip src/assets paths - these are bundled and can't be checked via fetch
  if (path.startsWith('src/assets/')) {
    return true; // Assume valid, will fail at build time if missing
  }

  try {
    const response = await fetch(path, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
};

/**
 * Run comprehensive registry validation
 */
export const runIntegrityCheck = async (): Promise<IntegrityReport> => {
  const errors: string[] = [];
  const warnings: string[] = [];
  const missingPaths: string[] = [];
  const pathMap = new Map<string, string[]>();

  const entries = Object.entries(STATIC_IMAGE_REGISTRY);
  const stats = getRegistryStats();

  // 1. Basic validation from registry
  const basicValidation = validateRegistry();
  errors.push(...basicValidation.errors);

  // 2. Check for duplicate paths
  entries.forEach(([key, entry]) => {
    const existing = pathMap.get(entry.currentPath) || [];
    existing.push(key);
    pathMap.set(entry.currentPath, existing);
  });

  const duplicatePaths: string[] = [];
  pathMap.forEach((keys, path) => {
    if (keys.length > 1) {
      duplicatePaths.push(path);
      warnings.push(`Duplicate path "${path}" used by: ${keys.join(', ')}`);
    }
  });

  // 3. Validate required fields
  entries.forEach(([key, entry]) => {
    if (!entry.id) errors.push(`[${key}] Missing required field: id`);
    if (!entry.currentPath) errors.push(`[${key}] Missing required field: currentPath`);
    if (!entry.usage) warnings.push(`[${key}] Missing recommended field: usage`);
    if (!entry.purpose) warnings.push(`[${key}] Missing recommended field: purpose`);
    if (entry.source !== 'product') errors.push(`[${key}] Invalid source (must be 'product')`);
  });

  // 4. Check path patterns
  entries.forEach(([key, entry]) => {
    // Validate path format
    if (!entry.currentPath.startsWith('/') && !entry.currentPath.startsWith('src/')) {
      warnings.push(`[${key}] Path should start with '/' or 'src/': ${entry.currentPath}`);
    }

    // Check for user-content patterns
    if (!isProductImagePath(entry.currentPath)) {
      errors.push(`[${key}] User-content path detected: ${entry.currentPath}`);
    }
  });

  // 5. Async: Check if public paths exist (skip in strict mode for performance)
  if (isDev) {
    const publicPaths = entries
      .filter(([, entry]) => !entry.currentPath.startsWith('src/'))
      .slice(0, 10); // Check first 10 only to avoid too many requests

    for (const [key, entry] of publicPaths) {
      const exists = await checkPathExists(entry.currentPath);
      if (!exists) {
        missingPaths.push(entry.currentPath);
        warnings.push(`[${key}] Path may not exist: ${entry.currentPath}`);
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    stats,
    missingPaths,
    duplicatePaths
  };
};

/**
 * Log integrity report to console (dev only, grouped)
 */
const logReport = (report: IntegrityReport): void => {
  if (!isDev) return;

  const hasIssues = report.errors.length > 0 || report.warnings.length > 0;

  if (!hasIssues) {
    console.log(
      '%c✅ [StaticImageRegistry] Integrity check passed',
      'color: #22c55e; font-weight: bold;',
      `| ${report.stats.total} images | ${report.stats.critical} critical`
    );
    return;
  }

  // Group all output into one collapsed console group
  console.groupCollapsed(
    `%c⚠️ [StaticImageRegistry] Integrity check: ${report.errors.length} errors, ${report.warnings.length} warnings`,
    'color: #f59e0b; font-weight: bold;'
  );

  // Stats summary
  console.log('📊 Registry Stats:', report.stats);

  // Errors (if any)
  if (report.errors.length > 0) {
    console.error('❌ Errors:');
    report.errors.forEach(e => console.error(`   ${e}`));
  }

  // Warnings (if any)
  if (report.warnings.length > 0) {
    console.warn('⚠️ Warnings:');
    report.warnings.forEach(w => console.warn(`   ${w}`));
  }

  // Missing paths
  if (report.missingPaths.length > 0) {
    console.warn('📁 Potentially missing files:', report.missingPaths);
  }

  // Duplicates
  if (report.duplicatePaths.length > 0) {
    console.info('🔄 Duplicate paths (may be intentional):', report.duplicatePaths);
  }

  console.groupEnd();
};

/**
 * Initialize registry integrity check on app boot
 * Call this once in main.tsx or App.tsx
 */
export const initRegistryIntegrityCheck = (): void => {
  if (!isDev) return;

  // Run async check after a brief delay to not block initial render
  setTimeout(async () => {
    try {
      const report = await runIntegrityCheck();
      logReport(report);
    } catch (error) {
      console.error('[StaticImageRegistry] Integrity check failed:', error);
    }
  }, 1000);
};

export type { IntegrityReport };
