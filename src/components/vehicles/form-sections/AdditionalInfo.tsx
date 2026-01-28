
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/contexts/LanguageContext';
import { UseFormReturn } from 'react-hook-form';
import { VehicleFormData } from '@/types/vehicle';

interface AdditionalInfoProps {
  form: UseFormReturn<VehicleFormData>;
}

export const AdditionalInfo: React.FC<AdditionalInfoProps> = ({ form }) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold">{t('vehicles.additionalInfo')}</h3>
      
      <FormField
        control={form.control}
        name="status"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('vehicles.status')}</FormLabel>
            <Select onValueChange={field.onChange} value={field.value || 'available'}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={t('vehicles.selectStatus')} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="available">{t('vehicles.statusAvailable')}</SelectItem>
                <SelectItem value="reserved">{t('vehicles.statusReserved')}</SelectItem>
                <SelectItem value="sold">{t('vehicles.statusSold')}</SelectItem>
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
            <FormLabel>{t('vehicles.additionalDescription')}</FormLabel>
            <FormControl>
              <Textarea
                placeholder={t('vehicles.additionalDescriptionPlaceholder')}
                className="min-h-[120px]"
                {...field}
                onChange={(e) => field.onChange(e.target.value)}
                value={field.value || ''}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
