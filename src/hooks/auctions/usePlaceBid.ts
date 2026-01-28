import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';

interface PlaceBidParams {
  auctionId: string;
  amount: number;
}

export const usePlaceBid = () => {
  const queryClient = useQueryClient();
  const { t } = useLanguage();

  return useMutation({
    mutationFn: async ({ auctionId, amount }: PlaceBidParams) => {
      const { data, error } = await supabase.rpc('place_bid', {
        p_auction_id: auctionId,
        p_amount: amount,
      });

      if (error) throw error;

      // Verificar si la respuesta indica error
      if (data && typeof data === 'object' && 'success' in data && !data.success) {
        const message = 'message' in data && typeof data.message === 'string' 
          ? data.message 
          : 'Error al realizar la puja';
        throw new Error(message);
      }

      return data;
    },
    onSuccess: (data, variables) => {
      // Invalidar queries para actualizar datos
      queryClient.invalidateQueries({ queryKey: ['auction', variables.auctionId] });
      queryClient.invalidateQueries({ queryKey: ['auctions'] });
      
      // Mostrar mensaje apropiado
      if (data && typeof data === 'object' && 'extended' in data && data.extended) {
        toast.success(
          t('auctions.bidPlacedExtended', { 
            fallback: '¡Puja realizada! La subasta se ha extendido por anti-sniping.' 
          })
        );
      } else {
        toast.success(
          t('auctions.bidPlacedSuccess', { 
            fallback: '¡Puja realizada con éxito!' 
          })
        );
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || t('auctions.bidError', { fallback: 'Error al realizar la puja' }));
    },
  });
};
