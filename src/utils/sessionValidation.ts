import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SessionValidationResult {
  isValid: boolean;
  userId: string | null;
  error?: string;
}

/**
 * Valida agresivamente la sesión con verificación de JWT y sincronización frontend-backend
 */
export const validateUserSession = async (): Promise<SessionValidationResult> => {
  try {
    console.log('🔐 [SESSION] Iniciando validación agresiva de sesión...');
    
    // FASE 1: Verificación de sesión y JWT
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('❌ [SESSION] Error obteniendo sesión:', sessionError);
      return {
        isValid: false,
        userId: null,
        error: `Error de sesión: ${sessionError.message}`
      };
    }

    if (!session) {
      console.error('❌ [SESSION] No hay sesión activa');
      return {
        isValid: false,
        userId: null,
        error: 'No hay sesión activa'
      };
    }

    if (!session.user) {
      console.error('❌ [SESSION] Sesión sin usuario');
      return {
        isValid: false,
        userId: null,
        error: 'Sesión inválida: usuario no encontrado'
      };
    }

    // FASE 2: Validación agresiva del JWT
    const now = Math.floor(Date.now() / 1000);
    const tokenExpiryBuffer = 300; // 5 minutos de buffer

    if (session.expires_at && session.expires_at < (now + tokenExpiryBuffer)) {
      console.warn('⚠️ [SESSION] Token próximo a expirar o expirado, refrescando...');
      
      const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
      
      if (refreshError || !refreshData.session) {
        console.error('❌ [SESSION] Error al refrescar token:', refreshError);
        // Forzar limpieza de sesión corrupta
        await supabase.auth.signOut();
        return {
          isValid: false,
          userId: null,
          error: 'Sesión expirada y no se pudo renovar. Por favor, inicia sesión nuevamente.'
        };
      }
      
      
      // Actualizar session con los nuevos datos
      session.access_token = refreshData.session.access_token;
      session.refresh_token = refreshData.session.refresh_token;
      session.expires_at = refreshData.session.expires_at;
    }

    // FASE 3: Verificación crítica de auth.uid() en base de datos
    
    
    // Primer intento con una query que REQUIERE auth.uid() válido
    let authTest;
    let authError;
    
    try {
      const result = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', session.user.id)
        .limit(1);
      
      authTest = result.data;
      authError = result.error;
    } catch (testError) {
      authError = testError;
    }

    if (authError) {
      console.error('[SESSION] Error verifying auth.uid():', authError);
      
      // Detectar específicamente problemas de RLS que indican auth.uid() = null
      if (authError.message.includes('row-level security') || 
          authError.message.includes('RLS') ||
          authError.message.includes('policy')) {
        
        
        
        // FASE 4: Intento de recovery agresivo
        try {
          // Forzar reautenticación completa
          await supabase.auth.refreshSession();
          
          // Esperar un momento para que se sincronice
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Segundo intento de verificación
          const { data: retryTest, error: retryError } = await supabase
            .from('profiles')
            .select('id')
            .eq('user_id', session.user.id)
            .limit(1);
          
          if (retryError) {
            console.error('[SESSION] Recovery failed, auth.uid() still null');
            return {
              isValid: false,
              userId: null,
              error: 'Sesión desincronizada: auth.uid() retorna null. Recarga la página e inicia sesión nuevamente.'
            };
          }
          
          
          
        } catch (recoveryError) {
          console.error('[SESSION] Recovery error:', recoveryError);
          return {
            isValid: false,
            userId: null,
            error: 'Sesión anónima detectada: auth.uid() retorna null'
          };
        }
      } else {
        return {
          isValid: false,
          userId: null,
          error: `Error de autenticación: ${authError.message}`
        };
      }
    }

    // FASE 5: Validación final de consistencia
    
    
    // Verificar que el usuario en sesión coincide con el auth.uid()
    if (!authTest || authTest.length === 0) {
      console.error('[SESSION] User not found in database');
      return {
        isValid: false,
        userId: null,
        error: 'Usuario no encontrado en base de datos'
      };
    }


    return {
      isValid: true,
      userId: session.user.id
    };

  } catch (error) {
    console.error('[SESSION] Critical validation error:', error);
    return {
      isValid: false,
      userId: null,
      error: `Error crítico: ${error instanceof Error ? error.message : 'Error desconocido'}`
    };
  }
};

