import React from 'react';
import { Car, Gavel, ArrowLeftRight, Volume2, MessageCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useStatistics } from '@/hooks/useStatistics';

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ElementType;
  isLoading?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, isLoading }) => {
  return (
    <div className="flex items-center gap-4 bg-card/80 backdrop-blur-sm rounded-xl p-4 border border-border/50 min-w-[140px]">
      <div className="p-3 bg-primary/10 rounded-full">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-wide">{title}</p>
        {isLoading ? (
          <div className="h-8 w-12 bg-muted animate-pulse rounded mt-1" />
        ) : (
          <p className="text-2xl font-bold text-foreground">{value}</p>
        )}
      </div>
    </div>
  );
};

const StatsBar: React.FC = React.memo(() => {
  const { t } = useLanguage();
  const { vehicles, announcements, messages, exchanges, auctions, isLoading } = useStatistics();

  const stats = [
    {
      title: t('dashboard.totalVehicles', { fallback: 'Vehículos' }),
      value: vehicles?.count || 0,
      icon: Car
    },
    {
      title: t('nav.auctionRoom', { fallback: 'Subastas' }),
      value: auctions?.count || 0,
      icon: Gavel
    },
    {
      title: t('nav.exchanges', { fallback: 'Intercambios' }),
      value: exchanges?.count || 0,
      icon: ArrowLeftRight
    },
    {
      title: t('dashboard.activeAnnouncements', { fallback: 'Anuncios' }),
      value: announcements?.count || 0,
      icon: Volume2
    },
    {
      title: t('dashboard.unreadMessages', { fallback: 'Mensajes' }),
      value: messages?.count || 0,
      icon: MessageCircle
    }
  ];

  return (
    <div className="flex overflow-x-auto gap-4 pb-2 scrollbar-hide lg:grid lg:grid-cols-5 lg:gap-4 lg:overflow-visible">
      {stats.map((stat, index) => (
        <StatCard
          key={index}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          isLoading={isLoading}
        />
      ))}
    </div>
  );
});

StatsBar.displayName = 'StatsBar';

export default StatsBar;
