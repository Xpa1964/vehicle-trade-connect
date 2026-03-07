
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

  const LOGO_ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
  const LOGO_MAX_SIZE_BYTES = 2 * 1024 * 1024; // 2MB

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!LOGO_ALLOWED_TYPES.includes(file.type)) {
      toast.error(`Tipo de archivo no permitido: ${file.type}. Solo se aceptan JPEG, PNG y WebP.`);
      e.target.value = '';
      return;
    }

    if (file.size > LOGO_MAX_SIZE_BYTES) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
      toast.error(`El logo es demasiado grande (${sizeMB}MB). Tamaño máximo: 2MB.`);
      e.target.value = '';
      return;
    }

    setCompanyLogo(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setCompanyLogoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const sendConfirmationEmail = async (email: string, companyName: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/registration-emails`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'confirmation',
          data: { email, companyName }
        })
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        console.error('[useRegisterForm] Email send failed:', response.status);
        toast.error(t('toast.contactError'));
        return false;
      }
      
      toast.success(t('toast.contactSuccess'));
      return true;
    } catch (error) {
      console.error('[useRegisterForm] Email send error:', error);
      toast.error(t('toast.contactError'));
      return false;
    }
  };

  const sendNotificationToAdmin = async (email: string, companyName: string) => {
    try {
      const adminEmail = 'admin@kontactvo.com';
      
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/registration-emails`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'notification',
          data: { email: adminEmail, companyName }
        })
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        console.error('[useRegisterForm] Admin notification failed:', result);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('[useRegisterForm] Admin notification error:', error);
      return false;
    }
  };

  const handleSubmit = async (data: RegisterFormData) => {
    setIsSubmitting(true);
    
    try {
      // Upload company logo to Storage if provided
      let logoUrl: string | null = null;
      if (companyLogo) {
        if (!LOGO_ALLOWED_TYPES.includes(companyLogo.type)) {
          toast.error(`Tipo de logo no permitido: ${companyLogo.type}`);
          setIsSubmitting(false);
          return false;
        }
        if (companyLogo.size > LOGO_MAX_SIZE_BYTES) {
          toast.error('El logo excede el tamaño máximo de 2MB.');
          setIsSubmitting(false);
          return false;
        }

        const fileExt = companyLogo.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('company-logos')
          .upload(fileName, companyLogo, { upsert: false });
        
        if (uploadError) {
          console.error('[useRegisterForm] Logo upload error:', uploadError);
        } else {
          const { data: publicUrlData } = supabase.storage
            .from('company-logos')
            .getPublicUrl(fileName);
          logoUrl = publicUrlData.publicUrl;
        }
      }

      const requestData = {
        email: data.email,
        company_name: data.companyName,
        contact_name: data.contactPerson,
        phone: data.phone,
        city: data.city,
        country: data.country,
        postal_code: data.postalCode,
        manager_name: `${data.managerFirstName} ${data.managerLastName}`.trim(),
        business_type: data.businessType,
        trader_type: data.traderType,
        description: data.description,
        documents_paths: [],
        company_logo_url: logoUrl,
        terms_accepted_at: new Date().toISOString(),
      };
      
      const { error } = await supabase
        .from('registration_requests')
        .insert([requestData]);
      
      if (error) {
        console.error('[useRegisterForm] Registration insert error:', error);
        toast.error(t('toast.registerError'));
        setIsSubmitting(false);
        return false;
      }
      
      // Send confirmation email to user
      await sendConfirmationEmail(data.email, data.companyName);
      
      // Send notification to admin
      await sendNotificationToAdmin(data.email, data.companyName);
      
      // Set success state regardless of email status
      setIsSuccess(true);
      toast.success(t('toast.registerSuccess'));
      
      return true;
    } catch (error) {
      console.error('[useRegisterForm] Unexpected registration error:', error);
      toast.error(t('toast.registerError'));
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // TEMPORALMENTE DESHABILITADO: Funcionalidad de drafts hasta implementar versión segura
  const saveDraft = async (): Promise<string | null> => {
    return null;
  };

  // TEMPORALMENTE DESHABILITADO: Funcionalidad de drafts hasta implementar versión segura
  const loadDraft = (draftId: string): boolean => {
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
