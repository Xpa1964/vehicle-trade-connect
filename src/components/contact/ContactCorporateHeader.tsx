
import React from "react";
import ContactPageLogo from "./ContactPageLogo";

const ContactCorporateHeader: React.FC = () => (
  <header className="w-full flex flex-col items-center mb-10 mt-2">
    <div className="w-40 h-40 md:w-52 md:h-52 mb-4">
      <ContactPageLogo />
    </div>
    <h1 className="text-3xl md:text-4xl font-bold text-foreground text-center drop-shadow-sm mb-1">KONTACT VO</h1>
    <p className="text-base md:text-lg text-primary font-semibold text-center">B2B Automotive Marketplace</p>
  </header>
);

export default ContactCorporateHeader;
