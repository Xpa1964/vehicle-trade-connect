import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { QUERY_CONFIG } from '@/lib/react-query';

export function useStatistics() {
  const { user } = useAuth();
  
  const { data, isLoading, error, ...rest } = useQuery({
    queryKey: ['dashboard-statistics', user?.id],
    queryFn: async () => {
      if (!user?.id) {
        throw new Error('User ID is required');
      }

      console.log('📊 [useStatistics] Fetching stats via direct queries');
      const startTime = Date.now();

      // Query vehicles count
      const { count: vehiclesCount } = await supabase
        .from('vehicles')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      // Query announcements count
      const { count: announcementsCount } = await supabase
        .from('announcements')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      // Query unread messages count
      const { count: messagesCount } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .is('read_at', null);

      // Query exchanges count
      const { count: exchangesCount } = await supabase
        .from('exchanges')
        .select('*', { count: 'exact', head: true })
        .or(`initiator_id.eq.${user.id},receiver_id.eq.${user.id}`);

      // Query auctions count
      const { count: auctionsCount } = await supabase
        .from('auctions')
        .select('*', { count: 'exact', head: true })
        .eq('seller_id', user.id);

      const duration = Date.now() - startTime;
      console.log(`✅ [useStatistics] Stats loaded in ${duration}ms`);

      return {
        vehicles: { count: vehiclesCount || 0 },
        announcements: { count: announcementsCount || 0 },
        messages: { count: messagesCount || 0 },
        exchanges: { count: exchangesCount || 0 },
        auctions: { count: auctionsCount || 0 },
      };
    },
    enabled: !!user?.id,
    ...QUERY_CONFIG.DYNAMIC,
    retry: 1,
  });

  return {
    vehicles: data?.vehicles || { count: 0 },
    announcements: data?.announcements || { count: 0 },
    messages: data?.messages || { count: 0 },
    exchanges: data?.exchanges || { count: 0 },
    auctions: data?.auctions || { count: 0 },
    isLoading,
    error,
    ...rest
  };
}
