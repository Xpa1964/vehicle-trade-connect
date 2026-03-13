import React, { useEffect, useRef, useState, useCallback } from 'react';
import { X, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import kontactLogo from '@/assets/kontact-vo-logo-orange.png';

interface VideoPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
  title?: string;
  language?: string;
}

const postVideoMessages: Record<string, {
  message: string;
  button: string;
  emailSubject: string;
  emailBody: string;
  interestLabel: string;
  options: string[];
  companyPlaceholder: string;
}> = {
  es: {
    message: '¿Te interesa? ¡Contáctanos!',
    button: 'OK, me interesa',
    emailSubject: 'Me interesa KONTACT VO',
    emailBody: 'OK, estoy interesado en que se contacte conmigo cuando se inicie la actividad de KONTACT VO.',
    interestLabel: 'Me interesa:',
    options: ['Comprar vehículos', 'Vender vehículos', 'Comprar/Vender vehículos'],
    companyPlaceholder: 'Tu empresa (opcional)',
  },
  en: {
    message: 'Interested? Contact us!',
    button: "OK, I'm interested",
    emailSubject: "I'm interested in KONTACT VO",
    emailBody: "OK, I'm interested in being contacted when KONTACT VO starts its activity.",
    interestLabel: "I'm interested in:",
    options: ['Buying vehicles', 'Selling vehicles', 'Buying/Selling vehicles'],
    companyPlaceholder: 'Your company (optional)',
  },
  fr: {
    message: 'Intéressé ? Contactez-nous !',
    button: "OK, ça m'intéresse",
    emailSubject: 'Je suis intéressé par KONTACT VO',
    emailBody: "OK, je suis intéressé pour être contacté lorsque KONTACT VO démarrera son activité.",
    interestLabel: "Ça m'intéresse :",
    options: ['Acheter des véhicules', 'Vendre des véhicules', 'Acheter/Vendre des véhicules'],
    companyPlaceholder: 'Votre entreprise (facultatif)',
  },
  it: {
    message: 'Interessato? Contattaci!',
    button: 'OK, mi interessa',
    emailSubject: 'Sono interessato a KONTACT VO',
    emailBody: "OK, sono interessato a essere contattato quando KONTACT VO avvierà la sua attività.",
    interestLabel: 'Mi interessa:',
    options: ['Comprare veicoli', 'Vendere veicoli', 'Comprare/Vendere veicoli'],
    companyPlaceholder: 'La tua azienda (facoltativo)',
  },
  pt: {
    message: 'Interessado? Entre em contato!',
    button: 'OK, estou interessado',
    emailSubject: 'Estou interessado no KONTACT VO',
    emailBody: 'OK, estou interessado em ser contactado quando o KONTACT VO iniciar a sua atividade.',
    interestLabel: 'Estou interessado em:',
    options: ['Comprar veículos', 'Vender veículos', 'Comprar/Vender veículos'],
    companyPlaceholder: 'Sua empresa (opcional)',
  },
  de: {
    message: 'Interessiert? Kontaktieren Sie uns!',
    button: 'OK, ich bin interessiert',
    emailSubject: 'Ich interessiere mich für KONTACT VO',
    emailBody: 'OK, ich bin daran interessiert, kontaktiert zu werden, wenn KONTACT VO seine Tätigkeit aufnimmt.',
    interestLabel: 'Ich interessiere mich für:',
    options: ['Fahrzeuge kaufen', 'Fahrzeuge verkaufen', 'Fahrzeuge kaufen/verkaufen'],
    companyPlaceholder: 'Ihr Unternehmen (optional)',
  },
  nl: {
    message: 'Geïnteresseerd? Neem contact op!',
    button: 'OK, ik ben geïnteresseerd',
    emailSubject: 'Ik ben geïnteresseerd in KONTACT VO',
    emailBody: 'OK, ik ben geïnteresseerd om gecontacteerd te worden wanneer KONTACT VO zijn activiteit start.',
    interestLabel: 'Ik ben geïnteresseerd in:',
    options: ['Voertuigen kopen', 'Voertuigen verkopen', 'Voertuigen kopen/verkopen'],
    companyPlaceholder: 'Uw bedrijf (optioneel)',
  },
  pl: {
    message: 'Zainteresowany? Skontaktuj się z nami!',
    button: 'OK, jestem zainteresowany',
    emailSubject: 'Jestem zainteresowany KONTACT VO',
    emailBody: 'OK, jestem zainteresowany kontaktem, gdy KONTACT VO rozpocznie swoją działalność.',
    interestLabel: 'Interesuje mnie:',
    options: ['Kupno pojazdów', 'Sprzedaż pojazdów', 'Kupno/Sprzedaż pojazdów'],
    companyPlaceholder: 'Twoja firma (opcjonalnie)',
  },
  dk: {
    message: 'Interesseret? Kontakt os!',
    button: 'OK, jeg er interesseret',
    emailSubject: 'Jeg er interesseret i KONTACT VO',
    emailBody: 'OK, jeg er interesseret i at blive kontaktet, når KONTACT VO starter sin aktivitet.',
    interestLabel: 'Jeg er interesseret i:',
    options: ['Køb af køretøjer', 'Salg af køretøjer', 'Køb/Salg af køretøjer'],
    companyPlaceholder: 'Dit firma (valgfrit)',
  },
};
const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({
  isOpen,
  onClose,
  videoUrl,
  title = 'Video Presentación',
  language = 'es'
}) => {
  const [showOverlay, setShowOverlay] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [companyName, setCompanyName] = useState('');
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
    setSelectedInterests([]);
    setCompanyName('');

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
      setSelectedInterests([]);
      setCompanyName('');
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

  const toggleInterest = (option: string) => {
    setSelectedInterests(prev =>
      prev.includes(option) ? prev.filter(i => i !== option) : [...prev, option]
    );
  };

  const handleContactClick = () => {
    const companyInfo = companyName.trim() ? `\n\nEmpresa / Company: ${companyName.trim()}` : '';
    const selected = selectedInterests.length > 0
      ? `\n\n${translations.interestLabel}\n${selectedInterests.map(i => `- ${i}`).join('\n')}`
      : '';
    const body = `${translations.emailBody}${companyInfo}${selected}`;
    const mailtoUrl = `mailto:info@kontactvo.com?subject=${encodeURIComponent(translations.emailSubject)}&body=${encodeURIComponent(body)}`;
    
    // Use programmatic link click for better cross-browser compatibility
    const link = document.createElement('a');
    link.href = mailtoUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-[95vw] max-w-5xl max-h-[90vh] bg-card rounded-xl overflow-hidden shadow-2xl flex flex-col"
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
            <div className="absolute inset-0 bg-background flex flex-col items-center justify-center gap-4 sm:gap-6 animate-in fade-in duration-500 z-10 px-6">
              <img
                src={kontactLogo}
                alt="KONTACT VO"
                className="w-28 h-28 sm:w-36 sm:h-36 object-contain"
              />
              <p className="text-foreground text-xl sm:text-2xl md:text-3xl font-bold text-center">
                {translations.message}
              </p>

              {/* Interest checkboxes */}
              <div className="flex flex-col gap-3 w-full max-w-md">
                <p className="text-muted-foreground text-sm font-semibold">{translations.interestLabel}</p>
                {translations.options.map((option) => (
                  <div
                    key={option}
                    className="flex items-center gap-3 cursor-pointer rounded-lg border border-border px-4 py-3 hover:bg-muted/50 transition-colors"
                    onClick={() => toggleInterest(option)}
                  >
                    <Checkbox
                      checked={selectedInterests.includes(option)}
                      className="h-5 w-5 pointer-events-none"
                    />
                    <span className="text-foreground text-sm sm:text-base font-medium">{option}</span>
                  </div>
                ))}
              </div>

              {/* Company name input */}
              <div className="w-full max-w-md">
                <Input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder={translations.companyPlaceholder}
                  className="w-full"
                />
              </div>

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
