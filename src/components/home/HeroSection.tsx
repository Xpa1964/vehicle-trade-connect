import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import SimpleImage from '@/components/shared/SimpleImage';
import kontactLogoCircle from '@/assets/kontact-vo-logo-circle.png';

const HeroSection: React.FC = () => {
  const { t, currentLanguage } = useLanguage();

  // Check if current language is Spanish or French
  const isSpanishOrFrench = currentLanguage === 'es' || currentLanguage === 'fr';

  return (
    <section 
      className="relative w-full h-[85vh] md:h-[90vh] overflow-hidden print:hidden"
      aria-label="Hero section"
    >
      {/* Hero Image Layer - Direct local image for full scene visibility */}
      <div className="absolute inset-0 w-full h-full" aria-hidden="true">
        <picture>
          <source
            media="(max-width: 767px)"
            srcSet="/images/home-hero.png 800w"
            sizes="100vw"
          />
          <source
            media="(min-width: 768px)"
            srcSet="/images/home-hero.png 1600w"
            sizes="100vw"
          />
          <img
            src="/images/home-hero.png"
            srcSet="/images/home-hero.png 800w, /images/home-hero.png 1600w"
            sizes="100vw"
            alt="Fondo de vehículos de lujo profesionales"
            className="w-full h-full object-cover object-center"
            width="1600"
            height="900"
            loading="eager"
            fetchPriority="high"
            decoding="sync"
          />
        </picture>
      </div>

      {/* Content Layer - logo centrado justo encima de KONTACT */}
      <div className="relative w-full h-full flex items-center justify-center z-10 pt-20 sm:pt-24 md:pt-28 lg:pt-32">
        <div className="w-full max-w-8xl h-full flex items-center justify-center px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24">
          <div className="w-full lg:w-auto flex flex-col items-center justify-center text-center space-y-4 sm:space-y-6">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 sm:mb-5 md:mb-6 pointer-events-none">
                <div className="w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 xl:w-72 xl:h-72 relative">
                  <div 
                    className="absolute inset-0 rounded-full bg-black/15 blur-3xl scale-125"
                    aria-hidden="true"
                  />
                  <SimpleImage
                    src={kontactLogoCircle}
                    alt="Logo de KONTACT VO - Marketplace Automotriz Profesional"
                    className="w-full h-full object-contain relative z-10"
                    style={{ filter: 'drop-shadow(0 4px 15px rgba(0,0,0,0.3))' }}
                    loading="eager"
                    width={320}
                    height={320}
                  />
                </div>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white drop-shadow-2xl mb-2 sm:mb-3 leading-tight">
                KONTACT
              </h1>
              
              {isSpanishOrFrench ? (
                <div className="text-center">
                  <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-white/95 uppercase tracking-wider drop-shadow-xl font-semibold">
                    {t('home.subtitle')}
                  </p>
                  <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-white/90 uppercase tracking-wide drop-shadow-xl font-medium mt-1 sm:mt-2">
                    {t('home.marketplace')}
                  </p>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-white/95 uppercase tracking-wider drop-shadow-xl font-semibold">
                    {t('home.subtitle')}
                  </p>
                  <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-white/90 uppercase tracking-wide drop-shadow-xl font-medium mt-1 sm:mt-2">
                    {t('home.marketplace')}
                  </p>
                </div>
              )}
            </div>
            
            <div className="flex-1 min-h-[30px] sm:min-h-[50px] md:min-h-[70px] lg:min-h-[90px]" aria-hidden="true"></div>
            
            <div className="mb-0 sm:mb-1 md:mb-2 lg:mb-3 xl:mb-4 px-3 sm:px-4 md:px-6">
              <p 
                className="text-base sm:text-lg md:text-xl lg:text-2xl text-white font-bold leading-relaxed max-w-sm sm:max-w-2xl md:max-w-3xl lg:max-w-4xl"
                style={{ textShadow: '0 2px 10px rgba(0,0,0,0.9), 0 1px 3px rgba(0,0,0,0.8)' }}
                role="region"
                aria-label="Descripción del servicio"
              >
                {t('home.description')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
