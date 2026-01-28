import { useState } from "react";
import { MessageSquare, Languages, Globe, Zap } from "lucide-react";
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import BackButton from '@/components/shared/BackButton';

// Imágenes de capturas reales para cada idioma
import chatES from "@/assets/messaging/chat-es.jpg";
import chatEN from "@/assets/messaging/chat-en.jpg";
import chatFR from "@/assets/messaging/chat-fr.jpg";
import chatIT from "@/assets/messaging/chat-it.jpg";
import chatDE from "@/assets/messaging/chat-de.jpg";
import chatNL from "@/assets/messaging/chat-nl.jpg";
import chatPT from "@/assets/messaging/chat-pt.jpg";
import chatPL from "@/assets/messaging/chat-pl.jpg";
import chatDK from "@/assets/messaging/chat-dk.jpg";

interface Language {
  code: string;
  name: string;
  flag: string; // CSS gradient to simulate flag
  image: string;
}

const languages: Language[] = [
  {
    code: "ES",
    name: "Español",
    flag: "linear-gradient(to bottom, #AA151B 0%, #AA151B 25%, #F1BF00 25%, #F1BF00 75%, #AA151B 75%, #AA151B 100%)",
    image: chatES,
  },
  {
    code: "EN",
    name: "English",
    flag: "linear-gradient(135deg, #012169 0%, #012169 40%, #C8102E 40%, #C8102E 60%, #012169 60%, #012169 100%)",
    image: chatEN,
  },
  {
    code: "FR",
    name: "Français",
    flag: "linear-gradient(to right, #0055A4 0%, #0055A4 33.33%, #FFFFFF 33.33%, #FFFFFF 66.66%, #EF4135 66.66%, #EF4135 100%)",
    image: chatFR,
  },
  {
    code: "IT",
    name: "Italiano",
    flag: "linear-gradient(to right, #009246 0%, #009246 33.33%, #FFFFFF 33.33%, #FFFFFF 66.66%, #CE2B37 66.66%, #CE2B37 100%)",
    image: chatIT,
  },
  {
    code: "DE",
    name: "Deutsch",
    flag: "linear-gradient(to bottom, #000000 0%, #000000 33.33%, #DD0000 33.33%, #DD0000 66.66%, #FFCE00 66.66%, #FFCE00 100%)",
    image: chatDE,
  },
  {
    code: "NL",
    name: "Nederlands",
    flag: "linear-gradient(to bottom, #AE1C28 0%, #AE1C28 33.33%, #FFFFFF 33.33%, #FFFFFF 66.66%, #21468B 66.66%, #21468B 100%)",
    image: chatNL,
  },
  {
    code: "PT",
    name: "Português",
    flag: "linear-gradient(to right, #006600 0%, #006600 40%, #FF0000 40%, #FF0000 100%)",
    image: chatPT,
  },
  {
    code: "PL",
    name: "Polski",
    flag: "linear-gradient(to bottom, #FFFFFF 0%, #FFFFFF 50%, #DC143C 50%, #DC143C 100%)",
    image: chatPL,
  },
  {
    code: "DK",
    name: "Dansk",
    flag: "linear-gradient(to bottom, #C8102E 0%, #C8102E 37.5%, #FFFFFF 37.5%, #FFFFFF 50%, #C8102E 50%, #C8102E 62.5%, #FFFFFF 62.5%, #FFFFFF 75%, #C8102E 75%, #C8102E 100%)",
    image: chatDK,
  },
];

const MessagingInfoPage = () => {
  const [activeLanguage, setActiveLanguage] = useState<string>("ES");
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const currentLanguage = languages.find((lang) => lang.code === activeLanguage);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section con imagen de fondo */}
        <div className="relative overflow-hidden rounded-xl shadow-lg mb-12">
          <div className="absolute inset-0">
            <img 
              src="/images/messaging-chat.png"
              alt="Messaging System Background"
              className="w-full h-full object-cover"
              style={{ objectPosition: 'center' }}
            />
          </div>
          
          <div className="relative z-10 p-8" style={{ minHeight: '320px' }}>
            <div className="flex flex-col justify-between h-full">
              {/* Back button */}
              <div className="mb-4">
                <BackButton 
                  to="/" 
                  label={t('navigation.backToHome')}
                  variant="outline"
                  className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
                />
              </div>
              
              {/* Title & description */}
              <div className="bg-black/20 backdrop-blur-sm rounded-lg p-6 border border-white/10">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
                  {t('messaging.hero.title')}{' '}
                  <span className="text-white">{t('messaging.hero.titleHighlight')}</span>
                </h1>
                
                <p className="text-lg text-white font-bold">
                  {t('messaging.hero.description')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Language Tabs - Minimalista y elegante */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex flex-wrap gap-3 p-3 bg-card rounded-lg border">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setActiveLanguage(lang.code)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg transition-all
                  ${activeLanguage === lang.code
                    ? 'bg-muted/80 text-foreground font-semibold border border-border'
                    : 'hover:bg-muted text-muted-foreground'
                  }
                `}
              >
                <div 
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm"
                  style={{ background: lang.flag }}
                >
                  {lang.code.slice(0, 2)}
                </div>
                <span className="text-sm font-medium">{lang.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Message Preview con diseño limpio */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-card rounded-xl shadow-lg overflow-hidden border">
            {/* Header minimalista */}
            <div className="bg-muted px-6 py-3 border-b">
              <span className="text-sm font-medium text-foreground">
                {t('messaging.preview.title', { language: currentLanguage?.name })}
              </span>
            </div>
            
            {/* Contenido del mensaje */}
            <div className="p-6">
              <div className="relative">
                <img 
                  src={currentLanguage?.image}
                  alt={`Chat en ${currentLanguage?.name}`}
                  className="w-full rounded-lg shadow-sm"
                  loading="lazy"
                />
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground text-center">
                    {t('messaging.preview.caption', { language: currentLanguage?.name })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid - Estandarizado */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
          <div className="bg-card border hover:shadow-lg transition-shadow rounded-xl p-6 flex flex-col items-center text-center">
            <Zap className="h-12 w-12 text-blue-600 mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {t('messaging.features.instant.title')}
            </h3>
            <p className="text-gray-600">
              {t('messaging.features.instant.desc')}
            </p>
          </div>

          <div className="bg-card border hover:shadow-lg transition-shadow rounded-xl p-6 flex flex-col items-center text-center">
            <Globe className="h-12 w-12 text-green-600 mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {t('messaging.features.languages.title')}
            </h3>
            <p className="text-gray-600">
              {t('messaging.features.languages.desc')}
            </p>
          </div>

          <div className="bg-card border hover:shadow-lg transition-shadow rounded-xl p-6 flex flex-col items-center text-center">
            <Languages className="h-12 w-12 text-purple-600 mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {t('messaging.features.context.title')}
            </h3>
            <p className="text-gray-600">
              {t('messaging.features.context.desc')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagingInfoPage;
