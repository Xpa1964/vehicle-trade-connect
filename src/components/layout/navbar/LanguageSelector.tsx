import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from 'lucide-react';
import { getCountryFlagUrl } from '@/utils/countryUtils';

export interface LanguageSelectorProps {
  isHomePage: boolean;
  isScrolled: boolean;
  isMobile?: boolean;
}

const LANGUAGES = [
  { code: 'es', flag: 'es', label: 'Español' },
  { code: 'en', flag: 'gb', label: 'English' },
  { code: 'fr', flag: 'fr', label: 'Français' },
  { code: 'it', flag: 'it', label: 'Italiano' },
  { code: 'de', flag: 'de', label: 'Deutsch' },
  { code: 'nl', flag: 'nl', label: 'Nederlands' },
  { code: 'pt', flag: 'pt', label: 'Português' },
  { code: 'pl', flag: 'pl', label: 'Polski' },
  { code: 'dk', flag: 'dk', label: 'Dansk' },
];

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ isHomePage, isScrolled, isMobile = false }) => {
  const { currentLanguage, changeLanguage } = useLanguage();

  const currentLang = LANGUAGES.find(l => l.code === currentLanguage) || LANGUAGES[0];
  
  const textClass = isMobile 
    ? 'text-foreground' 
    : (isHomePage && !isScrolled ? 'text-white hover:text-gray-200' : 'text-foreground');
  const hoverClass = isMobile 
    ? 'hover:bg-muted' 
    : (isHomePage && !isScrolled ? 'hover:bg-white/10' : 'hover:bg-muted');
  
  const handleLanguageChange = (langCode: string) => {
    changeLanguage(langCode as any);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={`flex items-center gap-1.5 ${textClass} ${hoverClass} px-3 py-2 rounded-lg touch-manipulation min-h-[44px] border border-primary/30 bg-primary/5 backdrop-blur-md shadow-sm transition-all ${isMobile ? 'text-sm w-full justify-start' : 'text-sm'}`}
          aria-haspopup="menu"
          aria-label="Cambiar idioma"
        >
          <img 
            src={getCountryFlagUrl(currentLang.flag)} 
            alt={currentLang.label} 
            className="w-5 h-4 object-cover rounded-sm flex-shrink-0" 
          />
          <span className="whitespace-nowrap font-medium hidden sm:inline">
            {currentLang.label}
          </span>
          <ChevronDown className="h-3.5 w-3.5 opacity-60 flex-shrink-0" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align={isMobile ? "start" : "end"} 
        className="z-[200] bg-popover min-w-[180px] max-h-[400px] overflow-y-auto" 
        role="menu" 
        aria-label="Selector de idioma"
        sideOffset={8}
      >
        {LANGUAGES.map((lang) => (
          <DropdownMenuItem 
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={`cursor-pointer ${currentLanguage === lang.code ? 'bg-primary/10 text-primary font-semibold' : ''}`}
            role="menuitem"
          >
            <span className="flex items-center gap-2.5 w-full">
              <img 
                src={getCountryFlagUrl(lang.flag)} 
                alt={lang.label} 
                className="w-5 h-4 object-cover rounded-sm flex-shrink-0" 
              />
              <span>{lang.label}</span>
              {currentLanguage === lang.code && (
                <span className="ml-auto text-primary text-xs">✓</span>
              )}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;
