
import React from "react";
import OptimizedImage from "@/components/shared/OptimizedImage";
import { LOGO_IMAGES } from "@/constants/imageAssets";

const ContactPageLogo: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div className={`flex items-center justify-center ${className}`}>
    <div className="w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56">
      <OptimizedImage
        src={LOGO_IMAGES.primary}
        alt="Logo KONTACT VO"
        fallbackSources={LOGO_IMAGES.fallbacks}
        className="w-full h-full object-contain"
        loading="eager"
        
      />
    </div>
  </div>
);

export default ContactPageLogo;
