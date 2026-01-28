
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardProfile from '@/components/dashboard/DashboardProfile';
import DashboardMessaging from '@/components/dashboard/DashboardMessaging';
import QuickActionsCarousel from '@/components/dashboard/QuickActionsCarousel';
import StatsSection from '@/components/dashboard/StatsSection';
import ControlPanel from '@/components/dashboard/ControlPanel';

const DashboardMainPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { t } = useLanguage();
  
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-4">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground text-center">
          {t('auth.sessionRequired', { fallback: 'Sesión no iniciada' })}
        </h2>
        <p className="text-muted-foreground text-center text-sm sm:text-base">
          {t('auth.loginRequired', { fallback: 'Debes iniciar sesión para ver el dashboard.' })}
        </p>
        <Button variant="gold" asChild className="min-h-[44px] px-6">
          <Link to="/login">{t('auth.login', { fallback: 'Iniciar Sesión' })}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background w-full">
      <div className="w-full px-3 sm:px-4 md:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* Header Section - Full Width with responsive spacing */}
        <DashboardHeader user={user} />
        
        {/* Profile and Messaging Section - 2/3 + 1/3 layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="lg:col-span-2">
            <DashboardProfile user={user} />
          </div>
          <div className="lg:col-span-1">
            <DashboardMessaging />
          </div>
        </div>
        
        {/* Statistics Section - Full Width with responsive spacing */}
        <StatsSection />
        
        {/* Panel de Control Unificado - Full Width */}
        <ControlPanel />
      </div>
    </div>
  );
};

export default DashboardMainPage;
