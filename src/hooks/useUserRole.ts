
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { AppRole, Permission } from '@/types/auth';
import { reloadUserRole } from '@/utils/roles';
import { useAuth } from '@/contexts/AuthContext';
import { hasPermission, getRolePermissions } from '@/utils/roles/permissionsService';
import { getTranslation } from '@/utils/getTranslation';

export const useUserRole = () => {
  const { user, updateUserRole } = useAuth();
  const [isReloading, setIsReloading] = useState(false);
  const [currentRole, setCurrentRole] = useState<AppRole | null>(user?.role || null);
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  
  useEffect(() => {
    if (user?.role) {
      console.log('[useUserRole] User role updated from Auth context:', user.role);
      setCurrentRole(user.role);
      const rolePermissions = getRolePermissions(user.role);
      setPermissions(rolePermissions);
    }
  }, [user?.role]);
  
  const checkPermission = (permission: Permission): boolean => {
    if (!currentRole) return false;
    return hasPermission(currentRole, permission);
  };
  
  const handleRoleReload = async () => {
    const t = getTranslation;
    if (!user?.id) {
      toast.error(t('toast.userNotIdentified'));
      return;
    }
    
    setIsReloading(true);
    try {
      const newRole = await reloadUserRole(user.id);
      
      if (!newRole) {
        toast.error(t('toast.roleLoadError'));
        setIsReloading(false);
        return;
      }
      
      setCurrentRole(newRole);
      const rolePermissions = getRolePermissions(newRole);
      setPermissions(rolePermissions);
      
      const updated = await updateUserRole(newRole);
      
      if (updated) {
        toast.success(`${t('toast.roleUpdated')}: ${newRole}`);
      } else {
        toast.warning(t('toast.roleUpdateContextError'));
      }
    } catch (error) {
      console.error("[useUserRole] Error reloading role:", error);
      toast.error(t('toast.roleReloadError'));
    } finally {
      setIsReloading(false);
    }
  };
  
  const toggleEmergencyMode = () => {
    setEmergencyMode(!emergencyMode);
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
