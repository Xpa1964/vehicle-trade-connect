
import React from 'react';
import { useLocation } from 'react-router-dom';
import { Wifi, WifiOff } from 'lucide-react';
import NavbarContainer from './navbar/NavbarContainer';

/** SkipLink for accessibility */
const SkipLink: React.FC = () => (
  <a
    href="#main-content"
    className="sr-only focus:not-sr-only absolute left-2 top-2 z-[300] p-2 bg-blue-800 text-white rounded transition-all"
    tabIndex={0}
  >
    Saltar al contenido principal
  </a>
);

const Navbar: React.FC = () => {
  const [isOnline, setIsOnline] = React.useState(navigator.onLine);
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <nav role="navigation" aria-label="Barra principal de navegación" className="relative print:hidden">
      <SkipLink />
      {!isOnline && (
        <div className="bg-red-500 text-white text-center py-2 px-4 text-sm font-medium z-[250]">
          <div className="flex items-center justify-center space-x-2">
            <WifiOff className="h-4 w-4" />
            <span>Sin conexión a internet</span>
          </div>
        </div>
      )}

      <NavbarContainer />
    </nav>
  );
};

export default Navbar;

