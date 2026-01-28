import { supabase } from '@/integrations/supabase/client';
import { 
  analyzeCodeBase, 
  getMissingCriticalTests, 
  getTestingStrategy, 
  generateDynamicRoadmap 
} from './codeAnalyzer';
import { analyzeSecurityReal, generateSecurityRecommendations } from './securityAuditAnalyzer';
import { analyzeUXReal } from './uxAuditAnalyzer';

export interface SecurityFinding {
  priority: 'P0 - Crítico' | 'P1 - Alto' | 'P2 - Medio' | 'P3 - Bajo';
  finding: string;
  location: string;
  risk: string;
  status: string;
}

export interface UIUXIssue {
  priority: 'P1 - Alto' | 'P2 - Medio' | 'P3 - Bajo';
  problem: string;
  component: string;
  impact: string;
}

export interface QAIssue {
  priority: 'P0 - CRÍTICO' | 'P1 - Alto' | 'P2 - Medio' | 'P3 - Bajo';
  problem: string;
  impact: string;
  coverage: string;
}

export interface AuditData {
  metadata: {
    generatedAt: string;
    version: string;
    status: 'Good' | 'Warning' | 'Critical';
  };
  scores: {
    security: number;
    uiux: number;
    qa: number;
    accessibility: number;
    total: number;
  };
  security: {
    strengths: Array<{ area: string; description: string; impact: string }>;
    vulnerabilities: SecurityFinding[];
    recommendations: string[];
  };
  uiux: {
    strengths: Array<{ area: string; description: string; rating: number }>;
    weaknesses: UIUXIssue[];
    recommendations: string[];
  };
  qa: {
    strengths: Array<{ area: string; tool: string; status: string }>;
    weaknesses: QAIssue[];
    recommendations: string[];
    missingCriticalTests: string[];
    testingStrategy: {
      immediate: { title: string; subtitle: string; items: string[]; color: string };
      high: { title: string; subtitle: string; items: string[]; color: string };
      medium: { title: string; subtitle: string; items: string[]; color: string };
    };
  };
  roadmap: Array<{
    title: string;
    timeframe: string;
    priority: 'urgent' | 'high' | 'medium' | 'low';
    tasks: string[];
  }>;
  metrics: {
    totalUsers: number;
    totalVehicles: number;
    totalConversations: number;
    responseTime: number;
  };
}

