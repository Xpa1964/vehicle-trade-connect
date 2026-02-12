
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import * as z from 'zod';

const formSchema = z.object({
  offerBrand: z.string().min(1, "Brand is required"),
  offerModel: z.string().min(1, "Model is required"),
  offerYear: z.string().min(1, "Year is required"),
  offerKilometers: z.string().min(1, "Kilometers is required"),
  acceptBrands: z.string().min(1, "Brands of interest is required"),
  acceptCountries: z.string().min(1, "Countries of origin is required")
});

export type ExchangeFormData = z.infer<typeof formSchema>;

export const useExchangeForm = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ExchangeFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      offerBrand: '',
      offerModel: '',
      offerYear: '',
      offerKilometers: '',
      acceptBrands: '',
      acceptCountries: '',
    }
  });

  const onSubmit = async (data: ExchangeFormData) => {
    if (!user) {
      toast.error(t('auth.loginRequired'));
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const exchangeData = {
        initiator_id: user.id,
        status: 'pending' as const,
        message: JSON.stringify({
          initiator_vehicle: {
            brand: data.offerBrand,
            model: data.offerModel,
            year: data.offerYear,
            kilometers: data.offerKilometers
          },
          target_preferences: {
            brands: data.acceptBrands,
            countries: data.acceptCountries
          }
        })
      };
      
      const { error } = await supabase
        .from('exchanges')
        .insert(exchangeData);
      
      if (error) {
        console.error('Error submitting exchange request:', error);
        throw error;
      }
      
      toast.success(t('exchanges.exchangeAddedTitle'), {
        description: t('exchanges.exchangeAddedDescription')
      });
      
      form.reset();
      navigate('/exchanges');
    } catch (error) {
      console.error('Error submitting exchange request:', error);
      toast.error(t('common.error'), {
        description: t('exchanges.exchangeErrorDescription')
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    onSubmit,
    isSubmitting
  };
};