/**
 * Interceptor pre-operación que garantiza sesión válida antes de operaciones críticas
 */
export const ensureValidSession = async (): Promise<boolean> => {
  try {
    
    
    const validation = await validateUserSession();
    
    if (validation.isValid) {
      return true;
      return true;
    }

    console.warn('⚠️ [SESSION] Sesión inválida detectada, iniciando recovery automático...');
    
    // INTENTO 1: Refresh session estándar
    const { data, error } = await supabase.auth.refreshSession();
    
    if (error || !data.session) {
      console.error('❌ [SESSION] Refresh falló:', error);
      
      // INTENTO 2: Limpieza de sesión corrupta y notificación
      await supabase.auth.signOut();
      toast.error('Sesión expirada. Por favor, inicia sesión nuevamente.');
      return false;
    }

    // INTENTO 3: Validación agresiva post-refresh
    console.log('🔄 [SESSION] Revalidando después de refresh...');
    await new Promise(resolve => setTimeout(resolve, 1000)); // Dar tiempo para sincronización
    
    const revalidation = await validateUserSession();
    
    if (!revalidation.isValid) {
      console.error('❌ [SESSION] Revalidación falló después de refresh');
      toast.error('Error de sincronización de sesión. Recarga la página e inicia sesión nuevamente.');
      return false;
    }
    
    console.log('✅ [SESSION] Recovery automático exitoso');
    toast.success('Sesión restablecida automáticamente');
    return true;

  } catch (error) {
    console.error('❌ [SESSION] Error crítico en interceptor:', error);
    toast.error('Error crítico de sesión. Recarga la página.');
    return false;
  }
};

/**
 * Manejo inteligente de errores RLS con recovery automático
 */
export const handleRLSError = (error: any): string => {
  console.error('🚫 [RLS] Error de Row Level Security detectado:', error);
  
  if (error.message.includes('row-level security policy') || 
      error.message.includes('RLS') || 
      error.message.includes('policy')) {
    
    // Detectar tabla específica para mensajes contextuales
    if (error.message.includes('announcements')) {
      console.error('🚫 [RLS] Error en tabla announcements - posible auth.uid() null');
      return 'Error de permisos al crear anuncio. Tu sesión puede estar desincronizada. Recarga la página e intenta nuevamente.';
    }
    
    if (error.message.includes('announcement_attachments')) {
      console.error('🚫 [RLS] Error en tabla announcement_attachments - posible auth.uid() null');
      return 'Error de permisos al subir archivo. Tu sesión puede estar desincronizada. Recarga la página e intenta nuevamente.';
    }
    
    if (error.message.includes('profiles')) {
      console.error('🚫 [RLS] Error en tabla profiles - posible auth.uid() null');
      return 'Error de permisos de perfil. Tu sesión puede estar anónima. Recarga la página e inicia sesión nuevamente.';
    }
    
    // Error genérico de RLS
    console.error('🚫 [RLS] Error genérico de RLS - probablemente auth.uid() es null');
    return 'Error de permisos: tu sesión puede estar anónima o desincronizada. Recarga la página e inicia sesión nuevamente.';
  }
  
  // Error de autenticación general
  if (error.message.includes('unauthorized') || error.message.includes('authentication')) {
    return 'Error de autenticación. Por favor, inicia sesión nuevamente.';
  }
  
  return error.message || 'Error desconocido de base de datos';
};

/**
 * Logs detallados para debugging de sesión
 */
export const logSessionState = async (context: string) => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    const { data: { user } } = await supabase.auth.getUser();
    
    console.log(`📊 [SESSION DEBUG] ${context}:`, {
      hasSession: !!session,
      hasUser: !!user,
      userId: session?.user?.id || user?.id,
      email: session?.user?.email || user?.email,
      expiresAt: session?.expires_at,
      accessToken: session?.access_token ? 'present' : 'missing',
      refreshToken: session?.refresh_token ? 'present' : 'missing'
    });
  } catch (error) {
    console.error(`❌ [SESSION DEBUG] Error logging session state for ${context}:`, error);
  }
};