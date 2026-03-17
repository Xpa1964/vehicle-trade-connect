
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DesktopNav from './DesktopNav';
import MobileMenu from './MobileMenu';
import LanguageSelector from './LanguageSelector';

const NavbarContainer: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  const isHomePage = location.pathname === '/';
  const isAdminRoute = location.pathname.startsWith('/admin');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  if (isAdminRoute) {
    return null;
  }

  return (
    <div 
      data-site-header="main"
      className={`w-full transition-all duration-300 sticky top-0 z-50 ${
        isHomePage && !isScrolled 
          ? 'bg-transparent' 
          : 'bg-card/95 backdrop-blur-md border-b border-border shadow-sm'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo - Responsive sizing MEJORADO PARA MÓVIL */}
          <div className="flex-shrink-0 touch-manipulation relative" style={{ marginLeft: '-550px', marginTop: '-60px' }}>
            <img 
              src="/lovable-uploads/a645acd2-f5c2-4f99-be3b-9d089c634c3c.png" 
              alt="Logo" 
              className="h-8 w-auto sm:h-10 md:h-12 transition-all duration-200 brightness-[0.85] contrast-[1.1]"
              style={{ filter: 'brightness(0.85) contrast(1.1) drop-shadow(0 0 8px rgba(0,0,0,0.15))' }}
              loading="eager"
              width={48}
              height={48}
            />
          </div>

          {/* Desktop Navigation */}
          <DesktopNav 
            isHomePage={isHomePage} 
            isScrolled={isScrolled} 
            isAdminRoute={isAdminRoute}
          />

          {/* Mobile: Language Selector + Menu Button */}
          <div className="md:hidden flex items-center gap-1">
            <LanguageSelector isHomePage={isHomePage} isScrolled={isScrolled} />
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMenu}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
              className={`h-10 w-10 p-0 touch-manipulation ${
                isHomePage && !isScrolled 
                  ? 'text-white hover:text-gray-200 hover:bg-white/10' 
                  : 'text-foreground hover:text-foreground hover:bg-primary/10'
              }`}
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Enhanced with backdrop */}
      <MobileMenu 
        isOpen={isMenuOpen} 
        isHomePage={isHomePage} 
        isScrolled={isScrolled}
      />
      
      {/* Mobile backdrop overlay */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
          onClick={toggleMenu}
          aria-hidden="true"
        />
      )}
    </div>
  );
};

export default NavbarContainer;
