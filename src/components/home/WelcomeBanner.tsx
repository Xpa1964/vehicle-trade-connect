
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
    <div className="fixed top-14 sm:top-16 left-0 right-0 z-40 bg-primary/40 backdrop-blur-md text-white py-2 px-4 shadow-sm">
      <div className="container mx-auto flex items-center justify-between gap-2">
        <span className="text-sm font-medium truncate">
          {t('dashboard.welcome', { fallback: '¡Bienvenido' })}, {displayName}!
        </span>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Button 
            variant="secondary" 
            size="sm"
            onClick={() => handleNavigate('/dashboard')}
            className="flex items-center gap-1.5 h-8 text-xs sm:text-sm touch-manipulation"
          >
            {t('nav.dashboard', { fallback: 'Panel' })}
            <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
          </Button>
          {user?.role === 'admin' && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleNavigate('/admin/dashboard')}
              className="h-8 text-xs sm:text-sm border-white/40 text-white hover:bg-white/20 touch-manipulation"
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
