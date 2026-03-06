
import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { UseFormReturn } from 'react-hook-form';
import { RegisterFormData } from '@/schemas/registerSchema';
import { Form } from '@/components/ui/form';
import MultiStepForm, { FormStep } from './MultiStepForm';
import CompanyInfoStep from './steps/CompanyInfoStep';
import ContactDetailsStep from './steps/ContactDetailsStep';
import BusinessDetailsStep from './steps/BusinessDetailsStep';
import DocumentsStep from './steps/DocumentsStep';
import FinalStep from './steps/FinalStep';
import DraftBanner from './DraftBanner';

interface RegisterFormProps {
  form: UseFormReturn<RegisterFormData>;
  error?: string;
  isSubmitting: boolean;
  companyLogoPreview: string | null;
  handleLogoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: () => Promise<void>;
  saveDraft: () => Promise<string | null>;
  loadDraft: (draft_id: string) => boolean;
  draftId: string | null;
}

const RegisterForm: React.FC<RegisterFormProps> = ({
  form,
  error,
  isSubmitting,
  companyLogoPreview,
  handleLogoChange,
  handleSubmit,
  saveDraft,
  loadDraft,
  draftId
}) => {
  const { t } = useLanguage();
  const [showDraftBanner, setShowDraftBanner] = useState(false);
  const [draftDetails, setDraftDetails] = useState<{ id: string, updatedAt: string } | null>(null);
  
  // SEGURIDAD CRÍTICA: Limpiar localStorage de drafts maliciosos al cargar el componente
  useEffect(() => {
    console.log('[RegisterForm] SECURITY: Cleaning malicious draft data from localStorage');
    
    // Limpiar TODOS los drafts de registro existentes
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('registration_draft_')) {
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(key => {
      console.log(`[RegisterForm] SECURITY: Removing malicious draft: ${key}`);
      localStorage.removeItem(key);
    });
    
    if (keysToRemove.length > 0) {
      console.log(`[RegisterForm] SECURITY: Cleaned ${keysToRemove.length} potentially malicious drafts`);
    }
    
    // Asegurar que el formulario esté completamente limpio
    form.reset({
      companyName: '',
      email: '',
      password: '',
      confirmPassword: '',
      contactPerson: '',
      phone: '',
      businessType: '',
      traderType: '',
      description: '',
      country: '',
      city: '',
      postalCode: '',
      managerFirstName: '',
      managerLastName: '',
      termsAccepted: false
    });
    
  }, [form]);
  
  // TEMPORALMENTE DESHABILITADO: No mostrar banner de drafts hasta implementar validación segura
  /*
  // Check for saved drafts on component mount
  useEffect(() => {
    // Look for any saved drafts in localStorage
    const draftKeys = Object.keys(localStorage)
      .filter(key => key.startsWith('registration_draft_'));
    
    if (draftKeys.length > 0) {
      // Get the most recent draft
      let mostRecentDraft: { id: string; updatedAt: string } | null = null;
      
      draftKeys.forEach(key => {
        const draftData = JSON.parse(localStorage.getItem(key) || '{}');
        if (draftData.updated_at && (!mostRecentDraft || new Date(draftData.updated_at) > new Date(mostRecentDraft.updatedAt))) {
          mostRecentDraft = {
            id: draftData.draft_id,
            updatedAt: draftData.updated_at
          };
        }
      });
      
      if (mostRecentDraft) {
        setDraftDetails(mostRecentDraft);
        setShowDraftBanner(true);
      }
    }
  }, []);
  */
  
  const handleLoadDraft = () => {
    if (draftDetails && loadDraft(draftDetails.id)) {
      setShowDraftBanner(false);
    }
  };
  
  const handleDismissDraft = () => {
    setShowDraftBanner(false);
  };

  // Define the steps for our multi-step form
  const steps: FormStep[] = [
    {
      id: 'company-info',
      label: t('auth.register.companyInfo'),
      fieldsToValidate: ['companyName', 'city', 'country', 'postalCode', 'managerFirstName', 'managerLastName'],
      component: (
        <CompanyInfoStep
          form={form}
          companyLogoPreview={companyLogoPreview}
          handleLogoChange={handleLogoChange}
          isSubmitting={isSubmitting}
        />
      )
    },
    {
      id: 'contact-details',
      label: t('auth.register.contactDetails'),
      fieldsToValidate: ['contactPerson', 'phone', 'email'],
      component: (
        <ContactDetailsStep
          form={form}
          isSubmitting={isSubmitting}
        />
      )
    },
    {
      id: 'business-details',
      label: t('auth.register.businessDetails'),
      fieldsToValidate: ['businessType', 'traderType', 'description'],
      component: (
        <BusinessDetailsStep
          form={form}
          isSubmitting={isSubmitting}
        />
      )
    },
    {
      id: 'documents',
      label: t('auth.register.documents'),
      fieldsToValidate: [],
      component: (
        <DocumentsStep
          form={form}
          isSubmitting={isSubmitting}
        />
      )
    },
    {
      id: 'review',
      label: t('auth.register.review'),
      fieldsToValidate: ['termsAccepted'],
      component: (
        <FinalStep
          form={form}
          isSubmitting={isSubmitting}
        />
      )
    }
  ];

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {/* TEMPORALMENTE DESHABILITADO por seguridad */}
      {false && showDraftBanner && draftDetails && (
        <DraftBanner
          draftId={draftDetails.id}
          updatedAt={draftDetails.updatedAt}
          onLoad={handleLoadDraft}
          onDismiss={handleDismissDraft}
        />
      )}
      
      <Form {...form}>
        <MultiStepForm
          steps={steps}
          onComplete={handleSubmit}
          onSaveProgress={saveDraft}
          isSubmitting={isSubmitting}
          formInstance={form}
        />
      </Form>
    </div>
  );
};

export default RegisterForm;
