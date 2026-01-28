import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';

export const useAuctionRealtime = (auctionId?: string) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!auctionId) return;

    // Canal para cambios en bids
    const bidsChannel: RealtimeChannel = supabase
      .channel(`bids-${auctionId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'bids',
          filter: `auction_id=eq.${auctionId}`,
        },
        () => {
          // Invalidar query de la subasta para refrescar datos
          queryClient.invalidateQueries({ queryKey: ['auction', auctionId] });
        }
      )
      .subscribe();

    // Canal para cambios en la subasta
    const auctionChannel: RealtimeChannel = supabase
      .channel(`auction-${auctionId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'auctions',
          filter: `id=eq.${auctionId}`,
        },
        () => {
          // Invalidar query de la subasta para refrescar datos
          queryClient.invalidateQueries({ queryKey: ['auction', auctionId] });
        }
      )
      .subscribe();

    // Cleanup
    return () => {
      supabase.removeChannel(bidsChannel);
      supabase.removeChannel(auctionChannel);
    };
  }, [auctionId, queryClient]);
};