export const generateAuditData = async (): Promise<AuditData> => {
  // Fetch real metrics from Supabase
  const { count: totalUsers } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true });

  const { count: totalVehicles } = await supabase
    .from('vehicles')
    .select('*', { count: 'exact', head: true });

  const { count: totalConversations } = await supabase
    .from('conversations')
    .select('*', { count: 'exact', head: true });

  // Analyze codebase for real QA metrics
  const codeAnalysis = analyzeCodeBase();

  // Calculate dynamic scores based on real data
  const qaScore = Math.min(100, Math.round(
    (codeAnalysis.coveragePercentage * 0.5) + // Coverage weight: 50%
    (codeAnalysis.hasUnitTests ? 20 : 0) +     // Unit tests: 20%
    (codeAnalysis.hasIntegrationTests ? 15 : 0) + // Integration: 15%
    (codeAnalysis.hasE2ETests ? 15 : 0)        // E2E tests: 15%
  ));

  const accessibilityScore = Math.min(100, Math.round(
    (codeAnalysis.accessibilityAttributes / 300) * 100 // 300 is target
  ));

  // Dynamic security analysis using Supabase Linter
  const securityAnalysis = await analyzeSecurityReal();
  const securityScore = securityAnalysis.securityScore;
  
  // Dynamic UI/UX analysis using runtime detection
  const uxAnalysis = analyzeUXReal();
  const uiuxScore = uxAnalysis.score;

  const totalScore = Math.round(
    (securityScore * 0.3) + 
    (uiuxScore * 0.25) + 
    (qaScore * 0.3) + 
    (accessibilityScore * 0.15)
  );

  // Determine status based on total score
  let status: 'Good' | 'Warning' | 'Critical' = 'Warning';
  if (totalScore >= 80) status = 'Good';
  if (totalScore < 50) status = 'Critical';

  return {
    metadata: {
      generatedAt: new Date().toISOString(),
      version: '2.0.0', // Updated version for real analysis
      status
    },
    scores: {
      security: securityScore,
      uiux: uiuxScore,
      qa: qaScore,
      accessibility: accessibilityScore,
      total: totalScore
    },
    security: {
      strengths: [
        { area: 'Autenticación', description: 'Sistema JWT con Supabase Auth implementado', impact: 'Alto' },
        { area: 'File Upload', description: 'Edge function con validación, rate limiting y sanitización', impact: 'Alto' },
        { area: 'RLS Policies', description: '30+ tablas con Row Level Security habilitada', impact: 'Alto' },
        { area: 'Input Validation', description: 'Uso de Zod para validación de formularios', impact: 'Medio' },
        { area: 'Audit Logging', description: 'Sistema de activity_logs implementado', impact: 'Medio' },
        { area: 'Password Security', description: 'Generación segura de contraseñas con validación', impact: 'Medio' }
      ],
      // Dynamic vulnerabilities from real Supabase Linter analysis
      vulnerabilities: securityAnalysis.vulnerabilities,
      // Dynamic recommendations based on actual findings
      recommendations: generateSecurityRecommendations(securityAnalysis)
    },
    uiux: {
      strengths: uxAnalysis.strengths,
      weaknesses: uxAnalysis.weaknesses,
      recommendations: uxAnalysis.recommendations
    },
    qa: {
      strengths: [
        { area: 'Testing Framework', tool: 'Vitest + @testing-library/react', status: '✅ Instalado' },
        { area: 'Type Safety', tool: 'TypeScript en todo el proyecto', status: '✅ Implementado' },
        { area: 'Code Quality', tool: 'ESLint configurado', status: '✅ Activo' },
        { area: 'Error Boundaries', tool: 'ErrorBoundary en App root', status: '✅ Implementado' },
        { area: 'React Query', tool: 'TanStack Query para data fetching', status: '✅ Implementado' },
        { area: 'Form Validation', tool: 'React Hook Form + Zod', status: '✅ Implementado' },
        { area: 'Checkpoints', tool: 'Sistema de rollback implementado', status: '✅ Único y robusto' }
      ],
      weaknesses: [
        // Dynamic weaknesses based on real analysis
        ...(codeAnalysis.coveragePercentage < 60 ? [{
          priority: 'P0 - CRÍTICO' as const,
          problem: `${codeAnalysis.coveragePercentage.toFixed(1)}% test coverage (objetivo: 60%)`,
          impact: 'Muy Alto',
          coverage: `${codeAnalysis.coveragePercentage.toFixed(1)}%`
        }] : []),
        ...(!codeAnalysis.hasUnitTests ? [{
          priority: 'P1 - Alto' as const,
          problem: `Solo ${codeAnalysis.testFiles} archivo(s) de test encontrado(s)`,
          impact: 'Alto',
          coverage: `${codeAnalysis.testFiles}/${codeAnalysis.totalComponents} componentes`
        }] : []),
        ...(!codeAnalysis.hasIntegrationTests ? [{
          priority: 'P1 - Alto' as const,
          problem: 'Sin tests de integración',
          impact: 'Alto',
          coverage: '0%'
        }] : []),
        ...(!codeAnalysis.hasE2ETests ? [{
          priority: 'P1 - Alto' as const,
          problem: 'Sin tests E2E',
          impact: 'Alto',
          coverage: '0%'
        }] : []),
        ...(codeAnalysis.consoleStatements > 100 ? [{
          priority: 'P2 - Medio' as const,
          problem: `${codeAnalysis.consoleStatements.toLocaleString()} console statements en código`,
          impact: 'Medio',
          coverage: 'N/A'
        }] : []),
        {
          priority: 'P2 - Medio',
          problem: 'Sin CI/CD pipeline visible',
          impact: 'Medio',
          coverage: 'N/A'
        }
      ],
      recommendations: [
        // Dynamic recommendations based on analysis
        ...(codeAnalysis.coveragePercentage < 60 ? [
          `URGENTE: Aumentar coverage de ${codeAnalysis.coveragePercentage.toFixed(1)}% a 60% mínimo`
        ] : []),
        ...(codeAnalysis.testFiles < 10 ? [
          `URGENTE: Crear tests para componentes críticos (actual: ${codeAnalysis.testFiles} archivos)`
        ] : []),
        'Alta: Configurar GitHub Actions CI/CD con tests automáticos',
        'Alta: Implementar pre-commit hooks con tests',
        ...(codeAnalysis.consoleStatements > 1000 ? [
          `Alta: Eliminar ${codeAnalysis.consoleStatements.toLocaleString()} console.log de producción`
        ] : []),
        'Media: Implementar Storybook para documentación de componentes',
        'Media: Agregar tests de performance con Lighthouse CI'
      ],
      missingCriticalTests: getMissingCriticalTests(),
      testingStrategy: getTestingStrategy()
    },
    roadmap: generateDynamicRoadmap(codeAnalysis.coveragePercentage),
    metrics: {
      totalUsers: totalUsers || 0,
      totalVehicles: totalVehicles || 0,
      totalConversations: totalConversations || 0,
      responseTime: 4.2
    }
  };
};
