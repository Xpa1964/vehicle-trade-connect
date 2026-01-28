
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { toast as sonnerToast } from 'sonner';
import { logSystemActivity } from '@/utils/activityLogger';

export const useLogin = () => {
  const { toast } = useToast();

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log(`[useLogin] Attempting to login with email: ${email}`);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('[useLogin] Login error from Supabase:', error);
        toast({
          title: "Error de inicio de sesión",
          description: error.message,
          variant: "destructive",
        });
        
        await logSystemActivity('login_failed', {
          message: `Failed login attempt for email: ${email}`,
          error: error.message
        }, 'warning');
        
        return false;
      }

      console.log(`[useLogin] Login successful:`, data);
      
      sonnerToast.success("Inicio de sesión exitoso", {
        description: "Bienvenido de nuevo!"
      });
      
      if (data.user) {
        await logSystemActivity('login_success', {
          message: `User logged in: ${data.user.email}`,
          user_id: data.user.id
        });
      }
      
      return true;
    } catch (error: any) {
      console.error('[useLogin] Login error:', error);
      toast({
        title: "Error",
        description: "Ha ocurrido un error inesperado",
        variant: "destructive",
      });
      
      await logSystemActivity('login_error', {
        message: `Unexpected error during login for email: ${email}`,
        error: error.message
      }, 'error');
      
      return false;
    }
  };

  return { login };
};
