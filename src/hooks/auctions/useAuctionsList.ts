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
          *,
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
          creator:profiles!auctions_created_by_fkey(
            id,
            company_name,
            full_name,
            email
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
        .order('created_at', { ascending: false });

      // Filtrar por estado
      if (params.status && params.status.length > 0) {
        query = query.in('status', params.status);
        
        // Si NO está filtrando por 'ended', ocultar subastas que pasaron 48h
        if (!params.status.includes('ended')) {
          query = query.or('hidden_at.is.null,hidden_at.gt.' + new Date().toISOString());
        }
      } else {
        // Si no hay filtro de status, ocultar subastas que pasaron 48h
        query = query.or('hidden_at.is.null,hidden_at.gt.' + new Date().toISOString());
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
