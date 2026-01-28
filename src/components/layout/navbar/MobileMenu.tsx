
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSelector from './LanguageSelector';
import UserMenu from './UserMenu';
import { LogOut, User, Globe } from 'lucide-react';
import { getCountryFlagUrl } from '@/utils/countryUtils';

interface MobileMenuProps {
  isOpen: boolean;
  isHomePage: boolean;
  isScrolled: boolean;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, isHomePage, isScrolled }) => {
  const { user, logout } = useAuth();
  const { t, currentLanguage, changeLanguage } = useLanguage();
  const location = useLocation();

  if (!isOpen) return null;

  const navItems = user ? [
    { to: '/vehicles', label: t('navigation.vehicles') },
    { to: '/messages', label: t('navigation.messages') },
    { to: '/exchanges', label: t('navigation.exchanges') },
    { to: '/bulletin', label: t('navigation.bulletinBoard') },
    { to: '/import-calculator', label: t('navigation.importCalculator') },
  ] : [];

  const displayName = user?.profile?.company_name || user?.profile?.full_name || user?.name || 'Usuario';

  // Get full language name based on the code
  const getFullLanguageName = (code: string) => {
    switch(code) {
      case 'es': return 'Español';
      case 'en': return 'English';
      case 'fr': return 'Français';
      case 'it': return 'Italiano';
      default: return code;
    }
  };

  const languages = [
    { code: 'es', name: 'Español', countryCode: 'es' },
    { code: 'en', name: 'English', countryCode: 'us' },
    { code: 'fr', name: 'Français', countryCode: 'fr' },
    { code: 'it', name: 'Italiano', countryCode: 'it' },
    { code: 'de', name: 'Deutsch', countryCode: 'de' },
    { code: 'nl', name: 'Nederlands', countryCode: 'nl' },
    { code: 'pt', name: 'Português', countryCode: 'pt' },
    { code: 'pl', name: 'Polski', countryCode: 'pl' },
    { code: 'dk', name: 'Dansk', countryCode: 'dk' },
  ];

  return (
    <div 
      id="mobile-menu"
      className={`md:hidden absolute top-full left-0 right-0 bg-white shadow-xl border-t border-gray-200 z-50 transition-all duration-300 ${
        isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
      }`}
      role="menu"
      aria-labelledby="mobile-menu-button"
    >
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-1">
        {/* User Info Section - Solo si está logueado */}
        {user && (
          <div className="border-b border-gray-100 pb-4 mb-4">
            <div className="flex items-center gap-3 px-4 py-2">
              <User className="h-5 w-5 text-gray-500" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 truncate">{displayName}</div>
                <div className="text-xs text-gray-500 truncate">{user.email}</div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Links - Enhanced touch targets */}
        {navItems.map((item) => (
          <Link 
            key={item.to}
            to={item.to}
            className={`block py-3 px-4 text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-primary rounded-lg transition-colors touch-manipulation min-h-[48px] ${
              location.pathname === item.to ? 'bg-primary/5 text-primary border-l-4 border-primary' : ''
            }`}
            role="menuitem"
          >
            {item.label}
          </Link>
        ))}

        {/* Language Selector - MOVIDO ARRIBA Y MEJORADO */}
        <div className="border-t border-gray-100 pt-4 mt-4">
          <div className="px-4 pb-3">
            <div className="flex items-center gap-2 mb-3">
              <Globe className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                {t('navigation.language', { fallback: 'Idioma' })}
              </span>
            </div>
            <div className="space-y-1">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => changeLanguage(lang.code as any)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left text-base font-medium rounded-lg transition-colors touch-manipulation min-h-[48px] ${
                    currentLanguage === lang.code 
                      ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500' 
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <img src={getCountryFlagUrl(lang.countryCode)} alt={lang.name} className="w-6 h-4 object-cover rounded-sm" />
                  <span className="flex-1">{lang.name}</span>
                  {currentLanguage === lang.code && (
                    <span className="text-sm text-blue-600">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* User Authentication - MOVIDO ABAJO */}
        <div className="border-t border-gray-100 pt-4 mt-4">
          {user ? (
            <div className="space-y-2 px-4">
              {/* Botón de Logout Destacado */}
              <Button 
                onClick={logout}
                variant="outline"
                size="default" 
                className="w-full h-14 text-lg touch-manipulation bg-red-50 border-red-200 text-red-600 hover:bg-red-100 hover:border-red-300 font-semibold mb-6"
              >
                <LogOut className="mr-3 h-5 w-5" />
                {t('auth.logout', { fallback: 'Cerrar Sesión' })}
              </Button>
              
              {/* Enlaces del perfil */}
              <div className="pt-4 border-t border-gray-100">
                <div className="px-0 pb-2">
                  <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                    {t('navigation.account', { fallback: 'Cuenta' })}
                  </span>
                </div>
                <Link to="/dashboard" className="block">
                  <Button variant="ghost" size="default" className="w-full justify-start h-12 text-base touch-manipulation">
                    {t('nav.dashboard', { fallback: 'Panel de Control' })}
                  </Button>
                </Link>
                <Link to="/profile" className="block">
                  <Button variant="ghost" size="default" className="w-full justify-start h-12 text-base touch-manipulation">
                    Mi Perfil
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-2 px-4">
              <div className="px-0 pb-2">
                <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                  {t('navigation.authentication', { fallback: 'Autenticación' })}
                </span>
              </div>
              <Link to="/login" className="block">
                <Button variant="ghost" size="default" className="w-full justify-start h-12 text-base touch-manipulation">
                  {t('auth.login')}
                </Button>
              </Link>
              <Link to="/register" className="block">
                <Button size="default" className="w-full h-12 text-base touch-manipulation">
                  {t('auth.register')}
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
