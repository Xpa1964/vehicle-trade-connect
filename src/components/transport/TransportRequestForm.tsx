
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { VehicleInfoForm, TransportDetailsForm, ContactInfoForm, DateSelectionForm, formSchema, FormValues } from '@/components/transport';

const TransportRequestForm: React.FC = () => {
  const { t } = useLanguage();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      brand: '',
      model: '',
      color: '',
      version: '',
      licensePlate: '',
      chassisNumber: '',
      originAddress: '',
      originCity: '',
      originCountry: '',
      destinationAddress: '',
      destinationCity: '',
      destinationCountry: '',
      originContact: '',
      originEmail: '',
      originPhone: '',
      destinationContact: '',
      destinationEmail: '',
      destinationPhone: '',
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('transport_quotes')
        .insert({
          requester_id: user.user.id,
          user_id: user.user.id,
          brand: data.brand,
          model: data.model,
          color: data.color,
          version: data.version,
          license_plate: data.licensePlate.trim(),
          chassis_number: data.chassisNumber,
          origin_address: data.originAddress,
          origin_city: data.originCity,
          origin_country: data.originCountry,
          destination_address: data.destinationAddress,
          destination_city: data.destinationCity,
          destination_country: data.destinationCountry,
          origin_contact: data.originContact,
          origin_email: data.originEmail,
          origin_phone: data.originPhone,
          destination_contact: data.destinationContact,
          destination_email: data.destinationEmail,
          destination_phone: data.destinationPhone,
          transport_date: data.date.toISOString().split('T')[0]
        });

      if (error) throw error;
      
      alert(t('transportQuotes.notifications.quoteSubmitted'));
      form.reset();
    } catch (error) {
      console.error('Error submitting quote:', error);
      alert(t('transportQuotes.notifications.error'));
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Vehicle Information Section */}
        <VehicleInfoForm form={form} />
        
        {/* Transport Details Section */}
        <TransportDetailsForm form={form} />
        
        {/* Contact Information Section */}
        <ContactInfoForm form={form} />
        
        {/* Date Section */}
        <DateSelectionForm form={form} />
        
        {/* Submit Button */}
        <Button type="submit" className="w-full">
          {t('transport.form.submit')}
        </Button>
      </form>
    </Form>
  );
};

export default TransportRequestForm;
