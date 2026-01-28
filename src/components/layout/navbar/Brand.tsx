
import React from 'react';
import { Link } from 'react-router-dom';
import { LOGO_IMAGES } from '@/constants/imageAssets';

interface BrandProps {
  isHomePage: boolean;
  isScrolled: boolean;
}

const Brand: React.FC<BrandProps> = ({ isHomePage, isScrolled }) => {
  const textColor = isScrolled || !isHomePage ? 'text-auto-blue' : 'text-white';
  
  return (
    <Link to="/" className="flex items-center space-x-2 sm:space-x-3">
      <img 
        src={LOGO_IMAGES.primary} 
        alt="Kontact Logo" 
        className="h-8 w-auto sm:h-10 md:h-12 drop-shadow-sm"
        loading="eager"
        fetchPriority="high"
        onError={(e) => {
          console.log('Error loading primary logo, trying fallback');
          e.currentTarget.src = LOGO_IMAGES.fallbacks[0];
          e.currentTarget.onerror = () => {
            console.log('Error loading fallback logo, hiding image');
            e.currentTarget.style.display = 'none';
          };
        }}
      />
      <span className={`text-xl sm:text-2xl md:text-3xl font-bold transition-colors drop-shadow-sm ${textColor}`}>
        Kontact
      </span>
    </Link>
  );
};

export default Brand;
