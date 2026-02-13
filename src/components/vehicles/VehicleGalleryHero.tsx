
import React from 'react';
import SimpleImage from '@/components/shared/SimpleImage';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const VehicleGalleryHero: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  return (
    <div className="relative overflow-hidden rounded-xl shadow-lg">
      {/* Background usando SimpleImage para mejor rendimiento */}
      <div className="absolute inset-0">
        <SimpleImage
          src="/images/showroom-gallery.png"
          alt={t('vehicles.galleryTitle')}
          className="w-full h-full object-cover object-center"
          style={{ minHeight: '320px' }}
          loading="eager"
        />
      </div>
      
      {/* Content */}
      <div className="relative z-10 p-8" style={{ minHeight: '320px' }}>
        <div className="flex flex-col justify-between h-full">
          {/* Back button */}
          <div className="mb-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate('/dashboard')}
              className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('navigation.backToDashboard')}
            </Button>
          </div>
          
          <div className="flex flex-col justify-end flex-1 space-y-3">
            <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              {t('vehicles.galleryTitle')}
            </h1>
            <p className="text-lg text-white font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              {t('vehicles.galleryDescription')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleGalleryHero;
