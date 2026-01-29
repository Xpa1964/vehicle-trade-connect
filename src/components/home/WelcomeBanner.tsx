
import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowRight } from 'lucide-react';

const WelcomeBanner: React.FC = () => {
  const auth = useAuth();
  const { t } = useLanguage();

  // Guard against null context
  if (!auth) return null;
  
  const { isAuthenticated, user } = auth;

  if (!isAuthenticated) return null;

  // Priorizar datos del perfil de la base de datos
  const displayName = user?.profile?.company_name || user?.profile?.full_name || user?.name || 'Usuario';

  const handleNavigate = (path: string) => {
    window.location.href = path;
  };

  return (
    <div className="absolute top-24 left-0 right-0 z-30 bg-gradient-to-b from-black/40 to-transparent text-white py-4 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-center sm:text-left">
          <h2 className="text-sm sm:text-base font-semibold mb-1 text-white drop-shadow-lg">
            {t('dashboard.welcome', { fallback: '¡Bienvenido' })}, {displayName}!
          </h2>
          <p className="text-white/90 text-xs sm:text-sm drop-shadow-md">
            {t('dashboard.welcomeMessage', {
              fallback: 'Tienes nuevas oportunidades esperándote en tu panel de control.'
            })}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button 
            variant="secondary" 
            size="sm"
            onClick={() => handleNavigate('/dashboard')}
            className="flex items-center gap-2 min-h-[44px] touch-manipulation"
          >
            {t('nav.dashboard', {
              fallback: 'Panel de Control'
            })}
            <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
          </Button>
          {user?.role === 'admin' && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleNavigate('/admin/dashboard')}
              className="bg-white/20 border-white/40 text-white hover:bg-white/30 min-h-[44px] touch-manipulation"
            >
              Panel Admin
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default WelcomeBanner;
