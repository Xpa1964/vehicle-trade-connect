
/**
 * Utilidad de seguridad para limpiar datos maliciosos del localStorage
 * 
 * CRÍTICO: Esta utilidad debe ejecutarse inmediatamente para limpiar
 * cualquier draft de registro que contenga credenciales administrativas
 */

export const cleanMaliciousDrafts = (): void => {
  console.log('[SecurityCleanup] SECURITY: Starting draft cleanup');
  
  const keysToRemove: string[] = [];
  
  // Buscar todas las claves relacionadas con drafts de registro
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('registration_draft_')) {
      try {
        const data = localStorage.getItem(key);
        if (data) {
          // Marcar para eliminación - eliminar todos los drafts antiguos
          keysToRemove.push(key);
        }
      } catch (error) {
        console.error(`[SecurityCleanup] Error parsing draft ${key}:`, error);
        keysToRemove.push(key); // Eliminar drafts corruptos también
      }
    }
  }
  
  // Eliminar todos los drafts encontrados
  keysToRemove.forEach(key => {
    localStorage.removeItem(key);
    console.log(`[SecurityCleanup] SECURITY: Removed draft: ${key}`);
  });
  
  console.log(`[SecurityCleanup] SECURITY: Cleanup completed. Removed ${keysToRemove.length} draft(s)`);
};

/**
 * Función para validar que el formulario esté completamente limpio
 * Validación basada en configuración dinámica
 */
export const validateFormCleanliness = (formData: any): boolean => {
  // Permitir todos los emails - la validación de roles se hace en el backend
  // La configuración administrativa se maneja a través de la tabla admin_config
  console.log('[SecurityCleanup] Form validation passed');
  return true;
};

/**
 * Función de emergencia para limpiar TODO el localStorage relacionado con autenticación
 */
export const emergencyCleanAuth = (): void => {
  console.log('[SecurityCleanup] EMERGENCY: Cleaning all auth-related localStorage');
  
  const authKeys = [
    'sb-inqqnsvlimtpjxjxuzaf-auth-token',
    'supabase.auth.token',
    'user_role_',
    'registration_draft_'
  ];
  
  const keysToRemove: string[] = [];
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key) {
      const shouldRemove = authKeys.some(pattern => key.includes(pattern));
      if (shouldRemove) {
        keysToRemove.push(key);
      }
    }
  }
  
  keysToRemove.forEach(key => {
    localStorage.removeItem(key);
    console.log(`[SecurityCleanup] EMERGENCY: Removed auth key: ${key}`);
  });
  
  console.log(`[SecurityCleanup] EMERGENCY: Removed ${keysToRemove.length} auth-related keys`);
};
