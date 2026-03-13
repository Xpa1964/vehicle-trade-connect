
import React from "react";
import kontactLogoOrange from "@/assets/kontact-vo-logo-orange.png";

const ContactPageLogo: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div className={`flex items-center justify-center ${className}`}>
    <div className="w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56">
      <img
        src={kontactLogoOrange}
        alt="Logo KONTACT VO"
        className="w-full h-full object-contain"
        loading="eager"
      />
    </div>
  </div>
);

export default ContactPageLogo;
