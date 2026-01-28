
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

// CACHE BUSTER - Timestamp: 2025-01-04-14:30:00
// Componente completamente nuevo para evitar problemas de caché
const DashboardNew: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { t } = useLanguage();
  
  // Componente de diagnóstico para verificar carga correcta
  const debugInfo = {
    loadTime: new Date().toISOString(),
    componentVersion: 'v2.0-cache-fix',
    layoutType: 'control-panel-4col-quickactions-1col'
  };
  
  console.log('[Dashboard Cache Fix] Cargando componente:', debugInfo);
  
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <h2 className="text-2xl font-bold text-gray-800">{t('auth.sessionRequired', { fallback: 'Sesión no iniciada' })}</h2>
        <p className="text-gray-600">{t('auth.loginRequired', { fallback: 'Debes iniciar sesión para ver el dashboard.' })}</p>
        <Button variant="gold" asChild>
          <Link to="/login">{t('auth.login', { fallback: 'Iniciar Sesión' })}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      {/* Indicador de diagnóstico temporal - REMOVER DESPUÉS */}
      <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 text-xs">
        🔄 Dashboard Cache Fix - Cargado: {debugInfo.loadTime} | Layout: ControlPanel(4/5) + QuickActions(1/5)
      </div>
      
      <div className="w-full px-4 py-6 space-y-6">
        {/* Header Section - Full Width */}
        <DashboardHeader user={user} />
        
        {/* Profile Section - Full Width */}
        <DashboardProfile user={user} />
        
        {/* Statistics Section - Full Width */}
        <StatsSection />
        
        {/* Layout CORREGIDO: Control Panel (4/5) + Quick Actions (1/5) */}
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
