
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { UseFormReturn } from 'react-hook-form';
import { RegisterFormData } from '@/schemas/registerSchema';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

interface BusinessDetailsStepProps {
  form: UseFormReturn<RegisterFormData>;
  isSubmitting: boolean;
}

const BusinessDetailsStep: React.FC<BusinessDetailsStepProps> = ({
  form,
  isSubmitting
}) => {
  const { t } = useLanguage();
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">
        {t('auth.register.businessDetails')}
      </h3>
      
      <FormField
        control={form.control}
        name="businessType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('auth.register.businessType')}</FormLabel>
            <Select 
              onValueChange={field.onChange} 
              defaultValue={field.value}
              disabled={isSubmitting}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={t('auth.register.selectActivity')} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="dealer">Concesionario</SelectItem>
                <SelectItem value="multibrand_used">Multimarca VO</SelectItem>
                <SelectItem value="buy_sell">Compraventa</SelectItem>
                <SelectItem value="rent_a_car">Rent a Car</SelectItem>
                <SelectItem value="renting">Renting</SelectItem>
                <SelectItem value="workshop">Taller</SelectItem>
                <SelectItem value="importer">Importador</SelectItem>
                <SelectItem value="exporter">Exportador</SelectItem>
                <SelectItem value="trader">Comerciante</SelectItem>
                <SelectItem value="other">Otro</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="traderType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('auth.register.traderType')}</FormLabel>
            <Select 
              onValueChange={field.onChange} 
              defaultValue={field.value}
              disabled={isSubmitting}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={t('auth.register.selectType')} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="buyer">{t('auth.register.buyer')}</SelectItem>
                <SelectItem value="seller">{t('auth.register.seller')}</SelectItem>
                <SelectItem value="trader">{t('auth.register.trader')}</SelectItem>
                <SelectItem value="buyer_seller">{t('auth.register.buyerSeller')}</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('auth.register.description')}</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                disabled={isSubmitting}
                placeholder={t('auth.register.briefDescription')}
                className="min-h-[100px]"
              />
            </FormControl>
            <FormDescription>
              {t('auth.register.descriptionHelp')}
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default BusinessDetailsStep;
