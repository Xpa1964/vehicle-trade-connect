
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Settings, User } from 'lucide-react';
import AudioButton from './AudioButton';

const CallToAction: React.FC = () => {
  const { t } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  return (
    <section className="relative pt-40 pb-20 px-4 overflow-hidden">
      {/* Premium gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-secondary to-card" />
      
      {/* Decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-72 h-72 bg-primary/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/10 rounded-full translate-x-1/2 translate-y-1/2" />
      </div>
      
      <div className="container relative mx-auto max-w-5xl text-center z-10">
        {/* Slogan promocional */}
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            {t('home.promoSlogan', { fallback: 'Descubre KONTACT VO en 5 minutos' })}
          </h2>
          <p className="text-lg text-muted-foreground mb-6 max-w-3xl mx-auto">
            {t('home.promoDescription', { 
              fallback: 'Escucha nuestra presentación completa del marketplace que está revolucionando la importación y exportación de vehículos' 
            })}
          </p>
          
          {/* Audio buttons section */}
          <div className="mb-8">
            <p className="text-sm text-muted-foreground mb-4">
              {t('home.chooseLanguage', { fallback: 'Elige tu idioma preferido:' })}
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <AudioButton 
                language="Español" 
                languageCode="es" 
                audioUrl="/audio/kontact-vo-es.mp3" 
              />
              <AudioButton 
                language="English" 
                languageCode="en" 
                audioUrl="/audio/kontact-vo-en.mp3" 
              />
              <AudioButton 
                language="Français" 
                languageCode="fr" 
                audioUrl="/audio/kontact-vo-fr.mp3" 
              />
              <AudioButton 
                language="Italiano" 
                languageCode="it" 
                audioUrl="/audio/kontact-vo-it.mp3" 
              />
            </div>
          </div>
        </div>

        {/* Action buttons based on authentication status */}
        {isAuthenticated ? (
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              size="lg"
              onClick={() => navigate('/dashboard')}
              className="flex items-center bg-auto-gold hover:bg-auto-gold/90 text-white text-base font-semibold px-8"
            >
              <User className="h-5 w-5 mr-2" />
              {t('nav.dashboard', { fallback: 'Panel de Control' })}
            </Button>
            
            {user?.role === 'admin' && (
              <Button 
                size="lg"
                onClick={() => navigate('/admin/dashboard')}
                className="flex items-center bg-primary hover:bg-primary/90 text-primary-foreground text-base font-semibold px-8"
              >
                <Settings className="h-5 w-5 mr-2" />
                Panel de Administración
              </Button>
            )}
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              size="lg"
              onClick={() => navigate('/register')}
              className="bg-auto-gold hover:bg-auto-gold/90 text-white text-base font-semibold px-8"
            >
              {t('auth.register', { fallback: 'Registrarme ahora' })}
            </Button>
            <Button 
              size="lg"
              onClick={() => navigate('/login')}
              className="bg-secondary hover:bg-secondary/80 text-foreground text-base font-semibold px-8 border border-border"
            >
              {t('auth.login', { fallback: 'Iniciar sesión' })}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default CallToAction;
