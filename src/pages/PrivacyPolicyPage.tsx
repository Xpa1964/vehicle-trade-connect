
import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { ChevronDown, ChevronUp, FileText, Shield } from 'lucide-react';
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from '@/components/ui/collapsible';

const PrivacyPolicyPage: React.FC = () => {
  const { t } = useLanguage();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    section1: true,
  });

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Función para renderizar listas a partir de strings separados por punto y coma
  const renderList = (listString: string) => {
    return listString.split(';').map((item, index) => (
      <li key={index} className="mb-1">{item}</li>
    ));
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-6">
          <img 
            src="/lovable-uploads/c68019ea-0437-4bf7-b1b0-2270c4eca601.png" 
            alt="KONTACT VO Logo" 
            className="h-24 w-auto"
          />
        </div>
        <h1 className="text-3xl font-bold mb-2 text-foreground">{t('common.privacyPolicy')}</h1>
        <p className="text-muted-foreground">{t('privacy.subtitle')}</p>
      </div>
      
      {/* Contenido de la política de privacidad */}
      <div className="space-y-4 mb-8">
        {/* Sección: Introducción */}
        <div className="border border-border rounded-md mb-4 overflow-hidden">
          <div className="p-4 bg-secondary">
            <div className="flex items-center">
              <Shield className="mr-2 h-5 w-5 text-primary" />
              <h3 className="text-lg font-medium text-foreground">1. {t('privacy.introduction.title')}</h3>
            </div>
          </div>
          <div className="p-4 bg-card">
            <p className="mb-4 text-foreground">{t('privacy.introduction.p1')}</p>
            <p className="mb-4 text-foreground">{t('privacy.introduction.p2')}</p>
            <p className="mb-4 text-foreground">{t('privacy.introduction.p3')}</p>
            <p className="text-foreground">{t('privacy.introduction.p4')}</p>
          </div>
        </div>

        {/* Sección: Datos recopilados */}
        <div className="border border-border rounded-md mb-4 overflow-hidden">
          <div className="p-4 bg-secondary">
            <div className="flex items-center">
              <FileText className="mr-2 h-5 w-5 text-primary" />
              <h3 className="text-lg font-medium text-foreground">2. {t('privacy.dataCollected.title')}</h3>
            </div>
          </div>
          <div className="p-4 bg-card">
            <p className="mb-4 text-foreground">{t('privacy.dataCollected.p1')}</p>
            
            <h4 className="font-semibold mt-4 mb-2 text-foreground">{t('privacy.dataCollected.subtitle1')}</h4>
            <p className="mb-4 text-foreground">{t('privacy.dataCollected.p2')}</p>
            
            <h4 className="font-semibold mt-4 mb-2 text-foreground">{t('privacy.dataCollected.subtitle2')}</h4>
            <p className="mb-4 text-foreground">{t('privacy.dataCollected.p3')}</p>
            
            <h4 className="font-semibold mt-4 mb-2 text-foreground">{t('privacy.dataCollected.subtitle3')}</h4>
            <p className="mb-4 text-foreground">{t('privacy.dataCollected.p4')}</p>
            
            <p className="mb-2 text-foreground"><strong>{t('privacy.dataCollected.allUsers')}</strong></p>
            <ul className="list-disc pl-5 mb-4 text-muted-foreground">
              {renderList(t('privacy.dataCollected.allUsers.list'))}
            </ul>
            
            <p className="mb-2 text-foreground"><strong>{t('privacy.dataCollected.proUsers')}</strong></p>
            <ul className="list-disc pl-5 mb-4 text-muted-foreground">
              {renderList(t('privacy.dataCollected.proUsers.list'))}
            </ul>
            
            <p className="mb-4 text-foreground">{t('privacy.dataCollected.p5')}</p>
            <p className="mb-4 text-foreground">{t('privacy.dataCollected.p6')}</p>
            
            <h4 className="font-semibold mt-4 mb-2 text-foreground">{t('privacy.dataCollected.subtitle4')}</h4>
            <p className="text-foreground">{t('privacy.dataCollected.p7')}</p>
          </div>
        </div>

        {/* Sección: Recolección de datos */}
        <div className="border border-border rounded-md mb-4 overflow-hidden">
          <div className="p-4 bg-secondary">
            <div className="flex items-center">
              <FileText className="mr-2 h-5 w-5 text-primary" />
              <h3 className="text-lg font-medium text-foreground">3. {t('privacy.dataCollection.title')}</h3>
            </div>
          </div>
          <div className="p-4 bg-card">
            <p className="mb-4 text-foreground">{t('privacy.dataCollection.p1')}</p>
            
            <h4 className="font-semibold mt-4 mb-2 text-foreground">{t('privacy.dataCollection.subtitle1')}</h4>
            <p className="text-foreground">{t('privacy.dataCollection.p2')}</p>
          </div>
        </div>

        {/* Sección: Uso de datos */}
        <div className="border border-border rounded-md mb-4 overflow-hidden">
          <div className="p-4 bg-secondary">
            <div className="flex items-center">
              <FileText className="mr-2 h-5 w-5 text-primary" />
              <h3 className="text-lg font-medium text-foreground">4. {t('privacy.dataUsage.title')}</h3>
            </div>
          </div>
          <div className="p-4 bg-card">
            <p className="mb-4 text-foreground">{t('privacy.dataUsage.p1')}</p>
            <ul className="list-disc pl-5 mb-4 text-muted-foreground">
              {renderList(t('privacy.dataUsage.list1'))}
            </ul>
            
            <h4 className="font-semibold mt-4 mb-2 text-foreground">{t('privacy.dataUsage.subtitle1')}</h4>
            <p className="mb-4 text-foreground">{t('privacy.dataUsage.p2')}</p>
            
            <ul className="mb-4 text-foreground">
              <li className="mb-2"><strong>{t('privacy.dataUsage.consent.title')}</strong><br/>
              <span className="text-muted-foreground">{t('privacy.dataUsage.consent.text')}</span></li>
              
              <li className="mb-2"><strong>{t('privacy.dataUsage.contract.title')}</strong><br/>
              <span className="text-muted-foreground">{t('privacy.dataUsage.contract.text')}</span></li>
              
              <li className="mb-2"><strong>{t('privacy.dataUsage.legal.title')}</strong><br/>
              <span className="text-muted-foreground">{t('privacy.dataUsage.legal.text')}</span></li>
              
              <li className="mb-2"><strong>{t('privacy.dataUsage.legitimate.title')}</strong><br/>
              <span className="text-muted-foreground">{t('privacy.dataUsage.legitimate.text')}</span></li>
            </ul>
            
            <h4 className="font-semibold mt-4 mb-2 text-foreground">{t('privacy.dataUsage.subtitle2')}</h4>
            <p className="mb-4 text-foreground">{t('privacy.dataUsage.p3')}</p>
            
            <p className="mb-2 text-foreground"><strong>{t('privacy.dataUsage.recipients')}</strong></p>
            <ul className="list-disc pl-5 mb-4 text-muted-foreground">
              {renderList(t('privacy.dataUsage.recipients.list'))}
            </ul>
          </div>
        </div>

        {/* Sección: Derechos */}
        <div className="border border-border rounded-md mb-4 overflow-hidden">
          <div className="p-4 bg-secondary">
            <div className="flex items-center">
              <FileText className="mr-2 h-5 w-5 text-primary" />
              <h3 className="text-lg font-medium text-foreground">5. {t('privacy.yourRights.title')}</h3>
            </div>
          </div>
          <div className="p-4 bg-card">
            <p className="mb-4 text-foreground">{t('privacy.yourRights.p1')}</p>
            <p className="text-foreground">{t('privacy.yourRights.p2')}</p>
          </div>
        </div>

        {/* Sección: Seguridad */}
        <div className="border border-border rounded-md mb-4 overflow-hidden">
          <div className="p-4 bg-secondary">
            <div className="flex items-center">
              <FileText className="mr-2 h-5 w-5 text-primary" />
              <h3 className="text-lg font-medium text-foreground">6. {t('privacy.security.title')}</h3>
            </div>
          </div>
          <div className="p-4 bg-card">
            <p className="mb-4 text-foreground">{t('privacy.security.p1')}</p>
            <p className="mb-2 text-foreground"><strong>{t('privacy.security.measures')}</strong></p>
            <ul className="list-disc pl-5 mb-4 text-muted-foreground">
              {renderList(t('privacy.security.measures.list'))}
            </ul>
            <p className="text-foreground">{t('privacy.security.p2')}</p>
          </div>
        </div>

        {/* Sección: Contacto */}
        <div className="border border-border rounded-md mb-4 overflow-hidden">
          <div className="p-4 bg-secondary">
            <div className="flex items-center">
              <FileText className="mr-2 h-5 w-5 text-primary" />
              <h3 className="text-lg font-medium text-foreground">7. {t('privacy.contact.title')}</h3>
            </div>
          </div>
          <div className="p-4 bg-card">
            <p className="text-foreground">{t('privacy.contact.p1')}</p>
            <div className="mt-4 text-primary">
              <p>{t('privacy.contact.email')}</p>
              <p>{t('privacy.contact.phone')}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} KONTACT VO S.L. - {t('footer.copyright')}</p>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
