
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { logActivity } from '@/utils/activityLogger';
import { RegistrationRequest } from './useRegistrationRequests';
import { User } from '@supabase/supabase-js';

// Define interface for validation response
interface ValidationDataResponse {
  company_name_match: boolean;
  contact_person_match: boolean;
  phone_match: boolean;
  country_match: boolean;
  business_type_match: boolean;
  trader_type_match: boolean;
}

interface ValidationResponse {
  success: boolean;
  message?: string;
  data_validation?: ValidationDataResponse;
}

export const useRegistrationRequestOperations = (refetchRequests: () => void) => {
  const [selectedRequest, setSelectedRequest] = useState<RegistrationRequest | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [createdCredentials, setCreatedCredentials] = useState<{email: string, password: string, isExistingUser?: boolean} | null>(null);
  
  const handleOpenDetails = (request: RegistrationRequest) => {
    setSelectedRequest(request);
    setAdminNotes(request.admin_notes || '');
    setCreatedCredentials(null); // Reset credentials when opening new request
  };

  const handleSaveNotes = async () => {
    if (!selectedRequest || !selectedRequest.id) return;
    
    try {
      // Get current session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('No authentication session found');
      }

      // Use the Edge Function to update notes
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-users/update-registration-notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          registrationId: selectedRequest.id,
          adminNotes: adminNotes
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update notes');
      }
      
      // Log activity
      await logActivity({
        action_type: 'update_registration_notes',
        entity_type: 'registration_request',
        entity_id: selectedRequest.id,
        details: { company: selectedRequest.company_name },
        severity: 'info'
      });
      
      toast.success('Notas guardadas correctamente');
      refetchRequests();
    } catch (error: any) {
      console.error('Error saving notes:', error);
      toast.error('Error al guardar las notas: ' + error.message);
    }
  };

  const handleResetToPending = async () => {
    if (!selectedRequest) return;
    
    setIsProcessing(true);
    
    try {
      console.log('Resetting request to pending:', selectedRequest.id);
      
      // Get current session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('No authentication session found');
      }
      
      // Update the status back to pending using Edge Function
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-users/update-registration-status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          registrationId: selectedRequest.id,
          status: 'pending',
          adminNotes: adminNotes + '\n\n[RESET] Solicitud revertida a pendiente para reprocesamiento.'
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to reset status');
      }
      
      // Log activity
      await logActivity({
        action_type: 'reset_registration_to_pending',
        entity_type: 'registration_request',
        entity_id: selectedRequest.id,
        details: { 
          company: selectedRequest.company_name,
          previous_status: selectedRequest.status
        },
        severity: 'info'
      });
      
      toast.success('Solicitud revertida a pendiente correctamente');
      setCreatedCredentials(null); // Clear any existing credentials
      refetchRequests();
    } catch (error: any) {
      console.error('Error resetting request to pending:', error);
      toast.error('Error al revertir la solicitud: ' + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const validateProfileCreation = async (registrationId: string): Promise<boolean> => {
    try {
      console.log('Validating profile creation for registration:', registrationId);
      
      const { data, error } = await supabase
        .rpc('validate_profile_data_transfer', { p_user_id: registrationId, p_registration_id: registrationId });

      if (error) {
        console.error('Error validating profile creation:', error);
        return false;
      }

      // Proper type conversion: Json -> unknown -> ValidationResponse
      const validationResult = data as unknown as ValidationResponse;

      if (validationResult?.success) {
        console.log('Profile validation successful:', validationResult.data_validation);
        return true;
      } else {
        console.error('Profile validation failed:', validationResult?.message);
        return false;
      }
    } catch (error) {
      console.error('Exception during profile validation:', error);
      return false;
    }
  };

  const sendConfirmationEmail = async (request: RegistrationRequest) => {
    try {
      console.log('Sending confirmation email to:', request.email);
      
      // Get current session for authorization
      const { data: { session } } = await supabase.auth.getSession();
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      // Add authorization header if session exists
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }
      
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/registration-emails`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          type: 'confirmation',
          data: {
            email: request.email,
            companyName: request.company_name
          }
        })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to send confirmation email:', errorText);
        throw new Error(`Failed to send confirmation email: ${errorText}`);
      }
      
      const result = await response.json();
      console.log('Confirmation email sent:', result);
      return true;
    } catch (error) {
      console.error('Error sending confirmation email:', error);
      throw error;
    }
  };

  const sendNotificationToAdmins = async (request: RegistrationRequest) => {
    try {
      // Get admin emails
      const { data: adminRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id')
        .eq('role', 'admin');
      
      if (rolesError) throw rolesError;
      
      if (!adminRoles || adminRoles.length === 0) {
        console.log('No admins found to notify');
        return;
      }
      
      // Extract admin IDs from roles
      const adminIds = adminRoles.map(role => role.user_id);
      
      // Get admin profiles with emails - fix the type issue here
      const { data: adminUsersResponse, error: usersError } = await supabase.auth.admin.listUsers();
      
      if (usersError) throw usersError;
      
      // Filter admins and send notifications - explicitly type the users array
      const adminUsers = adminUsersResponse?.users as User[] | undefined;
      
      if (!adminUsers || adminUsers.length === 0) {
        console.log('No admin users found');
        return;
      }
      
      const adminEmails = adminUsers
        .filter((user: User) => user.id && adminIds.includes(user.id))
        .map((user: User) => user.email)
        .filter((email): email is string => Boolean(email));
      
      console.log('Sending notification to admins:', adminEmails);
      
      // Skip if no admin emails found
      if (adminEmails.length === 0) return;
      
      // Get current session for authorization
      const { data: { session } } = await supabase.auth.getSession();
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      // Add authorization header if session exists
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }
      
      // Send notification to first admin (could be extended to send to all)
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/registration-emails`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          type: 'notification',
          data: {
            email: adminEmails[0],
            companyName: request.company_name
          }
        })
      });
      
      if (!response.ok) throw new Error('Failed to send admin notification');
      
      console.log('Admin notification sent');
      return true;
    } catch (error) {
      console.error('Error sending admin notification:', error);
      // Don't throw error here to avoid blocking the main process
      return false;
    }
  };

  const sendApprovalEmail = async (request: RegistrationRequest, credentials: {email: string, password: string, isExistingUser?: boolean}) => {
    try {
      console.log('Sending approval email to:', request.email);
      
      // Get current session for authorization
      const { data: { session } } = await supabase.auth.getSession();
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      // Add authorization header if session exists
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }
      
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/registration-emails`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          type: 'approval',
          data: {
            email: request.email,
            companyName: request.company_name,
            credentials: {
              email: credentials.email,
              password: credentials.password
            },
            isExistingUser: credentials.isExistingUser
          }
        })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to send approval email:', errorText);
        throw new Error(`Failed to send approval email: ${errorText}`);
      }
      
      const result = await response.json();
      console.log('Approval email sent:', result);
      return true;
    } catch (error) {
      console.error('Error sending approval email:', error);
      throw error;
    }
  };

  const sendRejectionEmail = async (request: RegistrationRequest) => {
    try {
      console.log('Sending rejection email to:', request.email);
      
      // Get current session for authorization
      const { data: { session } } = await supabase.auth.getSession();
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      // Add authorization header if session exists
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }
      
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/registration-emails`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          type: 'rejection',
          data: {
            email: request.email,
            companyName: request.company_name
          }
        })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to send rejection email:', errorText);
        throw new Error(`Failed to send rejection email: ${errorText}`);
      }
      
      const result = await response.json();
      console.log('Rejection email sent:', result);
      return true;
    } catch (error) {
      console.error('Error sending rejection email:', error);
      throw error;
    }
  };

  const handleSubmitForm = async (requestData: RegistrationRequest) => {
    try {
      // 1. Send confirmation email to user
      await sendConfirmationEmail(requestData);
      
      // 2. Send notification email to admins
      await sendNotificationToAdmins(requestData);
      
      // 3. Log activity
      await logActivity({
        action_type: 'new_registration_request',
        entity_type: 'registration_request',
        entity_id: requestData.id,
        details: { company: requestData.company_name, email: requestData.email },
        severity: 'info'
      });
      
      return true;
    } catch (error: any) {
      console.error('Error processing registration submission:', error);
      toast.error('Error al procesar el registro: ' + error.message);
      return false;
    }
  };

  const handleStatusUpdate = async (id: string, status: 'approved' | 'rejected') => {
    const currentRequest = selectedRequest;
    if (!currentRequest) {
      console.error('No selected request available');
      return;
    }
    
    setIsProcessing(true);
    setCreatedCredentials(null); // Reset credentials
    
    try {
      console.log(`Processing ${status} for request:`, id);
      
      // Get current session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('No authentication session found');
      }
      
      // 1. Handle the approval flow (create user first for approved requests)
      if (status === 'approved') {
        // Create user account first using the Edge Function
        console.log('Creating/updating user account...');
        const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-users/create-user-from-registration`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            registrationId: id
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to create/update user account');
        }

        const credentials = await response.json();
        console.log('User processed with credentials:', { 
          email: credentials.email, 
          hasPassword: !!credentials.password,
          isExistingUser: credentials.isExistingUser 
        });
        
        // Store credentials for display - ensure all properties are included
        const credentialsToStore = {
          email: credentials.email,
          password: credentials.password,
          isExistingUser: credentials.isExistingUser || false
        };
        
        console.log('Setting credentials to display:', credentialsToStore);
        setCreatedCredentials(credentialsToStore);

        // 2. Update the status in the database using Edge Function
        const statusResponse = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-users/update-registration-status`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            registrationId: id,
            status,
            adminNotes
          })
        });

        if (!statusResponse.ok) {
          const errorData = await statusResponse.json();
          throw new Error(errorData.error || 'Failed to update status');
        }

        // 3. Wait a moment for the trigger to execute, then validate profile creation
        setTimeout(async () => {
          const profileValidated = await validateProfileCreation(id);
          if (profileValidated) {
            console.log('Profile created and validated successfully');
          } else {
            console.warn('Profile validation failed - manual review may be needed');
          }
        }, 2000);

        // 4. Send approval email with credentials
        try {
          await sendApprovalEmail(currentRequest, credentialsToStore);
          console.log('Approval email sent successfully');
        } catch (emailError) {
          console.error('Email sending failed:', emailError);
          toast.error('Usuario creado exitosamente, pero el email no se pudo enviar. Revisa los logs del administrador.');
        }
        
        // 5. Log activity
        await logActivity({
          action_type: credentials.isExistingUser ? 'reapprove_registration' : 'approve_registration',
          entity_type: 'registration_request',
          entity_id: id,
          details: { 
            company: currentRequest.company_name, 
            userId: credentials.userId,
            isExistingUser: credentials.isExistingUser,
            profileAutoCreated: true
          },
          severity: 'success'
        });
        
        const successMessage = credentials.isExistingUser 
          ? 'Solicitud re-aprobada - Contraseña actualizada'
          : 'Solicitud aprobada - Usuario creado exitosamente';
        
        toast.success(successMessage);
      } 
      // 3. Handle rejection flow
      else if (status === 'rejected') {
        // Update the status in the database using Edge Function
        const response = await fetch('https://inqqnsvlimtpjxjxuzaf.supabase.co/functions/v1/admin-users/update-registration-status', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            registrationId: id,
            status,
            adminNotes
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to update status');
        }

        await sendRejectionEmail(currentRequest);
        
        // Log activity
        await logActivity({
          action_type: 'reject_registration',
          entity_type: 'registration_request',
          entity_id: id,
          details: { company: currentRequest.company_name },
          severity: 'warning'
        });
        
        toast.success('Solicitud rechazada y notificación enviada');
      }

      await refetchRequests();
      // Don't reset selectedRequest immediately so user can see the credentials
      // setSelectedRequest(null);
    } catch (error: any) {
      console.error(`Error ${status === 'approved' ? 'approving' : 'rejecting'} registration:`, error);
      toast.error(`Error al ${status === 'approved' ? 'aprobar' : 'rechazar'} la solicitud: ${error.message}`);
      setCreatedCredentials(null); // Clear credentials on error
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    selectedRequest,
    adminNotes,
    isProcessing,
    createdCredentials,
    setAdminNotes,
    setSelectedRequest,
    handleOpenDetails,
    handleSaveNotes,
    handleSubmitForm,
    handleStatusUpdate,
    handleResetToPending,
    validateProfileCreation
  };
};
