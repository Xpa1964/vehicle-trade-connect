
import * as React from 'react';
const { createContext, useContext, useEffect, useState } = React;
import { AuthContextType, AppRole, Permission } from '@/types/auth';
import { useAuthSession } from '@/hooks/useAuthSession';
import { useAuthOperations } from '@/hooks/useAuthOperations';
import { getRolePermissions } from '@/utils/roles/permissionsService';
import { supabase } from '@/integrations/supabase/client';
import { enhanceUser } from '@/utils/userEnhancement';

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => false,
  register: async () => false,
  logout: async () => {},
  updateUserRole: async () => false,
  hasPermission: () => false,
  refreshUser: async () => {}
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, setUser, isLoading } = useAuthSession();
  
  // We don't need to pass navigate function separately since useAuthOperations will use useNavigate directly
  const { login, register, logout } = useAuthOperations(setUser);

  // Permissions based on user role
  const hasPermission = (permission: Permission): boolean => {
    if (!user?.role) return false;
    
    const permissions = getRolePermissions(user.role);
    return permissions.includes(permission);
  };

  // New function to update only the user role without requiring a full reload
  const updateUserRole = async (newRole: AppRole): Promise<boolean> => {
    try {
      console.log('[AuthContext] Updating user role to:', newRole);
      
      if (!user) {
        console.error('[AuthContext] Cannot update role: No authenticated user');
        return false;
      }
      
      // Update the user object with the new role
      const updatedUser = {
        ...user,
        role: newRole
      };
      
      setUser(updatedUser);
      console.log('[AuthContext] User role updated successfully to:', newRole);
      return true;
    } catch (error) {
      console.error('[AuthContext] Error updating user role:', error);
      return false;
    }
  };

  // New function to refresh user data from database
  const refreshUser = async (): Promise<void> => {
    try {
      console.log('[AuthContext] Refreshing user data...');
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        const enhancedUser = await enhanceUser(session.user);
        if (enhancedUser) {
          setUser(enhancedUser);
          console.log('[AuthContext] User refreshed successfully');
        }
      }
    } catch (error) {
      console.error('[AuthContext] Error refreshing user:', error);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      register,
      logout,
      updateUserRole,
      hasPermission,
      refreshUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
