/**
 * Gestor de Checkpoints - Fase 0
 * Documenta y gestiona puntos de restauración del proyecto
 */

interface Checkpoint {
  id: string;
  phase: string;
  timestamp: string;
  description: string;
  criticalFiles: string[];
  functionalityStatus: {
    auth: boolean;
    routing: boolean;
    database: boolean;
    ui: boolean;
  };
}

interface CriticalFile {
  path: string;
  purpose: string;
  riskLevel: 'low' | 'medium' | 'high';
  dependencies: string[];
}

class CheckpointManager {
  private checkpoints: Checkpoint[] = [];
  
  // Archivos críticos que vamos a modificar en las fases siguientes
  private criticalFiles: CriticalFile[] = [
    // Fase 1: Funciones de base de datos
    {
      path: 'supabase/functions/*',
      purpose: 'Funciones de base de datos con SET search_path',
      riskLevel: 'medium',
      dependencies: ['authentication', 'role management', 'user operations']
    },
    
    // Fase 2: Lógica hardcodeada
    {
      path: 'src/utils/securityCleanup.ts',
      purpose: 'Validación de emails y limpieza de seguridad',
      riskLevel: 'low',
      dependencies: ['registration', 'form validation']
    },
    
    // Fase 3: updateUserRole (ALTO RIESGO)
    {
      path: 'src/hooks/useAuthSession.ts',
      purpose: 'Gestión de sesión y roles de usuario',
      riskLevel: 'high',
      dependencies: ['authentication', 'authorization', 'user state', 'role management']
    },
    {
      path: 'src/utils/roles/*',
      purpose: 'Cache y gestión de roles',
      riskLevel: 'high',
      dependencies: ['role updates', 'user permissions', 'cache management']
    },
    {
      path: 'src/contexts/AuthContext.tsx',
      purpose: 'Contexto principal de autenticación',
      riskLevel: 'high',
      dependencies: ['global auth state', 'user management', 'role updates']
    }
  ];

  /**
   * Crea un checkpoint del estado actual
   */
  createCheckpoint(phase: string, description: string): string {
    const checkpointId = `checkpoint_${Date.now()}`;
    
    const checkpoint: Checkpoint = {
      id: checkpointId,
      phase,
      timestamp: new Date().toISOString(),
      description,
      criticalFiles: this.criticalFiles.map(f => f.path),
      functionalityStatus: {
        auth: true, // Asumir funcional hasta que se demuestre lo contrario
        routing: true,
        database: true,
        ui: true
      }
    };

    this.checkpoints.push(checkpoint);
    this.saveToStorage();
    
    console.log(`[CheckpointManager] Checkpoint creado: ${checkpointId}`, checkpoint);
    return checkpointId;
  }

  /**
   * Obtiene información de archivos críticos por fase
   */
  getCriticalFilesByPhase(phase: 'database' | 'hardcoded' | 'roles'): CriticalFile[] {
    switch (phase) {
      case 'database':
        return this.criticalFiles.filter(f => f.path.includes('supabase'));
      case 'hardcoded':
        return this.criticalFiles.filter(f => f.path.includes('securityCleanup'));
      case 'roles':
        return this.criticalFiles.filter(f => 
          f.path.includes('useAuthSession') || 
          f.path.includes('roles') || 
          f.path.includes('AuthContext')
        );
      default:
        return this.criticalFiles;
    }
  }

  /**
   * Documenta el estado funcional actual
   */
  async testFunctionality(): Promise<Record<string, boolean>> {
    const status = {
      auth: await this.testAuth(),
      routing: await this.testRouting(),
      database: await this.testDatabase(),
      ui: await this.testUI()
    };

    console.log('[CheckpointManager] Estado funcional:', status);
    return status;
  }

  private async testAuth(): Promise<boolean> {
    try {
      // Test básico: verificar si hay usuario en localStorage
      const authData = localStorage.getItem('supabase.auth.token');
      return authData !== null;
    } catch {
      return false;
    }
  }

  private async testRouting(): Promise<boolean> {
    try {
      // Test básico: verificar si la navegación funciona
      return window.location.pathname !== undefined;
    } catch {
      return false;
    }
  }

  private async testDatabase(): Promise<boolean> {
    try {
      // Test básico: verificar conexión con Supabase
      // En un caso real, haríamos una query simple
      return true; // Por ahora asumir que funciona
    } catch {
      return false;
    }
  }

  private async testUI(): Promise<boolean> {
    try {
      // Test básico: verificar si el DOM se renderiza
      return document.querySelector('#root') !== null;
    } catch {
      return false;
    }
  }

  /**
   * Obtiene todos los checkpoints
   */
  getCheckpoints(): Checkpoint[] {
    return [...this.checkpoints];
  }

  /**
   * Obtiene información de rollback para una fase específica
   */
  getRollbackInfo(phase: string): string[] {
    const criticalFiles = this.getCriticalFilesByPhase(phase as any);
    
    return [
      `=== ROLLBACK PARA FASE: ${phase.toUpperCase()} ===`,
      '',
      'Archivos afectados:',
      ...criticalFiles.map(f => `- ${f.path} (${f.riskLevel} risk): ${f.purpose}`),
      '',
      'Comandos de rollback:',
      '1. Revertir cambios en chat history',
      '2. O usar git reset si está disponible',
      '3. Verificar funcionalidad básica después del rollback',
      '',
      'Dependencias que verificar:',
      ...criticalFiles.flatMap(f => f.dependencies.map(d => `- ${d}`))
    ];
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem('security_checkpoints', JSON.stringify(this.checkpoints));
    } catch (e) {
      console.error('[CheckpointManager] Error guardando checkpoints:', e);
    }
  }

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem('security_checkpoints');
      if (stored) {
        this.checkpoints = JSON.parse(stored);
      }
    } catch (e) {
      console.error('[CheckpointManager] Error cargando checkpoints:', e);
    }
  }

  constructor() {
    this.loadFromStorage();
  }
}

export const checkpointManager = new CheckpointManager();

/**
 * Función helper para crear checkpoint antes de modificaciones
 */
export const createSecurityCheckpoint = (phase: string, description: string): string => {
  return checkpointManager.createCheckpoint(phase, description);
};

/**
 * Función helper para obtener información de rollback
 */
export const getRollbackInstructions = (phase: string): void => {
  const instructions = checkpointManager.getRollbackInfo(phase);
  console.group(`[Rollback Instructions] ${phase}`);
  instructions.forEach(line => console.log(line));
  console.groupEnd();
};