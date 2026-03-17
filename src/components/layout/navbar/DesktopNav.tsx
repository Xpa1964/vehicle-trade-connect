
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import LanguageSelector from './LanguageSelector';
import UserMenu from './UserMenu';

interface DesktopNavProps {
  isHomePage: boolean;
  isScrolled: boolean;
  isAdminRoute: boolean;
}

const DesktopNav: React.FC<DesktopNavProps> = ({ isHomePage, isScrolled, isAdminRoute }) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const location = useLocation();

  // Hide navigation in admin routes
  if (isAdminRoute) {
    return null;
  }

  const navItems = [
    { to: '/vehicles', label: t('navigation.vehicles') },
    { to: '/exchanges', label: t('navigation.exchanges') },
    { to: '/bulletin', label: t('navigation.bulletinBoard') },
    { to: '/import-calculator', label: t('navigation.importCalculator') },
  ];

  const getNavItemClass = (path: string) => {
    const isActive = location.pathname === path;
    const baseClass = 'text-sm font-medium transition-all duration-200 hover:text-primary relative py-2 px-3 rounded-md';
    
    if (isHomePage && !isScrolled) {
      return `${baseClass} text-white hover:text-gray-200 hover:bg-white/10 ${
        isActive ? 'text-gray-200 bg-white/20' : ''
      }`;
    }
    
    return `${baseClass} text-foreground hover:text-primary hover:bg-primary/10 ${
      isActive ? 'text-primary bg-primary/5' : ''
    }`;
  };

  return (
    <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
      {/* Navigation Links - Responsive spacing */}
      <nav className="flex items-center space-x-1 lg:space-x-2">
      {navItems.map((item) => (
          <Link 
            key={item.to} 
            to={item.to} 
            className={getNavItemClass(item.to)}
            {...(item.to === '/vehicles' ? { 'data-nav-item': 'vehicles' } : {})}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Language Selector */}
      <LanguageSelector isHomePage={isHomePage} isScrolled={isScrolled} />

      {/* Auth section - conditional rendering */}
      <div className="flex items-center space-x-2">
        {user ? (
          <UserMenu isHomePage={isHomePage} isScrolled={isScrolled} />
        ) : (
          <>
            <Link to="/login">
              <Button 
                variant={isHomePage && !isScrolled ? "secondary" : "ghost"} 
                size="sm"
                className="h-9 px-3 text-sm"
              >
                {t('auth.login')}
              </Button>
            </Link>
            <Link to="/register">
              <Button 
                size="sm"
                className="h-9 px-3 text-sm"
              >
                Pre-Registro
              </Button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default DesktopNav;
