
import React, { useState, useEffect } from 'react';
import { Play } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import VideoPlayerModal from './VideoPlayerModal';
import { useStaticImage } from '@/hooks/useStaticImage';
import headphonesFallback from '@/assets/headphones-listen.png';
import { toast } from 'sonner';

interface AudioPresentationSectionProps {
  initialVideoLanguage?: string;
  autoplay?: boolean;
  onVideoStarted?: () => void;
  onVideoCompleted?: () => void;
  onPopupShown?: () => void;
  onRegisterClicked?: (companyName?: string, interests?: string[]) => void;
}

const AudioPresentationSection: React.FC<AudioPresentationSectionProps> = ({
  initialVideoLanguage,
  autoplay = false,
  onVideoStarted,
  onVideoCompleted,
  onPopupShown,
  onRegisterClicked,
}) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState('');
  const [currentVideoTitle, setCurrentVideoTitle] = useState('');
  const [currentVideoLanguage, setCurrentVideoLanguage] = useState('es');
  const [shouldAutoplay, setShouldAutoplay] = useState(false);

  const headphonesImg = useStaticImage('home.headphones');

  const videoIds: Record<string, string | null> = {
    es: 'O9nPl-T938A',
    en: '4MW9r-kb_Lw',
    fr: 'Yjjo4qjHQrY',
    it: 'BIbIpsJCmHg',
    pt: 'OW_RO0a54qA',
    de: '6XMAzJvhSXI',
    nl: 'P5ytnUafM0g',
    pl: 'xL-PbQJniAk',
    dk: 'Ncdm_Hf3xA8',
  };

  const languageNames: Record<string, string> = {
    es: 'Español',
    en: 'English',
    fr: 'Français',
    it: 'Italiano',
    pt: 'Português',
    de: 'Deutsch',
    nl: 'Nederlands',
    pl: 'Polski',
    dk: 'Dansk',
  };

  // Auto-open video from URL params
  useEffect(() => {
    if (initialVideoLanguage && videoIds[initialVideoLanguage]) {
      const videoId = videoIds[initialVideoLanguage];
      if (videoId) {
        // Small delay to ensure DOM is ready for YT player
        const timer = setTimeout(() => {
          console.log('[AudioPresentation] Auto-opening video for language:', initialVideoLanguage, 'autoplay:', autoplay);
          setCurrentVideoUrl(`https://www.youtube.com/embed/${videoId}`);
          setCurrentVideoTitle(`Presentación en ${languageNames[initialVideoLanguage] || initialVideoLanguage}`);
          setCurrentVideoLanguage(initialVideoLanguage);
          setShouldAutoplay(autoplay);
          setIsVideoModalOpen(true);
        }, 500);
        return () => clearTimeout(timer);
      }
    }
  }, [initialVideoLanguage, autoplay]); // React to prop changes

  const handleVideoClick = (language: string) => {
    const videoId = videoIds[language];
    if (!videoId) {
      toast.info(t('home.videoComingSoon'));
      return;
    }
    const languageName = languageNames[language];
    setCurrentVideoUrl(`https://www.youtube.com/embed/${videoId}`);
    setCurrentVideoTitle(`Presentación en ${languageName}`);
    setCurrentVideoLanguage(language);
    setShouldAutoplay(true);
    setIsVideoModalOpen(true);

    // Update URL params without reload
    const url = new URL(window.location.href);
    url.searchParams.set('video', language);
    window.history.replaceState({}, '', url.toString());
  };

  const handleCloseVideoModal = () => {
    setIsVideoModalOpen(false);
    setCurrentVideoUrl('');
    setShouldAutoplay(false);
  };

  const handleRegisterClick = () => {
    navigate('/register');
  };

  return (
    <>
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 md:px-8 bg-gradient-to-br from-card to-background">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-10 sm:mb-12 md:mb-14 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-5xl mb-6 sm:mb-7 md:mb-8 text-primary font-normal md:text-3xl">
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
                  alt="Watch our presentation in multiple languages"
                  className="rounded-xl shadow-2xl w-auto h-[352px] sm:h-[440px] md:h-[528px] object-cover"
                  loading="lazy"
                  style={{ minHeight: '352px' }}
                  onError={(e) => {
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
                  {Object.keys(videoIds).map((lang, index) => (
                    <button
                      key={lang}
                      onClick={() => handleVideoClick(lang)}
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
                        ${!videoIds[lang] ? 'opacity-50' : ''}
                        ${index === Object.keys(videoIds).length - 1 ? 'col-span-2 justify-self-center' : ''}
                      `}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <Play className="w-6 h-6 sm:w-6 sm:h-6 md:w-7 md:h-7 mb-1 text-primary" />
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
        title={currentVideoTitle}
        language={currentVideoLanguage}
        autoplay={shouldAutoplay}
        onVideoStarted={onVideoStarted}
        onVideoCompleted={onVideoCompleted}
        onPopupShown={onPopupShown}
        onRegisterClicked={onRegisterClicked}
      />
    </>
  );
};

export default AudioPresentationSection;
