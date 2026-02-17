import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Sincronizador agresivo de sesión frontend-backend
 * Detecta y corrige desincronizaciones automáticamente
 */

interface SyncResult {
  synchronized: boolean;
  error?: string;
  userId?: string;
}

/**
 * Detecta desincronización comparando estado frontend vs backend
 */
export const detectDesynchronization = async (): Promise<boolean> => {
  try {
    console.log('🔍 [SYNC] Detectando desincronización frontend-backend...');
    
    // Obtener sesión del frontend
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      console.log('📝 [SYNC] No hay sesión en frontend');
      return false; // No hay desincronización si no hay sesión
    }
    
    // LESS AGGRESSIVE: Solo detectar desincronización si hay un error explícito de RLS
    // No forzar recovery en casos ambiguos para evitar logouts innecesarios
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', session.user.id)
        .limit(1);
      
      // Solo considerar desincronización si hay error explícito de RLS Y no hay datos
      if (error && !data && 
          (error.message.includes('row-level security') || 
           error.message.includes('RLS') || 
           error.message.includes('policy'))) {
        console.warn('⚠️ [SYNC] Posible desincronización detectada');
        return true;
      }
      
      // Si hay datos o no hay error, consideramos sincronizado
      console.log('✅ [SYNC] Frontend y backend sincronizados correctamente');
      return false;
      
    } catch (testError) {
      // NO asumir desincronización en caso de error de red u otros
      // Esto evita logouts innecesarios por problemas temporales
      console.warn('⚠️ [SYNC] Error en test de sincronización (ignorando):', testError);
      return false; // NO asumir desincronización
    }
    
  } catch (error) {
    console.error('❌ [SYNC] Error detectando desincronización:', error);
    return false; // NO asumir desincronización en caso de error
  }
};

/**
 * Fuerza la resincronización frontend-backend
 */
export const forceSynchronization = async (): Promise<SyncResult> => {
  try {
    console.log('🔄 [SYNC] Iniciando resincronización forzada...');
    
    // PASO 1: Obtener sesión actual
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      return {
        synchronized: false,
        error: 'No hay sesión activa para sincronizar'
      };
    }
    
    // PASO 2: Forzar refresh de token para resincronizar
    console.log('🔄 [SYNC] Refrescando token para resincronización...');
    const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
    
    if (refreshError || !refreshData.session) {
      console.error('❌ [SYNC] Error en refresh durante sincronización:', refreshError);
      return {
        synchronized: false,
        error: 'Error al refrescar sesión para sincronización'
      };
    }
    
    // PASO 3: Esperar sincronización
    console.log('⏳ [SYNC] Esperando sincronización...');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // PASO 4: Verificar sincronización
    try {
      const { data: testData, error: testError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', refreshData.session.user.id)
        .limit(1);
      
      if (testError && (testError.message.includes('row-level security') || 
                       testError.message.includes('RLS'))) {
        console.error('❌ [SYNC] Sincronización falló, auth.uid() sigue siendo null');
        return {
          synchronized: false,
          error: 'No se pudo sincronizar auth.uid() con la sesión'
        };
      }
      
      console.log('✅ [SYNC] Sincronización exitosa');
      return {
        synchronized: true,
        userId: refreshData.session.user.id
      };
      
    } catch (verifyError) {
      console.error('❌ [SYNC] Error verificando sincronización:', verifyError);
      return {
        synchronized: false,
        error: 'Error verificando sincronización'
      };
    }
    
  } catch (error) {
    console.error('❌ [SYNC] Error crítico en resincronización:', error);
    return {
      synchronized: false,
      error: `Error crítico: ${error instanceof Error ? error.message : 'Error desconocido'}`
    };
  }
};

/**
 * Monitor continuo de sincronización (para casos críticos)
 */
export const monitorSynchronization = (
  onDesync: () => void,
  intervalMs: number = 30000 // 30 segundos por defecto
): () => void => {
  console.log('📡 [SYNC] Iniciando monitor de sincronización...');
  
  const interval = setInterval(async () => {
    const isDesynchronized = await detectDesynchronization();
    
    if (isDesynchronized) {
      console.warn('⚠️ [SYNC] Monitor detectó desincronización');
      onDesync();
    }
  }, intervalMs);
  
  // Retornar función de limpieza
  return () => {
    console.log('🛑 [SYNC] Deteniendo monitor de sincronización');
    clearInterval(interval);
  };
};

/**
 * Recovery automático con notificación al usuario
 */
export const autoRecovery = async (): Promise<boolean> => {
  try {
    console.log('🚑 [SYNC] Iniciando recovery automático...');
    
    // Detectar si hay desincronización
    const isDesync = await detectDesynchronization();
    
    if (!isDesync) {
      console.log('✅ [SYNC] No hay desincronización, recovery no necesario');
      return true;
    }
    
    // Mostrar notificación al usuario
    const toastId = toast.loading('Resynchronizing session...', {
      description: 'Session issue detected, attempting automatic fix'
    });
    
    // Intentar resincronización
    const syncResult = await forceSynchronization();
    
    if (syncResult.synchronized) {
      toast.success('Session resynchronized successfully', {
        id: toastId,
        description: 'The application is ready to continue'
      });
      return true;
    } else {
      toast.error('Could not resynchronize session', {
        id: toastId,
        description: 'Please reload the page and sign in again'
      });
      return false;
    }
    
  } catch (error) {
    console.error('❌ [SYNC] Error en recovery automático:', error);
    toast.error('Automatic recovery error', {
      description: 'Please reload the page and sign in again'
    });
    return false;
  }
};