import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { VehicleInfoForm, TransportDetailsForm, ContactInfoForm, DateSelectionForm, formSchema, FormValues } from '@/components/transport';
import TransportCalculator from './TransportCalculator';
import { CalculationResult } from '@/lib/transportPriceCalculator';
import { Send, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const TransportRequestForm: React.FC = () => {
  const { t } = useLanguage();
  const [calculationResult, setCalculationResult] = useState<CalculationResult | null>(null);
  
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
      // Calculator defaults
      vehicleType: undefined,
      cleaning: false,
      personalizedDelivery: false,
      urgent: false,
      night: false,
      holiday: false,
    },
  });

  // Disable submit if no valid calculation
  const canSubmit = calculationResult && 
    (calculationResult.type === 'FINAL' || calculationResult.type === 'ORIENTATIVE');

  const onSubmit = async (data: FormValues) => {
    if (!canSubmit || !calculationResult) {
      return;
    }

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
          transport_date: data.date.toISOString().split('T')[0],
          // Calculator data
          distance_km: calculationResult.distanceKm,
          quote_amount: calculationResult.price,
          notes: JSON.stringify({
            vehicleType: data.vehicleType,
            resultType: calculationResult.type,
            optionalServices: {
              cleaning: data.cleaning,
              personalizedDelivery: data.personalizedDelivery,
              urgent: data.urgent,
              night: data.night,
              holiday: data.holiday
            },
            breakdown: calculationResult.breakdown,
            drivingTimeHours: calculationResult.drivingTimeHours,
            hourlyRate: calculationResult.hourlyRate
          })
        });

      if (error) throw error;
      
      alert(t('transportQuotes.notifications.quoteSubmitted'));
      form.reset();
      setCalculationResult(null);
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
        
        {/* Price Calculator Section */}
        <TransportCalculator 
          form={form} 
          onCalculationComplete={setCalculationResult}
        />
        
        {/* Submit Button */}
        <div className="space-y-3">
          <Button 
            type="submit" 
            className="w-full"
            disabled={!canSubmit}
            size="lg"
          >
            <Send className="h-4 w-4 mr-2" />
            {t('transport.form.submit')}
          </Button>
          
          {/* Message if no calculation */}
          {!calculationResult && (
            <Alert variant="default" className="border-muted">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {t('transport.calculator.calculateFirst', { 
                  fallback: 'Calcula el precio antes de solicitar presupuesto' 
                })}
              </AlertDescription>
            </Alert>
          )}
          
          {/* Message if not available */}
          {calculationResult?.type === 'NOT_AVAILABLE' && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {t('transport.calculator.notAvailableSubmit', { 
                  fallback: 'No es posible solicitar presupuesto para este trayecto' 
                })}
              </AlertDescription>
            </Alert>
          )}
        </div>
      </form>
    </Form>
  );
};

export default TransportRequestForm;
