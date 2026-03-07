import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Auction, AuctionStatus } from '@/types/auction';

interface UseAuctionsListParams {
  status?: AuctionStatus[];
  category?: string;
  priceMin?: number;
  priceMax?: number;
  searchTerm?: string;
  limit?: number;
  offset?: number;
}

export const useAuctionsList = (params: UseAuctionsListParams = {}) => {
  return useQuery({
    queryKey: ['auctions', params],
    queryFn: async () => {
      let query = supabase
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
          description,
          created_at,
          updated_at,
          vehicle:vehicles(
            id,
            brand,
            model,
            year,
            thumbnailurl,
            mileage,
            fuel,
            transmission,
            location,
            country
          ),
          bids(
            id,
            amount,
            created_at,
            bidder_id,
            is_winning
          )
        `)
        .order('created_at', { ascending: false });

      // Filtrar por estado - Estados oficiales según Documento Capa 1
      if (params.status && params.status.length > 0) {
        query = query.in('status', params.status);
      }

      // Filtrar por rango de precio
      if (params.priceMin !== undefined) {
        query = query.gte('current_price', params.priceMin);
      }
      if (params.priceMax !== undefined) {
        query = query.lte('current_price', params.priceMax);
      }

      // Paginación
      if (params.limit) {
        query = query.limit(params.limit);
      }
      if (params.offset) {
        query = query.range(params.offset, params.offset + (params.limit || 10) - 1);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Filtrar por búsqueda de texto (cliente)
      let filteredData = data as unknown as Auction[];
      
      if (params.searchTerm) {
        const searchLower = params.searchTerm.toLowerCase();
        filteredData = filteredData.filter(auction => {
          const vehicle = auction.vehicle;
          if (!vehicle) return false;
          
          return (
            vehicle.brand?.toLowerCase().includes(searchLower) ||
            vehicle.model?.toLowerCase().includes(searchLower)
          );
        });
      }

      return filteredData;
    },
  });
};
