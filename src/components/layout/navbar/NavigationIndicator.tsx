
import React from 'react';
import { useLocation } from 'react-router-dom';

interface NavigationIndicatorProps {
  className?: string;
}

const NavigationIndicator: React.FC<NavigationIndicatorProps> = ({ className = '' }) => {
  const location = useLocation();

  // Mapeo de rutas a colores de indicador
  const getIndicatorColor = (pathname: string): string => {
    if (pathname === '/') return 'bg-blue-500';
    if (pathname.startsWith('/dashboard')) return 'bg-green-500';
    if (pathname.startsWith('/vehicles')) return 'bg-purple-500';
    if (pathname.startsWith('/messages')) return 'bg-orange-500';
    if (pathname.startsWith('/auctions')) return 'bg-red-500';
    if (pathname.startsWith('/exchanges')) return 'bg-teal-500';
    if (pathname.startsWith('/bulletin')) return 'bg-yellow-500';
    if (pathname.startsWith('/import-calculator')) return 'bg-indigo-500';
    if (pathname.startsWith('/transport')) return 'bg-pink-500';
    if (pathname.startsWith('/blog')) return 'bg-cyan-500';
    return 'bg-gray-500';
  };

  const indicatorColor = getIndicatorColor(location.pathname);

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className={`w-2 h-2 rounded-full ${indicatorColor} animate-pulse`} />
      <div className="text-xs text-gray-500 hidden sm:block">
        Navegando
      </div>
    </div>
  );
};

export default NavigationIndicator;
