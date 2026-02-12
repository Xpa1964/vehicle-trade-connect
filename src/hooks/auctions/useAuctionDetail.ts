import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Auction } from '@/types/auction';

export const useAuctionDetail = (auctionId: string | undefined) => {
  return useQuery({
    queryKey: ['auction', auctionId],
    queryFn: async () => {
      if (!auctionId) throw new Error('Auction ID is required');

      const { data, error } = await supabase
        .from('auctions')
        .select(`
          *,
          vehicle:vehicles(
            id,
            brand,
            model,
            year,
            price,
            mileage,
            fuel,
            transmission,
            doors,
            location,
            country,
            color,
            description,
            thumbnailurl,
            status
          ),
          bids(
            id,
            amount,
            created_at,
            bidder_id,
            is_winning
          )
        `)
        .eq('id', auctionId)
        .maybeSingle();

      if (error) throw error;
      if (!data) throw new Error('Auction not found');

      return data as unknown as Auction;
    },
    enabled: !!auctionId,
  });
};
