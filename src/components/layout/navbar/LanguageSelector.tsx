import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe } from 'lucide-react';
import { getCountryFlagUrl } from '@/utils/countryUtils';

export interface LanguageSelectorProps {
  isHomePage: boolean;
  isScrolled: boolean;
  isMobile?: boolean;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ isHomePage, isScrolled, isMobile = false }) => {
  const { currentLanguage, changeLanguage, t } = useLanguage();
  
  // Get full language name based on the code
  const getFullLanguageName = (code: string) => {
    switch(code) {
      case 'es': return 'Español';
      case 'en': return 'English';
      case 'fr': return 'Français';
      case 'it': return 'Italiano';
      case 'de': return 'Deutsch';
      case 'nl': return 'Nederlands';
      case 'pt': return 'Português';
      case 'pl': return 'Polski';
      case 'dk': return 'Dansk';
      default: return code;
    }
  };
  
  // Use appropriate text color for better visibility
  const textClass = isMobile 
    ? 'text-gray-700' 
    : (isHomePage && !isScrolled ? 'text-white hover:text-gray-200' : 'text-auto-blue');
  const hoverClass = isMobile 
    ? 'hover:bg-gray-100' 
    : (isHomePage && !isScrolled ? 'hover:bg-white/10' : 'hover:bg-auto-blue/10');
  
  const handleLanguageChange = (langCode: string) => {
    console.log('🌐 [LanguageSelector] Changing language to:', langCode);
    changeLanguage(langCode as any);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={`flex items-center gap-2 ${textClass} ${hoverClass} px-3 py-2 rounded touch-manipulation min-h-[48px] ${isMobile ? 'text-sm w-full justify-start' : ''}`}
          aria-haspopup="menu"
          aria-label="Cambiar idioma"
          aria-expanded="false"
          aria-controls="language-menu"
        >
          <Globe className="h-4 w-4 flex-shrink-0" />
          <span className="whitespace-nowrap">
            {isMobile ? getFullLanguageName(currentLanguage) : getFullLanguageName(currentLanguage)}
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent id="language-menu" align={isMobile ? "start" : "end"} className="z-[200] bg-white dark:bg-gray-800 min-w-[160px]" role="menu" aria-label="Selector de idioma">
        <DropdownMenuItem 
          onClick={() => handleLanguageChange('es')}
          className={currentLanguage === 'es' ? 'bg-blue-50 text-blue-700' : ''}
          role="menuitem"
        >
          <span className="flex items-center gap-2">
            <img src={getCountryFlagUrl('es')} alt="España" className="w-5 h-4 object-cover rounded-sm" />
            Español
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleLanguageChange('en')}
          className={currentLanguage === 'en' ? 'bg-blue-50 text-blue-700' : ''}
          role="menuitem"
        >
          <span className="flex items-center gap-2">
            <img src={getCountryFlagUrl('us')} alt="United States" className="w-5 h-4 object-cover rounded-sm" />
            English
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleLanguageChange('fr')}
          className={currentLanguage === 'fr' ? 'bg-blue-50 text-blue-700' : ''}
          role="menuitem"
        >
          <span className="flex items-center gap-2">
            <img src={getCountryFlagUrl('fr')} alt="France" className="w-5 h-4 object-cover rounded-sm" />
            Français
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleLanguageChange('it')}
          className={currentLanguage === 'it' ? 'bg-blue-50 text-blue-700' : ''}
          role="menuitem"
        >
          <span className="flex items-center gap-2">
            <img src={getCountryFlagUrl('it')} alt="Italia" className="w-5 h-4 object-cover rounded-sm" />
            Italiano
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleLanguageChange('de')}
          className={currentLanguage === 'de' ? 'bg-blue-50 text-blue-700' : ''}
          role="menuitem"
        >
          <span className="flex items-center gap-2">
            <img src={getCountryFlagUrl('de')} alt="Deutschland" className="w-5 h-4 object-cover rounded-sm" />
            Deutsch
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleLanguageChange('nl')}
          className={currentLanguage === 'nl' ? 'bg-blue-50 text-blue-700' : ''}
          role="menuitem"
        >
          <span className="flex items-center gap-2">
            <img src={getCountryFlagUrl('nl')} alt="Nederland" className="w-5 h-4 object-cover rounded-sm" />
            Nederlands
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleLanguageChange('pt')}
          className={currentLanguage === 'pt' ? 'bg-blue-50 text-blue-700' : ''}
          role="menuitem"
        >
          <span className="flex items-center gap-2">
            <img src={getCountryFlagUrl('pt')} alt="Portugal" className="w-5 h-4 object-cover rounded-sm" />
            Português
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleLanguageChange('pl')}
          className={currentLanguage === 'pl' ? 'bg-blue-50 text-blue-700' : ''}
          role="menuitem"
        >
          <span className="flex items-center gap-2">
            <img src={getCountryFlagUrl('pl')} alt="Polska" className="w-5 h-4 object-cover rounded-sm" />
            Polski
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleLanguageChange('dk')}
          className={currentLanguage === 'dk' ? 'bg-blue-50 text-blue-700' : ''}
          role="menuitem"
        >
          <span className="flex items-center gap-2">
            <img src={getCountryFlagUrl('dk')} alt="Danmark" className="w-5 h-4 object-cover rounded-sm" />
            Dansk
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;
