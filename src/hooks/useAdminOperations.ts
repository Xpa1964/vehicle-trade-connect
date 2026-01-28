
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface AdminOperationRequest {
  operation: 'reset_password' | 'send_email';
  userId: string;
  email?: string;
  subject?: string;
  message?: string;
}

export const useAdminOperations = () => {
  const [isLoading, setIsLoading] = useState(false);

  const executeOperation = async (request: AdminOperationRequest) => {
    setIsLoading(true);
    
    try {
      console.log('[useAdminOperations] Executing operation:', request.operation, 'for user:', request.userId);
      
      const { data, error } = await supabase.functions.invoke('admin-user-operations', {
        body: request
      });

      if (error) {
        console.error('[useAdminOperations] Error:', error);
        throw error;
      }

      if (!data?.success) {
        throw new Error(data?.message || 'Operation failed');
      }

      console.log('[useAdminOperations] Operation successful:', data);
      return data;

    } catch (error) {
      console.error('[useAdminOperations] Error in executeOperation:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const resetUserPassword = async (userId: string, email: string) => {
    try {
      const result = await executeOperation({
        operation: 'reset_password',
        userId,
        email
      });

      toast({
        title: "Contraseña Restablecida",
        description: "Se ha generado un enlace de restablecimiento de contraseña para el usuario.",
      });

      return result;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo restablecer la contraseña",
        variant: "destructive"
      });
      throw error;
    }
  };

  const sendAdminEmail = async (userId: string, subject: string, message: string) => {
    try {
      const result = await executeOperation({
        operation: 'send_email',
        userId,
        subject,
        message
      });

      toast({
        title: "Email Enviado",
        description: "El mensaje ha sido enviado correctamente al usuario.",
      });

      return result;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo enviar el email",
        variant: "destructive"
      });
      throw error;
    }
  };

  return {
    isLoading,
    resetUserPassword,
    sendAdminEmail
  };
};
