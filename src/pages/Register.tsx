
import React, { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useRegisterForm } from '@/hooks/useRegisterForm';
import RegisterHeader from '@/components/auth/register/RegisterHeader';
import RegisterForm from '@/components/auth/register/RegisterForm';
import RegisterFooter from '@/components/auth/register/RegisterFooter';
import PreRegistrationForm from '@/components/auth/register/PreRegistrationForm';
import { useLanguage } from '@/contexts/LanguageContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RegisterFormData, registerSchema } from '@/schemas/registerSchema';
import { cleanMaliciousDrafts, validateFormCleanliness } from '@/utils/securityCleanup';
import { Lock } from 'lucide-react';

// Flag to control pre-registration mode
const PRE_REGISTRATION_MODE = true;

const Register: React.FC = () => {
  const { t } = useLanguage();
  const { 
    handleSubmit: submitRegistration, 
    isSubmitting, 
    isSuccess,
    companyLogoPreview,
    handleLogoChange,
    saveDraft,
    loadDraft,
    draftId
  } = useRegisterForm();
  
  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      companyName: '',
      email: '',
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
    }
  });

  useEffect(() => {
    console.log('[Register] SECURITY: Executing malicious draft cleanup on page load');
    cleanMaliciousDrafts();
  }, []);

  const handleFormSubmit = async () => {
    const isValid = await form.trigger();
    if (isValid) {
      const formData = form.getValues();
      if (!validateFormCleanliness(formData)) {
        console.error('[Register] SECURITY ALERT: Malicious data detected in form submission');
        return;
      }
      await submitRegistration(formData);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <div className="mb-4">
              <div className="mx-auto w-12 h-12 bg-success/10 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-[#22C55E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h2 className="text-xl font-semibold mb-2 text-foreground">Solicitud Enviada</h2>
            <p className="text-muted-foreground mb-4">
              Su solicitud de registro ha sido enviada correctamente. Recibirá un email de confirmación en breve.
            </p>
            <p className="text-sm text-muted-foreground">
              Nuestro equipo revisará su solicitud y le contactaremos pronto.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (PRE_REGISTRATION_MODE) {
    return (
      <div className="min-h-screen bg-background py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-6 lg:gap-8 items-start justify-center">
          {/* Left: Pre-registration form (active) */}
          <div className="w-full lg:w-auto flex-shrink-0">
            <PreRegistrationForm />
          </div>

          {/* Right: Full registration form (disabled/locked) */}
          <div className="w-full lg:flex-1 max-w-3xl relative">
            {/* Overlay to disable interaction */}
            <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px] z-10 rounded-lg flex flex-col items-center justify-center">
              <div className="bg-card border border-border rounded-xl p-6 shadow-lg text-center max-w-sm mx-4">
                <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-3">
                  <Lock className="w-6 h-6 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Registro Completo</h3>
                <p className="text-sm text-muted-foreground">
                  El formulario de registro completo estará disponible próximamente. 
                  Mientras tanto, complete el pre-registro a la izquierda para reservar su acceso.
                </p>
              </div>
            </div>

            <Card className="w-full opacity-50 pointer-events-none select-none">
              <RegisterHeader />
              <CardContent className="p-4 sm:p-6">
                <p className="mb-4 sm:mb-6 text-sm sm:text-base text-muted-foreground">
                  {t('auth.register.restrictedNote')}
                </p>
                
                <div className="mb-8 p-4 bg-primary/10 border-l-4 border-primary rounded-r-lg">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-primary mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3 flex-1">
                      <p className="text-sm text-primary mb-3 font-medium">
                        {t('auth.register.haveDocumentsReady')}
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm text-primary/80">
                        <div className="flex items-start gap-2 min-w-0">
                          <span className="text-primary mt-0.5 flex-shrink-0">•</span>
                          <span className="break-words">{t('auth.register.documentBusiness')}</span>
                        </div>
                        <div className="flex items-start gap-2 min-w-0">
                          <span className="text-primary mt-0.5 flex-shrink-0">•</span>
                          <span className="break-words">{t('auth.register.documentId')}</span>
                        </div>
                        <div className="flex items-start gap-2 min-w-0">
                          <span className="text-primary mt-0.5 flex-shrink-0">•</span>
                          <span className="break-words">{t('auth.register.documentProof')}</span>
                        </div>
                        <div className="flex items-start gap-2 min-w-0">
                          <span className="text-primary mt-0.5 flex-shrink-0">•</span>
                          <span className="break-words">{t('auth.register.documentOthers')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <RegisterForm
                  form={form}
                  isSubmitting={isSubmitting}
                  companyLogoPreview={companyLogoPreview}
                  handleLogoChange={handleLogoChange}
                  handleSubmit={handleFormSubmit}
                  saveDraft={saveDraft}
                  loadDraft={loadDraft}
                  draftId={draftId}
                />
              </CardContent>
              <RegisterFooter />
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Normal registration mode (when PRE_REGISTRATION_MODE = false)
  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-sm sm:max-w-2xl lg:max-w-3xl">
        <RegisterHeader />
        <CardContent className="p-4 sm:p-6">
          <p className="mb-4 sm:mb-6 text-sm sm:text-base text-muted-foreground">
            {t('auth.register.restrictedNote')}
          </p>
          <div className="mb-8 p-4 bg-primary/10 border-l-4 border-primary rounded-r-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-primary mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm text-primary mb-3 font-medium">
                  {t('auth.register.haveDocumentsReady')}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm text-primary/80">
                  <div className="flex items-start gap-2 min-w-0">
                    <span className="text-primary mt-0.5 flex-shrink-0">•</span>
                    <span className="break-words">{t('auth.register.documentBusiness')}</span>
                  </div>
                  <div className="flex items-start gap-2 min-w-0">
                    <span className="text-primary mt-0.5 flex-shrink-0">•</span>
                    <span className="break-words">{t('auth.register.documentId')}</span>
                  </div>
                  <div className="flex items-start gap-2 min-w-0">
                    <span className="text-primary mt-0.5 flex-shrink-0">•</span>
                    <span className="break-words">{t('auth.register.documentProof')}</span>
                  </div>
                  <div className="flex items-start gap-2 min-w-0">
                    <span className="text-primary mt-0.5 flex-shrink-0">•</span>
                    <span className="break-words">{t('auth.register.documentOthers')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <RegisterForm
            form={form}
            isSubmitting={isSubmitting}
            companyLogoPreview={companyLogoPreview}
            handleLogoChange={handleLogoChange}
            handleSubmit={handleFormSubmit}
            saveDraft={saveDraft}
            loadDraft={loadDraft}
            draftId={draftId}
          />
        </CardContent>
        <RegisterFooter />
      </Card>
    </div>
  );
};

export default Register;
