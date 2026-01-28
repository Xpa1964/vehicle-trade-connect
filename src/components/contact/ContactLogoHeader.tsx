
import React from "react";
import OptimizedImage from "@/components/shared/OptimizedImage";
import { LOGO_IMAGES } from "@/constants/imageAssets";

const ContactLogoHeader: React.FC = () => (
  <div className="flex flex-col items-center mb-8 mt-2">
    <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 mb-3">
      <OptimizedImage
        src={LOGO_IMAGES.primary}
        alt="KONTACT VO Logo"
        fallbackSources={LOGO_IMAGES.fallbacks}
        className="w-full h-full object-contain"
        loading="eager"
        
      />
    </div>
    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-auto-blue text-center drop-shadow-sm mb-0">Contáctanos</h1>
    <p className="text-sm sm:text-base md:text-lg text-gray-600 text-center mt-1">Profesional B2B Automotive Marketplace</p>
  </div>
);

export default ContactLogoHeader;
