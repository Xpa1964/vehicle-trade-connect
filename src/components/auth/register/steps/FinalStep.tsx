
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';
import { 
  FormField,
  FormItem,
  FormControl,
  FormDescription,
  FormMessage
} from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { UseFormReturn } from 'react-hook-form';
import { RegisterFormData, generateUsername } from '@/schemas/registerSchema';
import { Card, CardContent } from '@/components/ui/card';
import { Check } from 'lucide-react';

interface FinalStepProps {
  form: UseFormReturn<RegisterFormData>;
  isSubmitting: boolean;
}

const FinalStep: React.FC<FinalStepProps> = ({
  form,
  isSubmitting
}) => {
  const { t } = useLanguage();
  
  const companyName = form.getValues('companyName');
  const lastName = form.getValues('managerLastName');
  const generatedUsername = companyName && lastName ? generateUsername(companyName, lastName) : '—';
  
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">
        {t('auth.register.reviewAndSubmit')}
      </h3>
      
      <div className="space-y-4">
        <Card>
          <CardContent className="p-4 space-y-4">
            {/* Generated username preview */}
            <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
              <h4 className="text-sm font-medium text-primary">
                {t('auth.register.generatedUsername', { fallback: 'Tu nombre de usuario' })}
              </h4>
              <p className="text-lg font-bold text-primary">{generatedUsername}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {t('auth.register.usernameExplanation', { fallback: 'Se genera automáticamente a partir del nombre de empresa y apellido del responsable' })}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">{t('auth.register.companyName')}</h4>
                <p className="text-sm">{form.getValues('companyName')}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">{t('auth.register.location')}</h4>
                <p className="text-sm">
                  {form.getValues('city')}, {form.getValues('country')} {form.getValues('postalCode')}
                </p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">{t('auth.register.managerFirstName', { fallback: 'Nombre' })}</h4>
                <p className="text-sm">{form.getValues('managerFirstName')} {form.getValues('managerLastName')}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">{t('auth.register.contactPerson')}</h4>
                <p className="text-sm">{form.getValues('contactPerson')}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">{t('auth.register.email')}</h4>
                <p className="text-sm">{form.getValues('email')}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">{t('auth.register.phone')}</h4>
                <p className="text-sm">{form.getValues('phone')}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">{t('auth.register.businessType')}</h4>
                <p className="text-sm">{t(`auth.register.${form.getValues('businessType')}`)}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">{t('auth.register.traderType')}</h4>
                <p className="text-sm">{t(`auth.register.${form.getValues('traderType')}`)}</p>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">{t('auth.register.description')}</h4>
              <p className="text-sm">{form.getValues('description')}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">{t('auth.register.documents')}</h4>
              <p className="text-sm flex items-center gap-2">
                <Check className="h-4 w-4 text-[#22C55E]" />
                {form.getValues('documents')?.length || 0} {t('auth.register.filesSelected')}
              </p>
            </div>
          </CardContent>
        </Card>
        
        <FormField
          control={form.control}
          name="termsAccepted"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 mt-4">
              <FormControl>
                <Checkbox 
                  checked={field.value} 
                  onCheckedChange={field.onChange} 
                  disabled={isSubmitting}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormDescription>
                  {t('auth.register.acceptTerms')}{' '}
                  <Link 
                    to="/terms-and-conditions" 
                    target="_blank" 
                    className="text-auto-blue hover:underline"
                  >
                    {t('footer.terms')}
                  </Link>
                </FormDescription>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default FinalStep;
