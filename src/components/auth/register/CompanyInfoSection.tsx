
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface CompanyInfoSectionProps {
  formData: {
    companyName: string;
    city: string;
    country: string;
    postalCode: string;
    managerName: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  companyLogo: File | null;
  companyLogoPreview: string | null;
  handleLogoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isSubmitting: boolean;
}

const CompanyInfoSection: React.FC<CompanyInfoSectionProps> = ({
  formData,
  handleInputChange,
  companyLogo,
  companyLogoPreview,
  handleLogoChange,
  isSubmitting
}) => {
  const { t } = useLanguage();

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="companyName">{t('auth.register.companyName')}</Label>
        <Input
          id="companyName"
          type="text"
          value={formData.companyName}
          onChange={handleInputChange}
          disabled={isSubmitting}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="companyLogo">{t('auth.register.companyLogo')}</Label>
        <div className="flex items-center space-x-4">
          <div className="flex-grow">
            <Input
              id="companyLogo"
              type="file"
              onChange={handleLogoChange}
              disabled={isSubmitting}
              accept="image/png,image/jpeg,image/jpg,image/gif"
            />
          </div>
          {companyLogoPreview && (
            <div className="h-16 w-16 rounded border overflow-hidden">
              <img 
                src={companyLogoPreview} 
                alt="Vista previa del logo de empresa seleccionado" 
                className="h-full w-full object-contain"
              />
            </div>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">{t('auth.register.city')}</Label>
          <Input
            id="city"
            type="text"
            value={formData.city}
            onChange={handleInputChange}
            disabled={isSubmitting}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="country">{t('auth.register.country')}</Label>
          <Input
            id="country"
            type="text"
            value={formData.country}
            onChange={handleInputChange}
            disabled={isSubmitting}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="postalCode">{t('auth.register.postalCode')}</Label>
          <Input
            id="postalCode"
            type="text"
            value={formData.postalCode}
            onChange={handleInputChange}
            disabled={isSubmitting}
            required
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="managerName">{t('auth.register.managerName')}</Label>
        <Input
          id="managerName"
          type="text"
          value={formData.managerName}
          onChange={handleInputChange}
          disabled={isSubmitting}
          required
        />
      </div>
    </>
  );
};

export default CompanyInfoSection;
