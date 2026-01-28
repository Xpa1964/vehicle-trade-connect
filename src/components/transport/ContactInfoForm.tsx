
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { FormValues } from './types';

interface ContactInfoFormProps {
  form: UseFormReturn<FormValues>;
}

const ContactInfoForm: React.FC<ContactInfoFormProps> = ({ form }) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-4 pt-4 border-t">
      <h3 className="text-lg font-medium">{t('transport.form.contactInfo')}</h3>
      
      {/* Origin contact */}
      <div className="space-y-4">
        <h4 className="font-medium">{t('transport.form.originContact')}</h4>
        <div className="grid gap-6 md:grid-cols-3">
          <FormField
            control={form.control}
            name="originContact"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('transport.form.originContact')}</FormLabel>
                <FormControl>
                  <Input placeholder="Juan Pérez" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="originEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('transport.form.originEmail')}</FormLabel>
                <FormControl>
                  <Input placeholder="juan@ejemplo.com" type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="originPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('transport.form.originPhone')}</FormLabel>
                <FormControl>
                  <Input placeholder="+34 612 345 678" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
      
      {/* Destination contact */}
      <div className="space-y-4 mt-6">
        <h4 className="font-medium">{t('transport.form.destinationContact')}</h4>
        <div className="grid gap-6 md:grid-cols-3">
          <FormField
            control={form.control}
            name="destinationContact"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('transport.form.destinationContact')}</FormLabel>
                <FormControl>
                  <Input placeholder="Marie Dubois" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="destinationEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('transport.form.destinationEmail')}</FormLabel>
                <FormControl>
                  <Input placeholder="marie@example.com" type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="destinationPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('transport.form.destinationPhone')}</FormLabel>
                <FormControl>
                  <Input placeholder="+33 712 345 678" {...field} />
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

export default ContactInfoForm;
