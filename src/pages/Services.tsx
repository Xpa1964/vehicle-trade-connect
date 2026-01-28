
import React from 'react';
import { ExternalLink } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useLanguage } from '@/contexts/LanguageContext';
import PageHeader from '@/components/layout/PageHeader';

interface ServiceCardProps {
  title: string;
  description: string;
  url: string;
  buttonText: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ title, description, url, buttonText }) => (
  <Card className="hover:shadow-lg transition-shadow">
    <CardHeader>
      <CardTitle className="text-lg font-semibold text-auto-blue">{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
    <CardContent>
      <a 
        href={url} 
        target="_blank" 
        rel="noopener noreferrer"
        className="inline-flex items-center text-sm text-auto-blue hover:text-auto-blue/80 transition-colors"
      >
        {buttonText}
        <ExternalLink className="ml-2 h-4 w-4" />
      </a>
    </CardContent>
  </Card>
);

const Services = () => {
  const { t, currentLanguage } = useLanguage();
  
  const services = [
    {
      title: currentLanguage === 'es' ? "Transporte Vehicular" : 
             currentLanguage === 'fr' ? "Transport de Véhicules" :
             currentLanguage === 'it' ? "Trasporto Veicoli" :
             "Vehicle Transport",
      description: currentLanguage === 'es' ? "Servicio especializado en transporte de vehículos a nivel nacional e internacional" : 
                   currentLanguage === 'fr' ? "Service spécialisé dans le transport de véhicules au niveau national et international" :
                   currentLanguage === 'it' ? "Servizio specializzato nel trasporto di veicoli a livello nazionale e internazionale" :
                   "Specialized service in vehicle transport at national and international level",
      url: "https://example.com/transport",
      buttonText: t('transport.quote')
    },
    {
      title: currentLanguage === 'es' ? "Inspección Técnica" :
             currentLanguage === 'fr' ? "Inspection Technique" :
             currentLanguage === 'it' ? "Ispezione Tecnica" :
             "Technical Inspection",
      description: currentLanguage === 'es' ? "Inspección detallada del estado mecánico y estructural de los vehículos" :
                   currentLanguage === 'fr' ? "Inspection détaillée de l'état mécanique et structurel des véhicules" :
                   currentLanguage === 'it' ? "Ispezione dettagliata delle condizioni meccaniche e strutturali dei veicoli" :
                   "Detailed inspection of the mechanical and structural condition of vehicles",
      url: "https://example.com/inspection",
      buttonText: t('common.viewDetails')
    },
    {
      title: currentLanguage === 'es' ? "Gestión Documental" :
             currentLanguage === 'fr' ? "Gestion Documentaire" :
             currentLanguage === 'it' ? "Gestione Documentale" :
             "Document Management",
      description: currentLanguage === 'es' ? "Asistencia en trámites y documentación para importación/exportación de vehículos" :
                   currentLanguage === 'fr' ? "Assistance pour les procédures et la documentation d'importation/exportation de véhicules" :
                   currentLanguage === 'it' ? "Assistenza nelle procedure e nella documentazione per l'importazione/esportazione di veicoli" :
                   "Assistance in paperwork and documentation for vehicle import/export",
      url: "https://example.com/documentation",
      buttonText: t('common.viewDetails')
    },
    {
      title: currentLanguage === 'es' ? "Almacenamiento" :
             currentLanguage === 'fr' ? "Stockage" :
             currentLanguage === 'it' ? "Stoccaggio" :
             "Storage",
      description: currentLanguage === 'es' ? "Espacios seguros para el almacenamiento temporal de vehículos" :
                   currentLanguage === 'fr' ? "Espaces sécurisés pour le stockage temporaire de véhicules" :
                   currentLanguage === 'it' ? "Spazi sicuri per lo stoccaggio temporaneo di veicoli" :
                   "Secure spaces for temporary vehicle storage",
      url: "https://example.com/storage",
      buttonText: t('common.viewDetails')
    },
    {
      title: currentLanguage === 'es' ? "Seguros" :
             currentLanguage === 'fr' ? "Assurances" :
             currentLanguage === 'it' ? "Assicurazioni" :
             "Insurance",
      description: currentLanguage === 'es' ? "Coberturas especializadas para el transporte y almacenamiento de vehículos" :
                   currentLanguage === 'fr' ? "Couvertures spécialisées pour le transport et le stockage de véhicules" :
                   currentLanguage === 'it' ? "Coperture specializzate per il trasporto e lo stoccaggio di veicoli" :
                   "Specialized coverage for vehicle transport and storage",
      url: "https://example.com/insurance",
      buttonText: t('common.viewDetails')
    },
    {
      title: currentLanguage === 'es' ? "Mantenimiento" :
             currentLanguage === 'fr' ? "Maintenance" :
             currentLanguage === 'it' ? "Manutenzione" :
             "Maintenance",
      description: currentLanguage === 'es' ? "Servicios de mantenimiento preventivo y correctivo para su flota" :
                   currentLanguage === 'fr' ? "Services de maintenance préventive et corrective pour votre flotte" :
                   currentLanguage === 'it' ? "Servizi di manutenzione preventiva e correttiva per la vostra flotta" :
                   "Preventive and corrective maintenance services for your fleet",
      url: "https://example.com/maintenance",
      buttonText: t('common.viewDetails')
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title={t('common.services')} 
        subtitle={t('common.otherServices')}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service, index) => (
          <ServiceCard
            key={index}
            title={service.title}
            description={service.description}
            url={service.url}
            buttonText={service.buttonText}
          />
        ))}
      </div>
    </div>
  );
};

export default Services;
