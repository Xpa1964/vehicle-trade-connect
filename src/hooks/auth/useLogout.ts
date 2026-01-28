
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { safeSignOut } from '@/utils/authUtils';
import { toast as sonnerToast } from 'sonner';
import { logSystemActivity } from '@/utils/activityLogger';
import { useNavigate } from 'react-router-dom';

export const useLogout = (setUser: (user: any) => void) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const logout = async () => {
    try {
      console.log('[useLogout] Initiating logout');
      
      // Get user id before logout for logging
      const { data: { user } } = await supabase.auth.getUser();
      const userId = user?.id;
      
      // Use the safer sign out method
      await safeSignOut(supabase);
      
      // Make sure user is set to null after logout
      setUser(null);
      
      // Clear all role caches
      for (const key in localStorage) {
        if (key.startsWith('user_role_')) {
          localStorage.removeItem(key);
        }
      }
      
      console.log('[useLogout] Logout successful and caches cleared');
      
      // Log logout activity
      if (userId) {
        await logSystemActivity('logout', {
          message: `User logged out: ${user?.email}`,
          user_id: userId
        });
      }
      
      sonnerToast.success("Sesión cerrada", {
        description: "Has cerrado sesión correctamente"
      });
      
      // Redirect to home page after logout
      setTimeout(() => {
        navigate('/');
      }, 300); // Small timeout to allow toasts and state updates
      
    } catch (error: any) {
      console.error('[useLogout] Logout error:', error);
      toast({
        title: "Error",
        description: "Hubo un problema al cerrar sesión, pero se ha cerrado la sesión local",
        variant: "destructive",
      });
      
      // Log error
      await logSystemActivity('logout_error', {
        message: "Error during logout process",
        error: error.message
      }, 'error');
      
      // Make sure user is set to null even in case of error
      setUser(null);
      
      // Redirect to home page even in case of error
      setTimeout(() => {
        navigate('/');
      }, 1500);
    }
  };

  return { logout };
};
