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
          className={`group flex items-center gap-2 ${textClass} ${hoverClass} px-3.5 py-2.5 rounded-xl touch-manipulation min-h-[48px] border-2 border-primary/40 bg-primary/10 backdrop-blur-md shadow-md hover:shadow-lg hover:border-primary/60 hover:bg-primary/15 transition-all duration-300 ${isMobile ? 'text-sm w-full justify-start' : 'text-sm'}`}
          aria-haspopup="menu"
          aria-label="Change language"
        >
          <img 
            src={getCountryFlagUrl(currentLang.flag)} 
            alt={currentLang.label} 
            className="w-6 h-5 object-cover rounded-sm flex-shrink-0 shadow-sm ring-1 ring-black/10" 
          />
          <span className="whitespace-nowrap font-semibold hidden sm:inline">
            {currentLang.label}
          </span>
          <div className="flex -space-x-1.5 sm:flex">
            {LANGUAGES.filter(l => l.code !== currentLanguage).slice(0, 3).map(l => (
              <img
                key={l.code}
                src={getCountryFlagUrl(l.flag)}
                alt=""
                className="w-4 h-3 object-cover rounded-sm ring-1 ring-background opacity-70 group-hover:opacity-100 transition-opacity"
              />
            ))}
          </div>
          <ChevronDown className="h-3.5 w-3.5 opacity-60 flex-shrink-0 group-hover:opacity-100 transition-opacity" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align={isMobile ? "start" : "end"} 
        className="z-[200] bg-popover min-w-[200px] max-h-[400px] overflow-y-auto p-1.5" 
        role="menu" 
        aria-label="Language selector"
        sideOffset={8}
      >
        <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
          🌐 9 Languages
        </div>
        {LANGUAGES.map((lang) => (
          <DropdownMenuItem 
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={`cursor-pointer rounded-lg mb-0.5 ${currentLanguage === lang.code ? 'bg-primary/15 text-primary font-semibold' : ''}`}
            role="menuitem"
          >
            <span className="flex items-center gap-2.5 w-full py-0.5">
              <img 
                src={getCountryFlagUrl(lang.flag)} 
                alt={lang.label} 
                className="w-6 h-4 object-cover rounded-sm flex-shrink-0 shadow-sm ring-1 ring-black/10" 
              />
              <span className="text-sm">{lang.label}</span>
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
