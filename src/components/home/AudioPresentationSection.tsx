
import React, { useState } from 'react';
import { Headphones } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAudioSession } from '@/hooks/useAudioSession';
import VideoPlayerModal from './VideoPlayerModal';
import { useStaticImage } from '@/hooks/useStaticImage';
import headphonesFallback from '@/assets/headphones-listen.png';

const AudioPresentationSection: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { startAudioSession } = useAudioSession();
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState('');
  
  // Use static image system - checks Supabase storage first, falls back to local asset
  const headphonesImg = useStaticImage('home.headphones');

  const audioLinks = {
    es: '/audio-players/es.html',
    en: '/audio-players/en.html',
    fr: '/audio-players/fr.html',
    it: '/audio-players/it.html',
    pt: '/audio-players/pt.html',
    de: '/audio-players/de.html',
    nl: '/audio-players/nl.html',
    pl: '/audio-players/pl.html',
    dk: '/audio-players/dk.html'
  };

  const audioLabels = {
    es: 'Audio ES',
    en: 'Audio EN',
    fr: 'Audio FR',
    it: 'Audio IT',
    pt: 'Audio PT',
    de: 'Audio DE',
    nl: 'Audio NL',
    pl: 'Audio PL',
    dk: 'Audio DK'
  };

  const languageNames = {
    es: 'Español',
    en: 'English',
    fr: 'Français',
    it: 'Italiano',
    pt: 'Português',
    de: 'Deutsch',
    nl: 'Nederlands',
    pl: 'Polski',
    dk: 'Dansk'
  };


  const handleAudioClick = (language: string) => {
    const url = audioLinks[language as keyof typeof audioLinks];
    const languageName = languageNames[language as keyof typeof languageNames];
    startAudioSession(language, languageName);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleRegisterClick = () => {
    navigate('/register');
  };

  const handleVideoClick = (videoUrl: string) => {
    setCurrentVideoUrl(videoUrl);
    setIsVideoModalOpen(true);
  };

  const handleCloseVideoModal = () => {
    setIsVideoModalOpen(false);
    setCurrentVideoUrl('');
  };

  return (
    <>
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 md:px-8 bg-gradient-to-br from-card to-background">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-10 sm:mb-12 md:mb-14 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6 sm:mb-7 md:mb-8 text-primary">
              {t('home.promoSlogan')}
            </h2>
            
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground leading-relaxed max-w-4xl mx-auto px-4">
              {t('home.promoDescription')}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-7 md:gap-8 items-stretch">
            <div className="lg:col-span-4 flex items-center justify-center">
              <div className="w-full max-w-sm sm:max-w-md lg:max-w-sm flex items-center justify-center">
                <img 
                  src={headphonesImg.src}
                  alt="Listen to me in multiple languages - Headphones" 
                  className="rounded-xl shadow-2xl w-auto h-[352px] sm:h-[440px] md:h-[528px] object-cover"
                  loading="lazy"
                  style={{ minHeight: '352px' }}
                  onError={(e) => {
                    // Fallback to static asset if storage image fails
                    if (headphonesImg.fallback) {
                      e.currentTarget.src = headphonesImg.fallback;
                    } else {
                      e.currentTarget.src = headphonesFallback;
                    }
                  }}
                />
              </div>
            </div>
            
            <div className="lg:col-span-3 flex flex-col justify-center h-full audio-buttons-section">
              <div className="flex flex-col items-center justify-center">
                <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-5 max-w-md mx-auto">
                  {Object.entries(audioLabels).map(([lang, label], index) => (
                    <button
                      key={lang}
                      onClick={() => handleAudioClick(lang)}
                        className={`
                          relative rounded-full w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20
                          flex flex-col items-center justify-center
                          bg-gradient-to-br from-card to-secondary
                          border-2 border-border
                          hover:from-secondary hover:to-card
                          hover:scale-110 hover:shadow-2xl
                          cursor-pointer active:scale-95
                          transition-all duration-300 ease-out
                          shadow-lg touch-manipulation
                          ${index === Object.keys(audioLabels).length - 1 ? 'col-span-2 justify-self-center' : ''}
                        `}
                        style={{ 
                          animationDelay: `${index * 50}ms` 
                        }}
                      >
                        <Headphones className="w-6 h-6 sm:w-6 sm:h-6 md:w-7 md:h-7 mb-1 text-primary" />
                        <span className="text-[10px] sm:text-[10px] md:text-xs font-bold text-primary">
                          {lang.toUpperCase()}
                        </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col justify-center h-full">
              <div className="space-y-4 sm:space-y-5 md:space-y-6 flex-1 flex flex-col justify-center">
                <div className="text-muted-foreground leading-relaxed text-sm sm:text-base md:text-lg">
                  <p className="mb-3 sm:mb-4 md:mb-5 text-justify">
                    {t('home.newEcosystemText')}
                  </p>
                  <p className="mb-4 sm:mb-5 md:mb-6 text-justify">
                    {t('home.newEcosystemBenefits')}
                  </p>
                  <p className="font-semibold text-primary mb-4 sm:mb-5 md:mb-6 text-center sm:text-left text-base sm:text-lg">
                    {t('home.newDecisionCall')}
                  </p>
                </div>
                
                <Button 
                  onClick={handleRegisterClick} 
                  variant="gold" 
                  size="lg" 
                  className="w-full text-base sm:text-lg md:text-xl font-semibold py-4 sm:py-5 min-h-[52px] bg-gradient-to-br from-card to-secondary hover:from-secondary hover:to-card text-primary border-border touch-manipulation active:scale-95 transition-transform"
                >
                  {t('auth.register.title')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <VideoPlayerModal
        isOpen={isVideoModalOpen}
        onClose={handleCloseVideoModal}
        videoUrl={currentVideoUrl}
        title="Presentación en Deutsch"
      />
    </>
  );
};

export default AudioPresentationSection;
