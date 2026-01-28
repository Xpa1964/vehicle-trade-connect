
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { AppRole, Permission } from '@/types/auth';
import { reloadUserRole } from '@/utils/roles';
import { useAuth } from '@/contexts/AuthContext';
import { hasPermission, getRolePermissions } from '@/utils/roles/permissionsService';

export const useUserRole = () => {
  const { user, updateUserRole } = useAuth();
  const [isReloading, setIsReloading] = useState(false);
  const [currentRole, setCurrentRole] = useState<AppRole | null>(user?.role || null);
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  
  // Update currentRole when user role changes
  useEffect(() => {
    if (user?.role) {
      console.log('[useUserRole] User role updated from Auth context:', user.role);
      setCurrentRole(user.role);
      
      // Update permissions based on the role
      const rolePermissions = getRolePermissions(user.role);
      setPermissions(rolePermissions);
      console.log('[useUserRole] Permissions updated:', rolePermissions);
    }
  }, [user?.role]);
  
  // Function to check if the user has a specific permission
  const checkPermission = (permission: Permission): boolean => {
    if (!currentRole) return false;
    return hasPermission(currentRole, permission);
  };
  
  // Function to reload the role using the reloadUserRole utility
  const handleRoleReload = async () => {
    if (!user?.id) {
      toast.error("No se pudo identificar el usuario actual");
      return;
    }
    
    setIsReloading(true);
    try {
      console.log('[useUserRole] Recargando rol para usuario:', user.id);
      
      // Use the reloadUserRole utility that accesses the DB directly
      const newRole = await reloadUserRole(user.id);
      
      if (!newRole) {
        toast.error("No se pudo obtener el rol del usuario");
        setIsReloading(false);
        return;
      }
      
      console.log('[useUserRole] Nuevo rol obtenido:', newRole);
      
      // Update the local state
      setCurrentRole(newRole);
      
      // Update permissions based on the new role
      const rolePermissions = getRolePermissions(newRole);
      setPermissions(rolePermissions);
      
      // Update the auth context with the new role
      const updated = await updateUserRole(newRole);
      
      if (updated) {
        toast.success(`Rol actualizado correctamente: ${newRole}`);
      } else {
        toast.warning("El rol se obtuvo correctamente pero no se pudo actualizar el contexto");
      }
    } catch (error) {
      console.error("[useUserRole] Error inesperado al recargar rol:", error);
      toast.error("Error inesperado al recargar el rol");
    } finally {
      setIsReloading(false);
    }
  };
  
  // Toggle emergency mode
  const toggleEmergencyMode = () => {
    setEmergencyMode(!emergencyMode);
    if (!emergencyMode) {
      console.log('[useUserRole] Emergency mode activated');
    } else {
      console.log('[useUserRole] Emergency mode deactivated');
    }
  };
  
  return {
    currentRole,
    permissions,
    isReloading,
    emergencyMode,
    hasPermission: checkPermission,
    handleRoleReload,
    toggleEmergencyMode
  };
};
