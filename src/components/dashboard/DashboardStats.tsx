
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import StatsCard from './StatsCard';
import { Car, MessageSquare, FileText, TrendingUp } from 'lucide-react';

const DashboardStats: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();

  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      const [vehiclesResult, messagesResult, announcementsResult] = await Promise.all([
        supabase
          .from('vehicles')
          .select('id', { count: 'exact' })
          .eq('user_id', user.id),
        supabase
          .from('conversations')
          .select('id', { count: 'exact' })
          .or(`seller_id.eq.${user.id},buyer_id.eq.${user.id}`),
        supabase
          .from('announcements')
          .select('id', { count: 'exact' })
          .eq('user_id', user.id)
      ]);

      return {
        vehicles: vehiclesResult.count || 0,
        messages: messagesResult.count || 0,
        announcements: announcementsResult.count || 0
      };
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000
  });

  if (!stats) return null;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title={t('dashboard.totalVehicles')}
        value={stats.vehicles}
        description={t('dashboard.vehiclesDescription')}
        icon={Car}
        isLoading={isLoading}
      />
      <StatsCard
        title={t('dashboard.unreadMessages')}
        value={stats.messages}
        description={t('dashboard.messagesDescription')}
        icon={MessageSquare}
        isLoading={isLoading}
      />
      <StatsCard
        title={t('dashboard.activeAnnouncements')}
        value={stats.announcements}
        description={t('dashboard.bulletinDescription')}
        icon={FileText}
        isLoading={isLoading}
      />
      <StatsCard
        title={t('dashboard.monthlyRevenue')}
        value="€0"
        description={t('dashboard.reportsDescription')}
        icon={TrendingUp}
        isLoading={isLoading}
      />
    </div>
  );
};

export default DashboardStats;
