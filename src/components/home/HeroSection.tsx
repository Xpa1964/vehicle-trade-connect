import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import SimpleImage from '@/components/shared/SimpleImage';
import { useImagePreload } from '@/hooks/useImagePreload';
import { useStaticImage } from '@/hooks/useStaticImage';
import heroBackgroundImg from '@/assets/hero-background.png';

const HeroSection: React.FC = () => {
  const { t, currentLanguage } = useLanguage();
  
  // Get images from registry (storage override) or fallback to imported asset
  const heroBackground = useStaticImage('home.hero');
  const heroLogo = useStaticImage('home.logo.hero');
  
  // Use storage URL if available, otherwise use the imported asset
  const heroBackgroundSrc = heroBackground.isFromStorage ? heroBackground.src : heroBackgroundImg;
  
  // Preload critical LCP image
  useImagePreload([heroBackgroundSrc]);
  
  // Check if current language is Spanish or French
  const isSpanishOrFrench = currentLanguage === 'es' || currentLanguage === 'fr';

  return (
    <section 
      className="relative w-full h-screen overflow-hidden print:hidden"
      aria-label="Hero section"
    >
      {/* Hero Image Layer - Using imported asset with storage override */}
      <div className="absolute inset-0 w-full h-full" aria-hidden="true">
        <SimpleImage
          src={heroBackgroundSrc}
          alt="Fondo de vehículos de lujo profesionales"
          className="w-full h-full object-cover object-center"
          loading="eager"
          width={1818}
          height={1280}
          onError={(e) => {
            // Fallback from registry
            if (heroBackground.fallback) {
              e.currentTarget.src = heroBackground.fallback;
            }
          }}
        />
      </div>

      {/* Content Layer - Responsive spacing */}
      <div className="relative w-full h-full flex items-center justify-center z-10 pt-20 sm:pt-24 md:pt-28 lg:pt-32">
        <div className="w-full max-w-8xl mx-auto h-full flex items-center justify-center lg:justify-center xl:justify-end px-4 sm:px-6 md:px-8 lg:pl-12 lg:pr-6 xl:pl-16 xl:pr-10 2xl:pr-16">
          
          {/* Responsive content container */}
          <div className="w-full lg:w-auto flex flex-col items-center lg:items-end justify-start lg:justify-center text-center lg:text-right space-y-4 sm:space-y-6">
            
            {/* Logo and text container - responsive layout */}
            <div className="flex flex-col items-center justify-center gap-4 sm:gap-6 lg:flex-row lg:gap-8 lg:items-center">
              {/* Responsive logo - Using Registry */}
              <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 xl:w-64 xl:h-64 flex-shrink-0">
                <SimpleImage
                  src={heroLogo.src}
                  alt="Logo de KONTACT VO - Marketplace Automotriz Profesional"
                  className="w-full h-full object-contain"
                  loading="eager"
                  width={192}
                  height={192}
                  onError={(e) => {
                    if (heroLogo.fallback) {
                      e.currentTarget.src = heroLogo.fallback;
                    }
                  }}
                />
              </div>
              
              {/* Responsive text container */}
              <div className="flex flex-col items-center lg:items-end text-center lg:text-right">
                {/* Responsive main title */}
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white drop-shadow-2xl mb-2 sm:mb-3 leading-tight">
                  KONTACT
                </h1>
                
                {/* Responsive subtitle */}
                {isSpanishOrFrench ? (
                  <div className="text-center lg:text-right">
                    <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-white/95 uppercase tracking-wider drop-shadow-xl font-semibold">
                      {t('home.subtitle')}
                    </p>
                    <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-white/90 uppercase tracking-wide drop-shadow-xl font-medium mt-1 sm:mt-2">
                      {t('home.marketplace')}
                    </p>
                  </div>
                ) : (
                  <div className="text-center lg:text-right">
                    <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-white/95 uppercase tracking-wider drop-shadow-xl font-semibold">
                      {t('home.subtitle')}
                    </p>
                    <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-white/90 uppercase tracking-wide drop-shadow-xl font-medium mt-1 sm:mt-2">
                      {t('home.marketplace')}
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Responsive spacer */}
            <div className="flex-1 min-h-[30px] sm:min-h-[50px] md:min-h-[70px] lg:min-h-[90px]" aria-hidden="true"></div>
            
            {/* Responsive bottom slogan */}
            <div className="mb-0 sm:mb-1 md:mb-2 lg:mb-3 xl:mb-4 px-3 sm:px-4 md:px-6">
              <div 
                className="bg-black/50 backdrop-blur-sm px-5 py-4 sm:px-6 sm:py-5 md:px-8 md:py-6 border border-white/20 rounded-xl max-w-sm sm:max-w-2xl md:max-w-3xl lg:max-w-4xl mx-auto"
                role="region"
                aria-label="Descripción del servicio"
              >
                <p 
                  className="text-base sm:text-lg md:text-xl lg:text-2xl text-white font-bold leading-relaxed"
                  style={{ textShadow: '0 2px 10px rgba(0,0,0,0.9), 0 1px 3px rgba(0,0,0,0.8)' }}
                >
                  {t('home.description')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
