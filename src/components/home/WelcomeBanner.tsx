
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
    <div className="fixed top-20 sm:top-24 right-4 sm:right-6 z-40 bg-black/50 backdrop-blur-md rounded-lg px-4 py-3 shadow-lg max-w-xs">
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-white/90">
          {t('dashboard.welcome', { fallback: '¡Bienvenido' })}, {displayName}!
        </span>
        <div className="flex flex-col gap-1.5">
          <Button 
            variant="secondary" 
            size="sm"
            onClick={() => handleNavigate('/dashboard')}
            className="flex items-center justify-center gap-1.5 h-8 text-xs sm:text-sm w-full touch-manipulation"
          >
            {t('nav.dashboard', { fallback: 'Panel de Control' })}
            <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
          </Button>
          {user?.role === 'admin' && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleNavigate('/admin/dashboard')}
              className="h-8 text-xs sm:text-sm border-white/40 text-white hover:bg-white/20 w-full touch-manipulation"
            >
              Admin
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default WelcomeBanner;
