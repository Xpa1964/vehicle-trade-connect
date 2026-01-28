
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface ContactDetailsSectionProps {
  formData: {
    contactPerson: string;
    phone: string;
    email: string;
    password: string;
    confirmPassword: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isSubmitting: boolean;
}

const ContactDetailsSection: React.FC<ContactDetailsSectionProps> = ({
  formData,
  handleInputChange,
  isSubmitting
}) => {
  const { t } = useLanguage();

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="contactPerson">{t('auth.register.contactPerson')}</Label>
          <Input
            id="contactPerson"
            type="text"
            value={formData.contactPerson}
            onChange={handleInputChange}
            disabled={isSubmitting}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="phone">{t('auth.register.phone')}</Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={handleInputChange}
            disabled={isSubmitting}
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">{t('auth.email')}</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          disabled={isSubmitting}
          required
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="password">{t('auth.password')}</Label>
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            disabled={isSubmitting}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">{t('auth.confirmPassword')}</Label>
          <Input
            id="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            disabled={isSubmitting}
            required
          />
        </div>
      </div>
    </>
  );
};

export default ContactDetailsSection;
