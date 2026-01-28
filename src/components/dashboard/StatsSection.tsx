
import React from 'react';
import { Car, Volume2, MessageCircle, BarChart3, RefreshCw } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import StatsCard from './StatsCard';
import { useStatistics } from '@/hooks/useStatistics';

// FASE 4: Memoizar componente para evitar re-renders innecesarios
const StatsSection: React.FC = React.memo(() => {
  const { t } = useLanguage();
  const { vehicles, announcements, messages, exchanges, isLoading } = useStatistics();

  return (
    <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mb-4 sm:mb-6">
      <StatsCard
        title={t('dashboard.totalVehicles', { fallback: 'Vehículos Publicados' })}
        value={vehicles?.count || 0}
        description=""
        icon={Car}
        isLoading={isLoading}
        className="touch-manipulation"
      />
      <StatsCard
        title={t('dashboard.activeAnnouncements', { fallback: 'Anuncios Activos' })}
        value={announcements?.count || 0}
        description=""
        icon={Volume2}
        isLoading={isLoading}
        className="touch-manipulation"
      />
      <StatsCard
        title={t('dashboard.unreadMessages', { fallback: 'Mensajes No Leídos' })}
        value={messages?.count || 0}
        description=""
        icon={MessageCircle}
        isLoading={isLoading}
        className="touch-manipulation"
      />
      <StatsCard
        title={t('dashboard.exchangesDescription', { fallback: 'Intercambios' })}
        value={exchanges?.count || 0}
        description=""
        icon={RefreshCw}
        isLoading={isLoading}
        className="touch-manipulation"
      />
    </div>
  );
});

// Display name para React DevTools
StatsSection.displayName = 'StatsSection';

export default StatsSection;
