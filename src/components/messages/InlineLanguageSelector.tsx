import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { LANGUAGE_NAMES, type Language } from '@/config/languages';

interface FlagDef {
  code: Language;
  name: string;
  gradient: string;
}

const flags: FlagDef[] = [
  { code: 'es', name: 'Español', gradient: 'linear-gradient(to bottom, #AA151B 0%, #AA151B 25%, #F1BF00 25%, #F1BF00 75%, #AA151B 75%, #AA151B 100%)' },
  { code: 'en', name: 'English', gradient: 'linear-gradient(135deg, #012169 0%, #012169 40%, #C8102E 40%, #C8102E 60%, #012169 60%, #012169 100%)' },
  { code: 'fr', name: 'Français', gradient: 'linear-gradient(to right, #0055A4 0%, #0055A4 33.33%, #FFFFFF 33.33%, #FFFFFF 66.66%, #EF4135 66.66%, #EF4135 100%)' },
  { code: 'it', name: 'Italiano', gradient: 'linear-gradient(to right, #009246 0%, #009246 33.33%, #FFFFFF 33.33%, #FFFFFF 66.66%, #CE2B37 66.66%, #CE2B37 100%)' },
  { code: 'de', name: 'Deutsch', gradient: 'linear-gradient(to bottom, #000000 0%, #000000 33.33%, #DD0000 33.33%, #DD0000 66.66%, #FFCE00 66.66%, #FFCE00 100%)' },
  { code: 'nl', name: 'Nederlands', gradient: 'linear-gradient(to bottom, #AE1C28 0%, #AE1C28 33.33%, #FFFFFF 33.33%, #FFFFFF 66.66%, #21468B 66.66%, #21468B 100%)' },
  { code: 'pt', name: 'Português', gradient: 'linear-gradient(to right, #006600 0%, #006600 40%, #FF0000 40%, #FF0000 100%)' },
  { code: 'pl', name: 'Polski', gradient: 'linear-gradient(to bottom, #FFFFFF 0%, #FFFFFF 50%, #DC143C 50%, #DC143C 100%)' },
  { code: 'dk', name: 'Dansk', gradient: 'linear-gradient(to bottom, #C8102E 0%, #C8102E 37.5%, #FFFFFF 37.5%, #FFFFFF 50%, #C8102E 50%, #C8102E 62.5%, #FFFFFF 62.5%, #FFFFFF 75%, #C8102E 75%, #C8102E 100%)' },
];

const InlineLanguageSelector: React.FC = () => {
  const { currentLanguage, changeLanguage } = useLanguage();

  return (
    <div className="bg-card/90 backdrop-blur-sm rounded-lg border border-border p-3 mt-3">
      <div className="flex flex-wrap gap-2 justify-center">
        {flags.map((flag) => {
          const isActive = currentLanguage === flag.code;
          return (
            <button
              key={flag.code}
              onClick={() => changeLanguage(flag.code)}
              className={`
                flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium
                transition-all duration-200 touch-manipulation min-h-[36px]
                ${isActive
                  ? 'bg-primary/15 border-2 border-primary shadow-sm scale-105'
                  : 'bg-muted/50 border border-border hover:bg-muted/80 hover:scale-102'
                }
              `}
              aria-label={`${flag.name}`}
            >
              <span
                className="w-5 h-5 rounded-full flex-shrink-0 border border-border/50 shadow-sm"
                style={{ background: flag.gradient }}
              />
              <span className={`${isActive ? 'text-primary font-semibold' : 'text-foreground/70'}`}>
                {flag.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default InlineLanguageSelector;
