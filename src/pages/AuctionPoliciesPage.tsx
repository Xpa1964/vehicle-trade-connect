
import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { ChevronDown, ChevronUp, FileText } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { LOGO_IMAGES } from '@/constants/imageAssets';

const AuctionPoliciesPage: React.FC = () => {
  const { t } = useLanguage();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    section1: true
  });
  
  const toggleSection = (section: string) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  const renderSection = (section: string, title: string, content: React.ReactNode) => (
    <Collapsible 
      open={openSections[section]} 
      onOpenChange={() => toggleSection(section)} 
      className="border border-border rounded-md mb-4 overflow-hidden"
    >
      <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-secondary hover:bg-secondary/80 text-left">
        <div className="flex items-center">
          <FileText className="mr-2 h-5 w-5 text-primary" />
          <h3 className="text-lg font-medium text-foreground">{title}</h3>
        </div>
        {openSections[section] ? <ChevronUp className="h-5 w-5 text-foreground" /> : <ChevronDown className="h-5 w-5 text-foreground" />}
      </CollapsibleTrigger>
      <CollapsibleContent className="p-4 bg-card text-foreground">
        {content}
      </CollapsibleContent>
    </Collapsible>
  );
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-6">
          <img src="/lovable-uploads/kontact-driver-logo.png" alt="KONTACT DRIVER Logo" className="h-24 w-auto" />
        </div>
        <h1 className="text-3xl font-bold mb-2 text-foreground">{t('auctions.policies.title')}</h1>
        <p className="text-muted-foreground">{t('auctions.policies.subtitle')}</p>
      </div>
      
      {/* Sección de Introducción */}
      {renderSection('section1', `1. ${t('auctions.terms.introduction')}`, (
        <div className="space-y-4">
          <h4 className="font-semibold text-foreground">{t('terms.introduction.subtitle1')}</h4>
          <p className="text-muted-foreground">{t('terms.introduction.p1')}</p>
          <p className="text-muted-foreground">{t('terms.introduction.p2')}</p>
          
          <h4 className="font-semibold text-foreground">{t('terms.introduction.subtitle2')}</h4>
          <p className="text-muted-foreground">{t('terms.introduction.p3')}</p>
          <p className="text-muted-foreground">{t('terms.introduction.p4')}</p>
          <p className="text-muted-foreground">{t('terms.introduction.p5')}</p>
          
          <h4 className="font-semibold text-foreground">{t('terms.introduction.subtitle3')}</h4>
          <p className="text-muted-foreground">{t('terms.introduction.p6')}</p>
          <p className="text-muted-foreground">{t('terms.introduction.p7')}</p>
          
          <h4 className="font-semibold text-foreground">{t('terms.introduction.subtitle4')}</h4>
          <p className="text-muted-foreground">{t('terms.introduction.p8')}</p>
          
          <h4 className="font-semibold text-foreground">{t('terms.introduction.subtitle5')}</h4>
          <p className="text-muted-foreground">{t('terms.introduction.p9')}</p>
          <p className="text-muted-foreground">{t('terms.introduction.p10')}</p>
          <p className="text-muted-foreground">{t('terms.introduction.p11')}</p>
          <p className="text-muted-foreground">{t('terms.introduction.p12')}</p>
          <p className="text-muted-foreground">{t('terms.introduction.p13')}</p>
        </div>
      ))}
      
      {/* Sección: Entrega y derecho de inspección */}
      {renderSection('section2', `2. ${t('terms.delivery.title')}`, (
        <div className="space-y-4">
          <h4 className="font-semibold text-foreground">{t('terms.delivery.subtitle1')}</h4>
          <p className="text-muted-foreground">{t('terms.delivery.p1')}</p>
          
          <h4 className="font-semibold text-foreground">{t('terms.delivery.subtitle2')}</h4>
          <p className="text-muted-foreground">{t('terms.delivery.p2')}</p>
          
          <h4 className="font-semibold text-foreground">{t('terms.delivery.subtitle3')}</h4>
          <p className="text-muted-foreground">{t('terms.delivery.p3')}</p>
          
          <h4 className="font-semibold text-foreground">{t('terms.delivery.subtitle4')}</h4>
          <p className="text-muted-foreground">{t('terms.delivery.p4')}</p>
        </div>
      ))}
      
      {/* Sección: Pago */}
      {renderSection('section3', `3. ${t('terms.payment.title')}`, (
        <div className="space-y-4">
          <h4 className="font-semibold text-foreground">{t('terms.payment.subtitle1')}</h4>
          <p className="text-muted-foreground">{t('terms.payment.p1')}</p>
          
          <h4 className="font-semibold text-foreground">{t('terms.payment.subtitle2')}</h4>
          <p className="text-muted-foreground">{t('terms.payment.p2')}</p>
        </div>
      ))}
      
      {/* Sección: Obligaciones */}
      {renderSection('section4', `4. ${t('terms.obligations.title')}`, (
        <div className="space-y-4">
          <h4 className="font-semibold text-foreground">{t('terms.obligations.subtitle1')}</h4>
          <p className="text-muted-foreground">{t('terms.obligations.p1')}</p>
          
          <h4 className="font-semibold text-foreground">{t('terms.obligations.subtitle2')}</h4>
          <p className="text-muted-foreground">{t('terms.obligations.p2')}</p>
          
          <h4 className="font-semibold text-foreground">{t('terms.obligations.subtitle3')}</h4>
          <p className="text-muted-foreground">{t('terms.obligations.p3')}</p>
        </div>
      ))}
      
      {/* Sección: Registro */}
      {renderSection('section5', `5. ${t('terms.registration.title')}`, (
        <div className="space-y-4">
          <p className="text-muted-foreground">{t('terms.registration.p1')}</p>
        </div>
      ))}
      
      {/* Sección: Tarifas */}
      {renderSection('section6', `6. ${t('terms.fees.title')}`, (
        <div className="space-y-4">
          <p className="text-muted-foreground">{t('terms.fees.p1')}</p>
        </div>
      ))}
      
      {/* Sección: Artículos prohibidos */}
      {renderSection('section7', `7. ${t('terms.prohibitedItems.title')}`, (
        <div className="space-y-4">
          <p className="text-muted-foreground">{t('terms.prohibitedItems.p1')}</p>
        </div>
      ))}
      
      {/* Sección: Principios básicos generales */}
      {renderSection('section8', `8. ${t('terms.principles.title')}`, (
        <div className="space-y-4">
          <p className="text-muted-foreground">{t('terms.principles.p1')}</p>
        </div>
      ))}
      
      {/* Sección: Exención */}
      {renderSection('section9', `9. ${t('terms.exemption.title')}`, (
        <div className="space-y-4">
          <p className="text-muted-foreground">{t('terms.exemption.p1')}</p>
        </div>
      ))}
      
      {/* Sección: Integridad del sistema */}
      {renderSection('section10', `10. ${t('terms.integrity.title')}`, (
        <div className="space-y-4">
          <p className="text-muted-foreground">{t('terms.integrity.p1')}</p>
        </div>
      ))}
      
      <div className="mt-8 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} KONTACT VO S.L. - {t('footer.copyright')}</p>
      </div>
    </div>
  );
};

export default AuctionPoliciesPage;
