import React, { useRef, useLayoutEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import SimpleImage from '@/components/shared/SimpleImage';
import { useImagePreload } from '@/hooks/useImagePreload';
import { useStaticImage } from '@/hooks/useStaticImage';
import kontactLogoHero from '@/assets/kontact-vo-logo-hero.png';
import { useAuth } from '@/contexts/AuthContext';

// Ajuste fino: constantes para micro-correcciones
const GAP_PX = 12; // Espacio vertical bajo el header
const X_NUDGE_PX = 0; // Micro ajuste horizontal (0 = centrado exacto)

const HeroSection: React.FC = () => {
  const { t, currentLanguage } = useLanguage();
  const { user } = useAuth();
  const heroRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const [logoStyle, setLogoStyle] = useState<React.CSSProperties>({});
  const [isDesktop, setIsDesktop] = useState(false);
  
  // Get background image from registry (with storage override)
  const heroBackground = useStaticImage('home.hero');

  // Preload critical LCP image
  useImagePreload([heroBackground.src]);
  
  // Check if current language is Spanish or French
  const isSpanishOrFrench = currentLanguage === 'es' || currentLanguage === 'fr';

  // Dynamic positioning for logo under "Vehículos" menu
  useLayoutEffect(() => {
    const updateLogoPosition = () => {
      const vehiclesEl = document.querySelector('[data-nav-item="vehicles"]');
      const headerEl = document.querySelector('[data-site-header="main"]');
      const heroEl = heroRef.current;

      // Check if we're on desktop (md breakpoint = 768px)
      const isDesktopView = window.innerWidth >= 768;
      setIsDesktop(isDesktopView);

      if (!isDesktopView || !vehiclesEl || !headerEl || !heroEl) {
        // Mobile: reset to use CSS classes for centering
        setLogoStyle({});
        return;
      }

      const heroRect = heroEl.getBoundingClientRect();
      const vehiclesRect = vehiclesEl.getBoundingClientRect();
      const headerRect = headerEl.getBoundingClientRect();

      // Calculate position: centered under "Vehículos" link
      const leftPx = (vehiclesRect.left + vehiclesRect.width / 2) - heroRect.left + X_NUDGE_PX;
      const topPx = (headerRect.bottom - heroRect.top) + GAP_PX;

      setLogoStyle({
        left: `${leftPx}px`,
        top: `${topPx}px`,
      });
    };

    // Initial calculation
    updateLogoPosition();

    // Small delay to account for font loading
    const timeout = setTimeout(updateLogoPosition, 100);

    // Recalculate on resize
    window.addEventListener('resize', updateLogoPosition);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener('resize', updateLogoPosition);
    };
  }, [currentLanguage, user]); // Recalculate on language or auth change

  return (
    <section 
      ref={heroRef}
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

      {/* Logo independiente - posicionado dinámicamente bajo "Vehículos" en desktop, centrado en móvil */}
      <div 
        ref={logoRef}
        className={`absolute z-20 pointer-events-none ${
          isDesktop 
            ? '-translate-x-1/2' 
            : 'left-1/2 -translate-x-1/2 top-28 sm:top-32'
        }`}
        style={isDesktop ? logoStyle : undefined}
      >
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

      {/* Content Layer - CENTRADO (sin padding-left ni alineación izquierda) */}
      <div className="relative w-full h-full flex items-center justify-center z-10 pt-20 sm:pt-24 md:pt-28 lg:pt-32">
        <div className="w-full max-w-8xl h-full flex items-center justify-center px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24">
          
          {/* Responsive content container - CENTRADO en todas las pantallas */}
          <div className="w-full lg:w-auto flex flex-col items-center justify-center text-center space-y-4 sm:space-y-6">
            
            {/* Responsive text container */}
            <div className="flex flex-col items-center text-center">
              {/* Responsive main title */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white drop-shadow-2xl mb-2 sm:mb-3 leading-tight">
                KONTACT
              </h1>
              
              {/* Responsive subtitle */}
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
