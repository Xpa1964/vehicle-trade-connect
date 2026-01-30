
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import ServiceCard from './services/ServiceCard';
import SectionHeader from './services/SectionHeader';
import { servicesData } from './services/servicesData';
import RegistryServiceCard from './services/RegistryServiceCard';

const ServicesSection: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <section className="py-8 sm:py-12 md:py-16 -mt-12 sm:-mt-16 md:-mt-20 lg:-mt-24 px-4 sm:px-6 md:px-8 relative z-10">
      <div className="container mx-auto max-w-7xl">
        <SectionHeader 
          title={t('services.title')}
          subtitle={t('services.subtitle')}
        />
        
        {/* Responsive grid with optimal spacing - MEJORADO PROGRESIÓN MÓVIL */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6 relative">
          {servicesData.map((service, index) => {
            // Ajustar posición de imagen según el servicio
            let imagePosition = 'center 35%';
            if (service.titleKey === 'services.messaging') {
              imagePosition = 'center 60%'; // Cortar más arriba, mostrar buzón y mail
            } else if (service.titleKey === 'services.transport') {
              imagePosition = 'center 65%'; // Cortar más arriba, mostrar camión completo
            }
            
            return (
              service.registryId ? (
                <RegistryServiceCard
                  key={index}
                  imageId={service.registryId}
                  fallbackBackgroundImage={service.backgroundImage}
                  icon={service.icon}
                  title={t(service.titleKey)}
                  description={t(service.descriptionKey)}
                  linkText={t('common.learnMore')}
                  linkPath={service.link}
                  gradient={service.backgroundImage ? `${service.gradient}/80` : undefined}
                  imagePosition={imagePosition}
                  badge={service.badge}
                  className="transform transition-all duration-300 hover:scale-[1.02] sm:hover:scale-105"
                />
              ) : (
                <ServiceCard
                  key={index}
                  icon={service.icon}
                  title={t(service.titleKey)}
                  description={t(service.descriptionKey)}
                  linkText={t('common.learnMore')}
                  linkPath={service.link}
                  backgroundImage={service.backgroundImage}
                  gradient={service.backgroundImage ? `${service.gradient}/80` : undefined}
                  imagePosition={imagePosition}
                  badge={service.badge}
                  className="transform transition-all duration-300 hover:scale-[1.02] sm:hover:scale-105"
                />
              )
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
