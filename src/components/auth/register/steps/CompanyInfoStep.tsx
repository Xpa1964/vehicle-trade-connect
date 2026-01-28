
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { RegisterFormData } from '@/schemas/registerSchema';
import { HelpCircle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CompanyInfoStepProps {
  form: UseFormReturn<RegisterFormData>;
  companyLogoPreview: string | null;
  handleLogoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isSubmitting: boolean;
}

const CompanyInfoStep: React.FC<CompanyInfoStepProps> = ({
  form,
  companyLogoPreview,
  handleLogoChange,
  isSubmitting
}) => {
  const { t } = useLanguage();
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">
        {t('auth.register.companyInfo')}
      </h3>
      
      <FormField
        control={form.control}
        name="companyName"
        render={({ field }) => (
          <FormItem>
            <div className="flex items-center gap-2">
              <FormLabel>{t('auth.register.companyName')}</FormLabel>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-4 w-4 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="w-80">
                      {t('auth.register.companyNameHelp')}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <FormControl>
              <Input
                {...field}
                disabled={isSubmitting}
                placeholder={t('auth.register.companyNamePlaceholder')}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="space-y-2">
        <FormLabel>{t('auth.register.companyLogo')}</FormLabel>
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
                alt="Logo preview" 
                className="h-full w-full object-contain"
              />
            </div>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('auth.register.city')}</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  disabled={isSubmitting}
                  placeholder={t('auth.register.cityPlaceholder')}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('auth.register.country')}</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  disabled={isSubmitting}
                  placeholder={t('auth.register.countryPlaceholder')}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="postalCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('auth.register.postalCode')}</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  disabled={isSubmitting}
                  placeholder={t('auth.register.postalCodePlaceholder')}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <FormField
        control={form.control}
        name="managerName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('auth.register.managerName')}</FormLabel>
            <FormControl>
              <Input
                {...field}
                disabled={isSubmitting}
                placeholder={t('auth.register.managerNamePlaceholder')}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default CompanyInfoStep;
