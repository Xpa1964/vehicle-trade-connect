
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardProfile from '@/components/dashboard/DashboardProfile';
import QuickActions from '@/components/dashboard/QuickActions';
import StatsSection from '@/components/dashboard/StatsSection';
import ControlPanel from '@/components/dashboard/ControlPanel';

const DashboardNew: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { t } = useLanguage();
  
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 bg-background">
        <h2 className="text-2xl font-bold text-foreground">{t('auth.sessionRequired', { fallback: 'Sesión no iniciada' })}</h2>
        <p className="text-muted-foreground">{t('auth.loginRequired', { fallback: 'Debes iniciar sesión para ver el dashboard.' })}</p>
        <Button variant="gold" asChild>
          <Link to="/login">{t('auth.login', { fallback: 'Iniciar Sesión' })}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background w-full">
      <div className="w-full px-4 py-6 space-y-6">
        {/* Header Section - Full Width */}
        <DashboardHeader user={user} />
        
        {/* Profile Section - Full Width */}
        <DashboardProfile user={user} />
        
        {/* Statistics Section - Full Width */}
        <StatsSection />
        
        {/* Layout: Control Panel (4/5) + Quick Actions (1/5) */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Control Panel - 4 de 5 columnas (80% del ancho) */}
          <div className="lg:col-span-4">
            <ControlPanel />
          </div>
          
          {/* Quick Actions - 1 de 5 columnas (20% del ancho) - VERTICAL */}
          <div className="lg:col-span-1">
            <QuickActions />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardNew;
