
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import SafeImage from '@/components/shared/SafeImage';

const BulletinHero: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="relative overflow-hidden rounded-xl shadow-lg mb-4 sm:mb-6">
      <div className="absolute inset-0">
        <SafeImage 
          imageId="hero.bulletin"
          alt="Bulletin Background"
          className="w-full h-full object-cover object-center"
          style={{ minHeight: '220px' }}
        />
      </div>
      
      <div className="relative z-10 p-4 sm:p-8" style={{ minHeight: '220px' }}>
        <div className="flex flex-col justify-between h-full min-h-[180px]">
          <div className="mb-3 sm:mb-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate('/dashboard')}
              className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 touch-manipulation min-h-[44px] relative z-20"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('navigation.backToControlPanel')}
            </Button>
          </div>
          
          <div className="flex flex-col justify-end flex-1 h-full space-y-3">
            <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              {t('bulletin.title', { fallback: 'Tablón de Anuncios' })}
            </h1>
            <p className="text-lg text-white font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              {t('bulletin.subtitle', { fallback: 'Conectando profesionales del sector automotriz internacional' })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulletinHero;
