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

      // FASE 3: Usar RPC function optimizada para obtener todas las stats en 1 query
      const startTime = Date.now();
      console.log('📊 [useStatistics] Fetching stats via RPC function');

      const { data, error } = await supabase
        .rpc('get_user_dashboard_stats', { user_uuid: user.id });

      if (error) {
        console.error('❌ [useStatistics] Error:', error);
        throw error;
      }

      const duration = Date.now() - startTime;
      console.log(`✅ [useStatistics] Stats loaded in ${duration}ms`);

      // Parse la respuesta JSON con casting adecuado
      const stats = data as {
        vehicles: { count: number };
        announcements: { count: number };
        messages: { count: number };
        exchanges: { count: number };
      };

      return {
        vehicles: stats?.vehicles || { count: 0 },
        announcements: stats?.announcements || { count: 0 },
        messages: stats?.messages || { count: 0 },
        exchanges: stats?.exchanges || { count: 0 },
      };
    },
    enabled: !!user?.id,
    // FASE 3: Usar configuración DYNAMIC optimizada
    ...QUERY_CONFIG.DYNAMIC,
    retry: 1,
  });

  return {
    vehicles: data?.vehicles || { count: 0 },
    announcements: data?.announcements || { count: 0 },
    messages: data?.messages || { count: 0 },
    exchanges: data?.exchanges || { count: 0 },
    isLoading,
    error,
    ...rest
  };
}
