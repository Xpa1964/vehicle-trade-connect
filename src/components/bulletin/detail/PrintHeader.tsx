
import React from 'react';
import { LOGO_IMAGES } from '@/constants/imageAssets';

const PrintHeader: React.FC = () => {
  return (
    <div className="print:block hidden">
      <div className="flex items-center justify-center mb-6">
        <img 
          src={LOGO_IMAGES.primary}
          alt="KONTACT VO Logo" 
          className="h-6 mb-2 print-logo"
        />
      </div>
      <div className="text-center mb-4">
        <span className="text-auto-gold text-lg font-black">KONTACT</span>
        <span className="text-black text-lg font-bold ml-2">AUTOMOTIVE MARKETPLACE</span>
      </div>
      <div className="text-xs text-center mb-8 text-gray-500">
        info@kontact-automotive.com | +34 91 123 45 67
      </div>
      <hr className="mb-8 border-gray-300" />
    </div>
  );
};

export default PrintHeader;
