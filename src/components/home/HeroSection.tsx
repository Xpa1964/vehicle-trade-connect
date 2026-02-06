import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import SimpleImage from '@/components/shared/SimpleImage';
import { useImagePreload } from '@/hooks/useImagePreload';
import { useStaticImage } from '@/hooks/useStaticImage';
import kontactLogoHero from '@/assets/kontact-vo-logo-hero.png';

const HeroSection: React.FC = () => {
  const { t, currentLanguage } = useLanguage();
  
  // Get background image from registry (with storage override)
  const heroBackground = useStaticImage('home.hero');

  // Preload critical LCP image
  useImagePreload([heroBackground.src]);
  
  // Check if current language is Spanish or French
  const isSpanishOrFrench = currentLanguage === 'es' || currentLanguage === 'fr';

  return (
    <section 
      className="relative w-full h-screen overflow-hidden print:hidden"
      aria-label="Hero section"
    >
      {/* Hero Image Layer - Using Registry */}
      <div className="absolute inset-0 w-full h-full" aria-hidden="true">
        <SimpleImage
          src={heroBackground.src}
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

      {/* Logo independiente - posicionado a la izquierda, debajo del menú Vehículos, encima del camión */}
      <div className="absolute top-28 sm:top-32 md:top-36 left-[420px] sm:left-[450px] md:left-[480px] lg:left-[520px] xl:left-[560px] z-20">
        <div className="w-28 h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 xl:w-56 xl:h-56">
          <SimpleImage
            src={kontactLogoHero}
            alt="Logo de KONTACT VO - Marketplace Automotriz Profesional"
            className="w-full h-full object-contain"
            loading="eager"
            width={288}
            height={288}
          />
        </div>
      </div>

      {/* Content Layer - Responsive spacing */}
      <div className="relative w-full h-full flex items-center justify-start z-10 pt-20 sm:pt-24 md:pt-28 lg:pt-32 pl-8 sm:pl-16 md:pl-24 lg:pl-32 xl:pl-40">
        <div className="w-full max-w-8xl h-full flex items-center justify-start px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24">
          
          {/* Responsive content container - aligned left */}
          <div className="w-full lg:w-auto flex flex-col items-center lg:items-start justify-start lg:justify-center text-center lg:text-left space-y-4 sm:space-y-6">
            
            {/* Responsive text container - SIN el logo */}
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
              {/* Responsive main title */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white drop-shadow-2xl mb-2 sm:mb-3 leading-tight">
                KONTACT
              </h1>
              
              {/* Responsive subtitle */}
              {isSpanishOrFrench ? (
                <div className="text-center lg:text-left">
                  <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-white/95 uppercase tracking-wider drop-shadow-xl font-semibold">
                    {t('home.subtitle')}
                  </p>
                  <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-white/90 uppercase tracking-wide drop-shadow-xl font-medium mt-1 sm:mt-2">
                    {t('home.marketplace')}
                  </p>
                </div>
              ) : (
                <div className="text-center lg:text-left">
                  <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-white/95 uppercase tracking-wider drop-shadow-xl font-semibold">
                    {t('home.subtitle')}
                  </p>
                  <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-white/90 uppercase tracking-wide drop-shadow-xl font-medium mt-1 sm:mt-2">
                    {t('home.marketplace')}
                  </p>
                </div>
              )}
            </div>
            
            {/* Responsive spacer */}
            <div className="flex-1 min-h-[30px] sm:min-h-[50px] md:min-h-[70px] lg:min-h-[90px]" aria-hidden="true"></div>
            
            {/* Responsive bottom slogan - NO mask */}
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
