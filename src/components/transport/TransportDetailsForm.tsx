
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { FormValues } from './types';

interface TransportDetailsFormProps {
  form: UseFormReturn<FormValues>;
}

const TransportDetailsForm: React.FC<TransportDetailsFormProps> = ({ form }) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-4 pt-4 border-t">
      <h3 className="text-lg font-medium">{t('transport.form.transportDetails')}</h3>
      
      {/* Origin details */}
      <div className="space-y-4">
        <h4 className="font-medium">{t('transport.form.origin')}</h4>
        <div className="grid gap-6 md:grid-cols-3">
          <FormField
            control={form.control}
            name="originAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('transport.form.originAddress')}</FormLabel>
                <FormControl>
                  <Input placeholder="Calle Principal 123" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="originCity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('transport.form.originCity')}</FormLabel>
                <FormControl>
                  <Input placeholder="Madrid" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="originCountry"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('transport.form.originCountry')}</FormLabel>
                <FormControl>
                  <Input placeholder="España" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
      
      {/* Destination details */}
      <div className="space-y-4 mt-6">
        <h4 className="font-medium">{t('transport.form.destination')}</h4>
        <div className="grid gap-6 md:grid-cols-3">
          <FormField
            control={form.control}
            name="destinationAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('transport.form.destinationAddress')}</FormLabel>
                <FormControl>
                  <Input placeholder="Avenue Principale 456" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="destinationCity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('transport.form.destinationCity')}</FormLabel>
                <FormControl>
                  <Input placeholder="Paris" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="destinationCountry"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('transport.form.destinationCountry')}</FormLabel>
                <FormControl>
                  <Input placeholder="Francia" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default TransportDetailsForm;
