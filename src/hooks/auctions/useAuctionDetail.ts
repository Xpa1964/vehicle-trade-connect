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
          id,
          vehicle_id,
          created_by,
          seller_id,
          starting_price,
          current_price,
          increment_minimum,
          start_date,
          end_date,
          status,
          winner_id,
          terms_accepted,
          description,
          seller_decision_at,
          seller_decision_reason,
          contact_shared_at,
          closed_at,
          created_at,
          updated_at,
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

      // Fetch reserve_price securely via RPC (only returns value for seller/admin)
      const { data: reservePrice } = await supabase.rpc('get_auction_reserve_price', {
        p_auction_id: auctionId
      });

      // Check if auction has a reserve (boolean, no amount leaked)
      const { data: hasReserve } = await supabase.rpc('auction_has_reserve', {
        p_auction_id: auctionId
      });

      return {
        ...data,
        reserve_price: reservePrice ?? undefined,
        has_reserve: hasReserve ?? false,
      } as unknown as Auction;
    },
    enabled: !!auctionId,
  });
};
