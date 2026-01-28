import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';

type VehicleStatus = 'reserved' | 'sold' | 'available';

interface StatusChangeParams {
  vehicleId: string;
  status: VehicleStatus;
}

export const useVehicleStatusChange = () => {
  const queryClient = useQueryClient();
  const { t } = useLanguage();

  const markVehicleStatus = useMutation({
    mutationFn: async ({ vehicleId, status }: StatusChangeParams) => {
      // 1. Actualizar estado en BD
      const { error: updateError } = await supabase
        .from('vehicles')
        .update({ status })
        .eq('id', vehicleId);

      if (updateError) {
        console.error('[Vehicle Status Change] Update error:', updateError);
        throw updateError;
      }

      // 2. Llamar edge function para enviar email solo si NO es reactivación
      if (status !== 'available') {
        const { data, error: emailError } = await supabase.functions.invoke(
          'send-vehicle-contact-details',
          {
            body: { vehicleId, status }
          }
        );

        if (emailError) {
          console.error('[Vehicle Status Change] Email error:', emailError);
          throw emailError;
        }

        return data;
      }

      return { contactsCount: 0 };
    },
    onSuccess: (data, variables) => {
      let message: string;
      
      if (variables.status === 'available') {
        message = t('vehicles.statusActions.reactivated');
      } else {
        const statusText = variables.status === 'reserved' 
          ? t('vehicles.statusActions.reserved') 
          : t('vehicles.statusActions.sold');
        
        const contactsCount = data?.contactsCount || 0;
        message = contactsCount > 0
          ? t('vehicles.statusActions.emailSentWithContacts', { count: contactsCount, status: statusText })
          : t('vehicles.statusActions.emailSentNoContacts', { status: statusText });
      }

      toast.success(message);
      
      // Invalidar queries para refrescar la lista
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    },
    onError: (error) => {
      console.error('[Vehicle Status Change] Mutation error:', error);
      toast.error(t('vehicles.statusActions.error'));
    },
  });

  return { markVehicleStatus };
};
