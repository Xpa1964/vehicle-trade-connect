
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

const OtherServicesPage = () => {
  const { t } = useLanguage();
  
  const services = [
    {
      title: t('services.vehicleTransport'),
      description: t('services.vehicleTransport.description', { fallback: "Specialized service in vehicle transport at national and international level" }),
      url: "https://example.com/transport",
      buttonText: t('transport.quote')
    },
    {
      title: t('services.inspection'),
      description: t('services.inspection.description', { fallback: "Detailed inspection of the mechanical and structural condition of vehicles" }),
      url: "https://example.com/inspection",
      buttonText: t('common.viewDetails')
    },
    {
      title: t('services.documentation'),
      description: t('services.documentation.description', { fallback: "Assistance in paperwork and documentation for vehicle import/export" }),
      url: "https://example.com/documentation",
      buttonText: t('common.viewDetails')
    },
    {
      title: t('services.storage'),
      description: t('services.storage.description', { fallback: "Secure spaces for temporary vehicle storage" }),
      url: "https://example.com/storage",
      buttonText: t('common.viewDetails')
    },
    {
      title: t('services.insurance'),
      description: t('services.insurance.description', { fallback: "Specialized coverage for vehicle transport and storage" }),
      url: "https://example.com/insurance",
      buttonText: t('common.viewDetails')
    },
    {
      title: t('services.maintenance'),
      description: t('services.maintenance.description', { fallback: "Preventive and corrective maintenance services for your fleet" }),
      url: "https://example.com/maintenance",
      buttonText: t('common.viewDetails')
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title={t('services.otherServices')} 
        subtitle={t('common.services')}
        backToHome={true}
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

export default OtherServicesPage;
