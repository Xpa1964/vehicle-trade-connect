
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { toast as sonnerToast } from 'sonner';
import { logSystemActivity } from '@/utils/activityLogger';
import { useNavigate } from 'react-router-dom';

export const useRegister = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const register = async (
    email: string, 
    password: string,
    userData: any = {}
  ): Promise<boolean> => {
    try {
      console.log(`[useRegister] Registering new user with email: ${email}`);
      const { error: signUpError, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      });

      if (signUpError) {
        toast({
          title: "Error de registro",
          description: signUpError.message,
          variant: "destructive",
        });
        
        // Log failed registration attempt
        await logSystemActivity('register_failed', {
          message: `Failed registration attempt for email: ${email}`,
          error: signUpError.message
        }, 'warning');
        
        return false;
      }

      sonnerToast.success("Registro exitoso", {
        description: "Tu cuenta ha sido creada correctamente"
      });
      
      // Log successful registration
      if (data?.user) {
        await logSystemActivity('register_success', {
          message: `New user registered: ${email}`,
          user_id: data.user.id
        });
      }
      
      // Navigate to login page after successful registration
      navigate('/login');
      
      return true;
    } catch (error: any) {
      console.error('[useRegister] Registration error:', error);
      toast({
        title: "Error",
        description: "Ha ocurrido un error inesperado",
        variant: "destructive",
      });
      
      // Log error
      await logSystemActivity('register_error', {
        message: `Unexpected error during registration for email: ${email}`,
        error: error.message
      }, 'error');
      
      return false;
    }
  };

  return { register };
};
