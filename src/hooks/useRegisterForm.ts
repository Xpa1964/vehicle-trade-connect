
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { RegisterFormData } from '@/schemas/registerSchema';
import { useLanguage } from '@/contexts/LanguageContext';

export const useRegisterForm = () => {
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [companyLogo, setCompanyLogo] = useState<File | null>(null);
  const [companyLogoPreview, setCompanyLogoPreview] = useState<string | null>(null);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCompanyLogo(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCompanyLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const sendConfirmationEmail = async (email: string, companyName: string) => {
    try {
      console.log('=== DIAGNOSIS: Sending confirmation email ===');
      console.log('Email:', email);
      console.log('Company:', companyName);
      console.log('Function URL:', `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/registration-emails`);
      
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/registration-emails`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'confirmation',
          data: {
            email,
            companyName
          }
        })
      });
      
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      
      const result = await response.json();
      console.log('Response body:', result);
      
      if (!response.ok) {
        console.error('=== EMAIL ERROR ===');
        console.error('Status:', response.status);
        console.error('Result:', result);
        toast.error(t('toast.contactError'));
        return false;
      }
      
      console.log('=== EMAIL SUCCESS ===');
      console.log('Email sent successfully:', result);
      toast.success(t('toast.contactSuccess'));
      return true;
    } catch (error) {
      console.error('=== EMAIL EXCEPTION ===');
      console.error('Error completo:', error);
      console.error('Error message:', error instanceof Error ? error.message : 'Unknown error');
      toast.error(t('toast.contactError'));
      return false;
    }
  };

  const sendNotificationToAdmin = async (email: string, companyName: string) => {
    try {
      console.log('=== DIAGNOSIS: Sending admin notification ===');
      const adminEmail = 'admin@kontactvo.com';
      
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/registration-emails`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'notification',
          data: {
            email: adminEmail,
            companyName
          }
        })
      });
      
      console.log('Admin notification response status:', response.status);
      const result = await response.json();
      console.log('Admin notification result:', result);
      
      if (!response.ok) {
        console.error('Error sending admin notification:', result);
        return false;
      }
      
      console.log('Admin notification sent successfully:', result);
      return true;
    } catch (error) {
      console.error('Exception sending admin notification:', error);
      return false;
    }
  };

  const handleSubmit = async (data: RegisterFormData) => {
    setIsSubmitting(true);
    
    try {
      console.log('=== DIAGNOSIS: Starting registration process ===');
      console.log('Registration data:', data);
      
      // La validación de roles administrativos se maneja en el backend
      // a través de la tabla admin_config y políticas RLS
      
      const requestData = {
        email: data.email,
        company_name: data.companyName,
        contact_name: data.contactPerson,
        phone: data.phone,
      };
      
      console.log('=== DIAGNOSIS: Inserting into registration_requests ===');
      const { error } = await supabase
        .from('registration_requests')
        .insert([requestData]);
      
      if (error) {
        console.error('=== DATABASE ERROR ===');
        console.error('Error inserting registration request:', error);
        console.error('Error details:', JSON.stringify(error, null, 2));
        toast.error(t('toast.registerError'));
        setIsSubmitting(false);
        return false;
      }
      
      console.log('=== DATABASE SUCCESS ===');
      console.log('Registration request submitted successfully');
      
      // 2. Send confirmation email to user
      console.log('=== DIAGNOSIS: Starting email sending process ===');
      const emailSent = await sendConfirmationEmail(data.email, data.companyName);
      console.log('Confirmation email result:', emailSent);
      
      // 3. Send notification to admin
      const adminNotified = await sendNotificationToAdmin(data.email, data.companyName);
      console.log('Admin notification result:', adminNotified);
      
      // 4. Set success state regardless of email status
      setIsSuccess(true);
      
      if (emailSent) {
        toast.success(t('toast.registerSuccess'));
      } else {
        toast.success(t('toast.registerSuccess'));
      }
      
      return true;
    } catch (error) {
      console.error('=== UNEXPECTED ERROR ===');
      console.error('Unexpected error in registration submission:', error);
      toast.error(t('toast.registerError'));
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // TEMPORALMENTE DESHABILITADO: Funcionalidad de drafts hasta implementar versión segura
  const saveDraft = async (): Promise<string | null> => {
    console.log('[useRegisterForm] SECURITY: Draft functionality temporarily disabled');
    return null;
  };

  // TEMPORALMENTE DESHABILITADO: Funcionalidad de drafts hasta implementar versión segura
  const loadDraft = (draftId: string): boolean => {
    console.log('[useRegisterForm] SECURITY: Draft loading temporarily disabled');
    return false;
  };

  return {
    handleSubmit,
    isSubmitting,
    isSuccess,
    companyLogo,
    companyLogoPreview,
    handleLogoChange,
    saveDraft,
    loadDraft,
    draftId: null
  };
};

export default useRegisterForm;
