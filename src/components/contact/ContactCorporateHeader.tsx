
import React from "react";
import ContactPageLogo from "./ContactPageLogo";

const ContactCorporateHeader: React.FC = () => (
  <header className="w-full flex flex-col items-center mb-10 mt-2">
    <div className="w-24 h-24 md:w-32 md:h-32 mb-3">
      <ContactPageLogo />
    </div>
    <h1 className="text-3xl md:text-4xl font-bold text-foreground text-center drop-shadow-sm mb-1">KONTACT DRIVER</h1>
    <p className="text-base md:text-lg text-primary font-semibold text-center">Marketplace Automotive</p>
  </header>
);

export default ContactCorporateHeader;
