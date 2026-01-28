
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
          
          <div className="flex flex-col justify-end flex-1">
            {/* Title with independent mask */}
            <div className="mb-4 bg-black/20 backdrop-blur-sm rounded-lg p-4 border border-white/10 w-fit">
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                {t('vehicles.galleryTitle')}
              </h1>
            </div>
            
            {/* Description with independent mask */}
            <div className="bg-black/20 backdrop-blur-sm rounded-lg p-4 border border-white/10 w-fit">
              <p className="text-lg text-white font-bold">
                {t('vehicles.galleryDescription')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleGalleryHero;
