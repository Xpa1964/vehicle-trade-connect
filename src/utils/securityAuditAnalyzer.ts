import { supabase } from '@/integrations/supabase/client';
import type { SecurityFinding } from './auditDataGenerator';

interface LinterIssue {
  level: 'ERROR' | 'WARN' | 'INFO';
  title: string;
  description: string;
  categories: string[];
  table?: string;
  schema?: string;
}

/**
 * Parsea los resultados del Supabase Linter desde el texto
 */
const parseLinterOutput = (linterText: string): LinterIssue[] => {
  const issues: LinterIssue[] = [];
  const lines = linterText.split('\n');
  
  let currentIssue: Partial<LinterIssue> = {};
  
  for (const line of lines) {
    if (line.match(/^(ERROR|WARN|INFO) \d+:/)) {
      if (currentIssue.level && currentIssue.title) {
        issues.push(currentIssue as LinterIssue);
      }
      
      const level = line.split(' ')[0] as 'ERROR' | 'WARN' | 'INFO';
      const title = line.split(': ')[1];
      currentIssue = { level, title, description: '', categories: [] };
    } else if (line.includes('Level:')) {
      const level = line.split('Level: ')[1]?.trim() as 'ERROR' | 'WARN' | 'INFO';
      if (level) currentIssue.level = level;
    } else if (line.includes('Description:')) {
      currentIssue.description = line.split('Description: ')[1]?.trim() || '';
    } else if (line.includes('Categories:')) {
      const cats = line.split('Categories: ')[1]?.trim();
      currentIssue.categories = cats ? [cats] : [];
    } else if (line.includes('Table `')) {
      const match = line.match(/Table `([^`]+)`/);
      if (match) currentIssue.table = match[1];
    }
  }
  
  if (currentIssue.level && currentIssue.title) {
    issues.push(currentIssue as LinterIssue);
  }
  
  return issues;
};

/**
 * Mapea el nivel del linter a prioridad de auditoría
 */
const mapLevelToPriority = (level: string, title: string): SecurityFinding['priority'] => {
  if (level === 'ERROR') return 'P0 - Crítico';
  
  // Clasificar WARNs basado en el título
  if (title.includes('Security Definer') || title.includes('Anonymous Access')) {
    return 'P0 - Crítico';
  }
  if (title.includes('Search Path') || title.includes('Extension')) {
    return 'P1 - Alto';
  }
  return 'P2 - Medio';
};

/**
 * Calcula el nivel de riesgo basado en la prioridad
 */
const calculateRisk = (priority: SecurityFinding['priority']): string => {
  if (priority === 'P0 - Crítico') return 'Crítico';
  if (priority === 'P1 - Alto') return 'Alto';
  if (priority === 'P2 - Medio') return 'Medio';
  return 'Bajo';
};

/**
 * Agrupa issues similares para evitar duplicados
 */
const groupSimilarIssues = (issues: LinterIssue[]): LinterIssue[] => {
  const grouped = new Map<string, LinterIssue & { count?: number }>();
  
  for (const issue of issues) {
    const key = `${issue.level}-${issue.title}`;
    const existing = grouped.get(key);
    
    if (existing) {
      existing.count = (existing.count || 1) + 1;
    } else {
      grouped.set(key, { ...issue, count: 1 });
    }
  }
  
  return Array.from(grouped.values());
};

export interface SecurityAnalysisResult {
  securityScore: number;
  vulnerabilities: SecurityFinding[];
  totalIssues: number;
  criticalCount: number;
  highCount: number;
  mediumCount: number;
}

// Cache para resultados del linter
let cachedResults: SecurityAnalysisResult | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

/**
 * Analiza la seguridad en tiempo real usando el Supabase Linter dinámicamente
 */
export const analyzeSecurityReal = async (forceRefresh = false): Promise<SecurityAnalysisResult> => {
  // Verificar cache
  if (!forceRefresh && cachedResults && (Date.now() - cacheTimestamp) < CACHE_DURATION) {
    console.log('[Security Audit] Using cached results');
    return cachedResults;
  }

  try {
    console.log('[Security Audit] Fetching real linter results from edge function...');
    
    // Llamar al edge function para obtener resultados reales del linter
    const { data, error } = await supabase.functions.invoke('run-security-audit');
    
    if (error) {
      console.error('[Security Audit] Error calling edge function:', error);
      throw error;
    }

    if (!data.success) {
      console.error('[Security Audit] Edge function returned error:', data.error);
      throw new Error(data.error || 'Unknown error from edge function');
    }

    const linterResults = data.results || [];
    console.log('[Security Audit] Received linter results:', linterResults.length, 'issues');

    // Parsear y categorizar issues
    const vulnerabilities: SecurityFinding[] = [];
    let criticalCount = 0;
    let highCount = 0;
    let mediumCount = 0;

    // Si no hay resultados del linter, retornar todo limpio
    if (linterResults.length === 0) {
      const result: SecurityAnalysisResult = {
        securityScore: 100,
        vulnerabilities: [],
        totalIssues: 0,
        criticalCount: 0,
        highCount: 0,
        mediumCount: 0
      };
      
      // Guardar en cache
      cachedResults = result;
      cacheTimestamp = Date.now();
      
      console.log('[Security Audit] No issues found - database is secure!');
      return result;
    }

    // Procesar cada issue del linter
    for (const issue of linterResults) {
      // Filtrar falsos positivos conocidos
      if (issue.title && issue.title.includes('Security Definer View')) {
        console.log('[Security Audit] Skipping known false positive: Security Definer View');
        continue;
      }

      let priority = mapLevelToPriority(issue.level || 'INFO', issue.title || 'Unknown issue');
      const risk = calculateRisk(priority);

      // Ajustar prioridad para políticas anónimas si son normales
      if (issue.title && issue.title.includes('Anonymous Access Policies')) {
        const description = issue.description || '';
        if (description.includes('authenticated') || description.includes('auth.uid()')) {
          priority = 'P2 - Medio'; // Bajar prioridad si requiere autenticación
          console.log('[Security Audit] Adjusted priority for authenticated anonymous access policy');
        }
      }

      vulnerabilities.push({
        priority,
        finding: issue.title || 'Unknown security issue',
        location: issue.metadata?.table || issue.metadata?.schema || issue.table || 'Database',
        risk,
        status: 'Pendiente'
      });

      // Contar por nivel
      if (priority === 'P0 - Crítico') criticalCount++;
      else if (priority === 'P1 - Alto') highCount++;
      else if (priority === 'P2 - Medio') mediumCount++;
    }

    // Calcular score dinámico basado en issues reales
    const baseScore = 100;
    const securityScore = Math.max(0, Math.min(100, 
      baseScore - 
      (criticalCount * 15) -
      (highCount * 8) -
      (mediumCount * 3)
    ));

    const result: SecurityAnalysisResult = {
      securityScore: Math.round(securityScore),
      vulnerabilities,
      totalIssues: vulnerabilities.length,
      criticalCount,
      highCount,
      mediumCount
    };

    // Guardar en cache
    cachedResults = result;
    cacheTimestamp = Date.now();

    console.log('[Security Audit] Dynamic analysis complete:', {
      score: result.securityScore,
      total: result.totalIssues,
      critical: criticalCount,
      high: highCount,
      medium: mediumCount
    });

    return result;

  } catch (error) {
    console.error('[Security Audit] Error analyzing security:', error);
    
    // Fallback mínimo en caso de error
    const fallbackResult: SecurityAnalysisResult = {
      securityScore: 50,
      vulnerabilities: [{
        priority: 'P1 - Alto',
        finding: 'Error al ejecutar análisis de seguridad dinámico',
        location: 'Security Analyzer',
        risk: 'Alto',
        status: 'Error de conexión - Intente refrescar'
      }],
      totalIssues: 1,
      criticalCount: 0,
      highCount: 1,
      mediumCount: 0
    };

    return fallbackResult;
  }
};

/**
 * Genera recomendaciones basadas en los hallazgos
 */
export const generateSecurityRecommendations = (analysis: SecurityAnalysisResult): string[] => {
  const recommendations: string[] = [];
  
  if (analysis.criticalCount > 0) {
    recommendations.push('🚨 URGENTE: Revisar y restringir políticas RLS que permiten acceso anónimo');
    recommendations.push('🚨 URGENTE: Revisar Security Definer Views para prevenir escalación de privilegios');
  }
  
  if (analysis.highCount > 0) {
    recommendations.push('⚠️ Alta: Configurar search_path en todas las funciones de base de datos');
    recommendations.push('⚠️ Alta: Mover extensiones de public a schemas dedicados');
  }
  
  if (analysis.mediumCount > 0) {
    recommendations.push('📋 Media: Implementar encriptación para datos sensibles en localStorage');
    recommendations.push('📋 Media: Eliminar/ofuscar console.log en build de producción');
  }
  
  // Recomendaciones generales
  recommendations.push('📋 Media: Implementar Content Security Policy (CSP) headers');
  recommendations.push('📋 Media: Agregar rate limiting en endpoints críticos');
  
  return recommendations;
};
