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
      className="relative w-full h-[92vh] min-h-[680px] overflow-hidden print:hidden md:min-h-[720px]"
      aria-label="Hero section"
    >
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

      <div className="relative z-10 h-full w-full pt-16 sm:pt-20 md:pt-24 lg:pt-24">
        <div className="mx-auto flex h-full w-full max-w-8xl flex-col justify-between px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24">
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <div className="mb-4 sm:mb-5 md:mb-6 pointer-events-none">
              <div className="relative h-40 w-40 sm:h-48 sm:w-48 md:h-56 md:w-56 lg:h-64 lg:w-64 xl:h-72 xl:w-72">
                <div
                  className="absolute inset-0 rounded-full bg-black/8 blur-3xl scale-125"
                  aria-hidden="true"
                />
                <SimpleImage
                  src={kontactLogoCircle}
                  alt="Logo de KONTACT VO - Marketplace Automotriz Profesional"
                  className="relative z-10 h-full w-full object-contain"
                  style={{ filter: 'drop-shadow(0 4px 15px rgba(0,0,0,0.3))' }}
                  loading="eager"
                  width={320}
                  height={320}
                />
              </div>
            </div>

            <h1 className="mb-2 text-4xl font-bold leading-tight text-white drop-shadow-2xl sm:mb-3 sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl">
              KONTACT
            </h1>

            {isSpanishOrFrench ? (
              <div className="text-center">
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-white/95 uppercase tracking-wider drop-shadow-xl font-semibold">
                  {t('home.subtitle')}
                </p>
                <p className="mt-1 text-sm sm:mt-2 sm:text-base md:text-lg lg:text-xl xl:text-2xl text-white/90 uppercase tracking-wide drop-shadow-xl font-medium">
                  {t('home.marketplace')}
                </p>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-white/95 uppercase tracking-wider drop-shadow-xl font-semibold">
                  {t('home.subtitle')}
                </p>
                <p className="mt-1 text-sm sm:mt-2 sm:text-base md:text-lg lg:text-xl xl:text-2xl text-white/90 uppercase tracking-wide drop-shadow-xl font-medium">
                  {t('home.marketplace')}
                </p>
              </div>
            )}
          </div>

          <div className="px-3 pb-6 sm:px-4 sm:pb-8 md:px-6 md:pb-10 lg:pb-12">
            <p
              className="mx-auto max-w-sm text-base font-bold leading-relaxed text-white sm:max-w-2xl sm:text-lg md:max-w-3xl md:text-xl lg:max-w-4xl lg:text-xl xl:text-2xl"
              style={{ textShadow: '0 2px 10px rgba(0,0,0,0.9), 0 1px 3px rgba(0,0,0,0.8)' }}
              role="region"
              aria-label="Descripción del servicio"
            >
              {t('home.description')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
