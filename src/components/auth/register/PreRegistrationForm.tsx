
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { CheckCircle, Building2, Mail, Phone, User } from 'lucide-react';
import kontactLogoOrange from '@/assets/kontact-vo-logo-orange-2.png';
import { preRegistrationCopy } from './preRegistrationCopy';

const PreRegistrationForm: React.FC = () => {
  const { t, currentLanguage } = useLanguage();
  const copy = preRegistrationCopy[currentLanguage] ?? preRegistrationCopy.en;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.companyName.trim() || formData.companyName.trim().length < 3) {
      newErrors.companyName = `${t('auth.register.companyName')} (${t('auth.preRegistration.minChars')})`;
    }
    if (!formData.contactPerson.trim() || formData.contactPerson.trim().length < 3) {
      newErrors.contactPerson = `${t('auth.register.contactPerson')} (${t('auth.preRegistration.minChars')})`;
    }
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('form.invalidEmail');
    }
    if (!formData.phone.trim() || formData.phone.trim().length < 6) {
      newErrors.phone = `${t('auth.register.phone')} (${t('auth.preRegistration.minChars')})`;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('registration_requests').insert({
        company_name: formData.companyName.trim(),
        contact_name: formData.contactPerson.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        status: 'pre_registration',
      });

      if (error) throw error;

      setIsSuccess(true);
      toast.success(t('auth.preRegistration.toastSuccess'));
    } catch (error: any) {
      console.error('[PreRegistration] Error:', error);
      toast.error(t('auth.preRegistration.toastError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <Card className="w-full max-w-md shadow-xl border-primary/20">
        <CardContent className="p-6 sm:p-8 text-center">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-xl font-semibold mb-2 text-foreground">{t('auth.preRegistration.successTitle')}</h2>
          <p className="text-muted-foreground mb-4">
            {t('auth.preRegistration.successMessage')}
          </p>
          <p className="text-sm text-muted-foreground">
            {t('auth.preRegistration.successDetail')}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md shadow-xl border-primary/20">
      <CardHeader className="space-y-1 pb-4">
        <div className="flex justify-center mb-4">
          <img 
            src={kontactLogoOrange} 
            alt="KONTACT VO Logo" 
            className="h-28 sm:h-32 w-auto drop-shadow-md"
            loading="eager"
          />
        </div>
        <CardTitle className="text-xl font-bold text-center">
          {t('auth.preRegistration.title')}
        </CardTitle>
        <CardDescription className="text-center">
          {t('auth.preRegistration.subtitle')}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-4 sm:p-6">
        {/* Info banner */}
        <div className="mb-6 p-4 bg-primary/10 border-l-4 border-primary rounded-r-lg">
          <p className="text-sm text-primary leading-relaxed">
            {t('auth.preRegistration.infoBanner')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="pre-companyName" className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-primary" />
              {t('auth.register.companyName')} *
            </Label>
            <Input
              id="pre-companyName"
              placeholder={t('auth.register.companyNamePlaceholder')}
              value={formData.companyName}
              onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
              disabled={isSubmitting}
              className={errors.companyName ? 'border-destructive' : ''}
            />
            {errors.companyName && <p className="text-xs text-destructive">{errors.companyName}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="pre-contactPerson" className="flex items-center gap-2">
              <User className="h-4 w-4 text-primary" />
              {t('auth.register.contactPerson')} *
            </Label>
            <Input
              id="pre-contactPerson"
              placeholder={t('auth.register.contactPersonPlaceholder')}
              value={formData.contactPerson}
              onChange={(e) => setFormData(prev => ({ ...prev, contactPerson: e.target.value }))}
              disabled={isSubmitting}
              className={errors.contactPerson ? 'border-destructive' : ''}
            />
            {errors.contactPerson && <p className="text-xs text-destructive">{errors.contactPerson}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="pre-email" className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary" />
              {t('auth.email')} *
            </Label>
            <Input
              id="pre-email"
              type="email"
              placeholder="empresa@ejemplo.com"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              disabled={isSubmitting}
              className={errors.email ? 'border-destructive' : ''}
            />
            {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="pre-phone" className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" />
              {t('auth.register.phone')} *
            </Label>
            <Input
              id="pre-phone"
              type="tel"
              placeholder="+34 600 000 000"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              disabled={isSubmitting}
              className={errors.phone ? 'border-destructive' : ''}
            />
            <p className="text-xs text-muted-foreground">{t('auth.register.phoneHelp')}</p>
            {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
          </div>

          <Button 
            type="submit" 
            className="w-full mt-6" 
            disabled={isSubmitting}
          >
            {isSubmitting ? t('auth.preRegistration.submitting') : t('auth.preRegistration.submit')}
          </Button>
        </form>

        <p className="text-xs text-muted-foreground text-center mt-4">
          {t('auth.preRegistration.consent')}
        </p>
      </CardContent>
    </Card>
  );
};

export default PreRegistrationForm;
