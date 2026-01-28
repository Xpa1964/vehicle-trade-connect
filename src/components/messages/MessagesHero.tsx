import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import messagesHeroBg from '@/assets/messages-hero-bg.png';

const MessagesHero: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="relative overflow-hidden rounded-xl shadow-lg mb-4 sm:mb-6">
      <div className="absolute inset-0">
        <img 
          src={messagesHeroBg}
          alt="Messages Background"
          className="w-full h-full object-cover object-center"
          style={{ minHeight: '200px' }}
          onError={(e) => {
            console.log('Error loading messages background image, using gradient fallback');
            e.currentTarget.style.display = 'none';
            const parent = e.currentTarget.parentElement;
            if (parent) {
              parent.style.background = 'linear-gradient(135deg, #3730a3 0%, #1e40af 50%, #1e3a8a 100%)';
            }
          }}
          onLoad={() => {
            console.log('Messages background image loaded successfully');
          }}
        />
      </div>
      
      <div className="relative z-10 p-4 sm:p-8" style={{ minHeight: '200px' }}>
        <div className="flex flex-col justify-end h-full">
          <div className="mb-3 sm:mb-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate('/dashboard')}
              className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 touch-manipulation min-h-[44px]"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('navigation.backToDashboard', { fallback: 'Volver al Panel de Control' })}
            </Button>
          </div>
          
          <div className="inline-block bg-black/20 backdrop-blur-sm rounded-lg p-3 sm:p-4 border border-white/10 w-fit">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1 sm:mb-2">
              {t('messages.title', { fallback: 'Mensajería' })}
            </h1>
            <p className="text-base sm:text-lg text-white font-bold">
              {t('messages.description', { fallback: 'Gestiona todas tus conversaciones en un solo lugar' })}
            </p>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesHero;
