import React from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import Breadcrumbs from './navbar/Breadcrumbs';
import { useAuth } from '@/contexts/AuthContext';
import { PWAInstallPrompt } from '@/components/shared/PWAInstallPrompt';

const Layout: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  
  // Check if the current route is an admin route
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isHomePage = location.pathname === '/';
  const isDashboardPage = location.pathname === '/dashboard';
  
  return (
    <div className="flex flex-col min-h-screen w-full">
      {/* Enhanced navbar with better mobile handling */}
      {!isAdminRoute && (
        <div className="fixed top-0 left-0 right-0 z-[200] w-full print:hidden">
          <Navbar />
        </div>
      )}
      
      {/* Enhanced main content with better mobile spacing */}
      <div className="flex flex-1 w-full">
        <main
          id="main-content"
          tabIndex={-1}
          role="main"
          aria-label="Contenido principal"
          className="w-full relative z-10"
        >
          {/* Enhanced responsive padding for mobile-first approach */}
          <div className={`w-full ${
            !isAdminRoute && !isHomePage && !isDashboardPage 
              ? 'pt-[80px] md:pt-20' 
              : isDashboardPage 
                ? 'pt-[80px] md:pt-20' 
                : ''
          }`}>
            {/* Breadcrumbs container - Solo mostrar en páginas internas autenticadas */}
            {isAuthenticated && !isHomePage && !isAdminRoute && (
              <div className="container mx-auto px-4 pt-4">
                <Breadcrumbs />
              </div>
            )}
            
            <Outlet />
          </div>
        </main>
      </div>
      
      <Footer />
      
      {/* PWA Install Prompt */}
      <PWAInstallPrompt />
    </div>
  );
};

export default Layout;
