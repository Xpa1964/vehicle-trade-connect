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
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase.rpc('place_bid', {
        p_auction_id: auctionId,
        p_bidder_id: userData.user.id,
        p_amount: amount,
      });

      if (error) throw error;

      // The place_bid function returns a UUID, not an object
      return data;
    },
    onSuccess: (_data, variables) => {
      // Invalidar queries para actualizar datos
      queryClient.invalidateQueries({ queryKey: ['auction', variables.auctionId] });
      queryClient.invalidateQueries({ queryKey: ['auctions'] });
      
      toast.success(
        t('auctions.bidPlacedSuccess', { 
          fallback: '¡Puja realizada con éxito!' 
        })
      );
    },
    onError: (error: Error) => {
      toast.error(error.message || t('auctions.bidError', { fallback: 'Error al realizar la puja' }));
    },
  });
};
