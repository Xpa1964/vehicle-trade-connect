import React, { useEffect, useRef, useState, useCallback } from 'react';
import { X, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import kontactLogo from '@/assets/kontact-vo-logo-circle.png';

interface VideoPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
  title?: string;
  language?: string;
}

const postVideoMessages: Record<string, { message: string; button: string; emailSubject: string }> = {
  es: { message: '¿Te interesa? ¡Contáctanos!', button: 'OK, me interesa', emailSubject: 'Me interesa KONTACT VO' },
  en: { message: 'Interested? Contact us!', button: 'OK, I\'m interested', emailSubject: 'I\'m interested in KONTACT VO' },
  fr: { message: 'Intéressé ? Contactez-nous !', button: 'OK, ça m\'intéresse', emailSubject: 'Je suis intéressé par KONTACT VO' },
  it: { message: 'Interessato? Contattaci!', button: 'OK, mi interessa', emailSubject: 'Sono interessato a KONTACT VO' },
  pt: { message: 'Interessado? Entre em contato!', button: 'OK, estou interessado', emailSubject: 'Estou interessado no KONTACT VO' },
  de: { message: 'Interessiert? Kontaktieren Sie uns!', button: 'OK, ich bin interessiert', emailSubject: 'Ich interessiere mich für KONTACT VO' },
  nl: { message: 'Geïnteresseerd? Neem contact op!', button: 'OK, ik ben geïnteresseerd', emailSubject: 'Ik ben geïnteresseerd in KONTACT VO' },
  pl: { message: 'Zainteresowany? Skontaktuj się z nami!', button: 'OK, jestem zainteresowany', emailSubject: 'Jestem zainteresowany KONTACT VO' },
  dk: { message: 'Interesseret? Kontakt os!', button: 'OK, jeg er interesseret', emailSubject: 'Jeg er interesseret i KONTACT VO' },
};

const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({
  isOpen,
  onClose,
  videoUrl,
  title = 'Video Presentación',
  language = 'es'
}) => {
  const [showOverlay, setShowOverlay] = useState(false);
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeId = useRef(`yt-player-${Date.now()}`);

  const translations = postVideoMessages[language] || postVideoMessages['es'];

  const destroyPlayer = useCallback(() => {
    try {
      if (playerRef.current?.destroy) {
        playerRef.current.destroy();
      }
    } catch (e) { /* ignore */ }
    playerRef.current = null;
  }, []);

  // Load YT IFrame API once
  useEffect(() => {
    if ((window as any).YT) return;
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(tag);
  }, []);

  // Create player when modal opens with a YouTube URL
  useEffect(() => {
    if (!isOpen || !videoUrl.includes('youtube.com/embed')) return;

    setShowOverlay(false);

    const videoIdMatch = videoUrl.match(/embed\/([^?]+)/);
    if (!videoIdMatch) return;
    const videoId = videoIdMatch[1];

    const createPlayer = () => {
      destroyPlayer();
      playerRef.current = new (window as any).YT.Player(iframeId.current, {
        videoId,
        playerVars: {
          autoplay: 1,
          rel: 0,
          modestbranding: 1,
        },
        events: {
          onStateChange: (event: any) => {
            if (event.data === (window as any).YT.PlayerState.ENDED) {
              setShowOverlay(true);
            }
          },
        },
      });
    };

    if ((window as any).YT?.Player) {
      // Small delay to ensure DOM element exists
      setTimeout(createPlayer, 100);
    } else {
      (window as any).onYouTubeIframeAPIReady = createPlayer;
    }

    return () => {
      destroyPlayer();
    };
  }, [isOpen, videoUrl, destroyPlayer]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setShowOverlay(false);
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isYouTube = videoUrl.includes('youtube.com/embed');

  const handleContactClick = () => {
    window.location.href = `mailto:info@kontactvo.com?subject=${encodeURIComponent(translations.emailSubject)}`;
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-[95vw] max-w-5xl bg-card rounded-xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4">
          <h2 className="text-xl sm:text-2xl font-bold text-primary">{title}</h2>
          <button
            onClick={onClose}
            className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
          >
            <X className="h-5 w-5 text-foreground" />
          </button>
        </div>

        <div className="relative w-full aspect-video bg-black" ref={containerRef}>
          {isYouTube ? (
            <div id={iframeId.current} className="w-full h-full" />
          ) : (
            <video
              className="w-full h-full"
              controls
              playsInline
              preload="metadata"
              autoPlay
            >
              <source src={videoUrl} type="video/mp4" />
            </video>
          )}

          {/* Post-video overlay */}
          {showOverlay && (
            <div className="absolute inset-0 bg-background flex flex-col items-center justify-center gap-6 animate-in fade-in duration-500 z-10">
              <img
                src={kontactLogo}
                alt="KONTACT VO"
                className="w-32 h-32 sm:w-40 sm:h-40 object-contain"
              />
              <p className="text-foreground text-xl sm:text-2xl md:text-3xl font-bold text-center px-6">
                {translations.message}
              </p>
              <Button
                onClick={handleContactClick}
                size="lg"
                className="text-lg sm:text-xl px-8 py-6 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold gap-2"
              >
                <Mail className="w-5 h-5" />
                {translations.button}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoPlayerModal;
