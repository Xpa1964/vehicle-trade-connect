
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { toast as sonnerToast } from 'sonner';
import { logSystemActivity } from '@/utils/activityLogger';
import { useCallback } from 'react';
import { getTranslation } from '@/utils/getTranslation';

export const useRegister = () => {
  const { toast } = useToast();

  const register = useCallback(async (
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
          title: getTranslation('toast.registerError'),
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

      sonnerToast.success(getTranslation('toast.registerComplete'));
      
      // Log successful registration
      if (data?.user) {
        await logSystemActivity('register_success', {
          message: `New user registered: ${email}`,
          user_id: data.user.id
        });
      }
      
      // Navigate to login page after successful registration using window.location
      setTimeout(() => {
        window.location.href = '/login';
      }, 300);
      
      return true;
    } catch (error: any) {
      console.error('[useRegister] Registration error:', error);
      toast({
        title: "Error",
        description: getTranslation('toast.registerError'),
        variant: "destructive",
      });
      
      // Log error
      await logSystemActivity('register_error', {
        message: `Unexpected error during registration for email: ${email}`,
        error: error.message
      }, 'error');
      
      return false;
    }
  }, [toast]);

  return { register };
};
