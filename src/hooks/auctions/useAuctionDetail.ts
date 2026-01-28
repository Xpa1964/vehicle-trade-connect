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
          creator:profiles!auctions_created_by_fkey(
            id,
            company_name,
            full_name,
            email,
            contact_phone
          ),
          winner:profiles!auctions_winner_id_fkey(
            id,
            company_name,
            full_name
          ),
          bids!bids_auction_id_fkey(
            id,
            amount,
            created_at,
            bidder:profiles!bids_bidder_id_fkey(
              id,
              company_name,
              full_name
            )
          )
        `)
        .eq('id', auctionId)
        .single();

      if (error) throw error;

      return data as unknown as Auction;
    },
    enabled: !!auctionId,
  });
};
