import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import BackButton from '@/components/shared/BackButton';
import { ArrowRight, Search, FileText, PlusCircle } from 'lucide-react';
import { useStaticImage } from '@/hooks/useStaticImage';
import vehicleFormScreenshot from '@/assets/vehicle-form-screenshot.png';
import vehicleDetailScreenshot from '@/assets/vehicle-detail-screenshot.png';
import galleryViewScreenshot from '@/assets/gallery-view-screenshot.png';

const VehicleGalleryInfoPage = () => {
  // Use registry-based images that update from Storage
  const { src: showroomHeroSrc, objectPosition: showroomPos } = useStaticImage('hero.vehicles');
  const galleryViewSrc = galleryViewScreenshot;
  const vehicleDetailSrc = vehicleDetailScreenshot;
  const vehicleFormSrc = vehicleFormScreenshot;
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 px-6 pt-6">
      {/* Hero Section con imagen de fondo */}
      <div className="relative overflow-hidden rounded-xl shadow-lg mb-6 mt-4">
        <div className="absolute inset-0">
          <img 
            src={showroomHeroSrc}
            alt="Vehicle Gallery Background"
            className="w-full h-full object-cover"
            style={{ objectPosition: showroomPos }}
          />
        </div>
        <div className="relative z-10 p-8 bg-gradient-to-r from-black/30 to-transparent" style={{ minHeight: '320px' }}>
          <div className="max-w-7xl mx-auto flex flex-col justify-between h-full min-h-[280px]">
            <div className="mb-4">
              <BackButton to="/" label={t('navigation.back')} className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20" />
            </div>
            
            <div className="mt-auto">
              <h1 className="text-4xl font-bold text-white mb-3">
                {t('vehicleGalleryInfo.title')}
              </h1>
              <p className="text-lg text-white font-bold">
                {t('vehicleGalleryInfo.description')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="max-w-7xl mx-auto px-6 py-12 space-y-16">
        
        {/* Section 1: Gallery View */}
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="order-2 md:order-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Search className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold text-foreground">
                {t('vehicleGalleryInfo.section1.title')}
              </h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              {t('vehicleGalleryInfo.section1.description')}
            </p>
          </div>
          <div className="order-1 md:order-2">
            <div className="bg-white/95 dark:bg-white/90 rounded-lg overflow-hidden shadow-xl border border-border">
              <img 
                src={galleryViewSrc} 
                alt="Vehicle Gallery View" 
                className="w-full object-cover aspect-video"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Detail View */}
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="order-1">
            <div className="bg-white/95 dark:bg-white/90 rounded-lg overflow-hidden shadow-xl border border-border">
              <img 
                src={vehicleDetailSrc} 
                alt="Vehicle Detail View" 
                className="w-full object-cover aspect-video"
              />
            </div>
          </div>
          <div className="order-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold text-foreground">
                {t('vehicleGalleryInfo.section2.title')}
              </h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              {t('vehicleGalleryInfo.section2.description')}
            </p>
          </div>
        </div>

        {/* Section 3: Publication Form */}
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="order-2 md:order-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <PlusCircle className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold text-foreground">
                {t('vehicleGalleryInfo.section3.title')}
              </h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              {t('vehicleGalleryInfo.section3.description')}
            </p>
          </div>
          <div className="order-1 md:order-2">
            <div className="bg-white/95 dark:bg-white/90 rounded-lg overflow-hidden shadow-xl border border-border">
              <img 
                src={vehicleFormSrc} 
                alt="Vehicle Publishing Form" 
                className="w-full object-cover aspect-video"
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default VehicleGalleryInfoPage;
