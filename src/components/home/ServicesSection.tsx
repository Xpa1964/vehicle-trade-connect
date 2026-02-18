
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import ServiceCard from './services/ServiceCard';
import SectionHeader from './services/SectionHeader';
import { servicesData } from './services/servicesData';
import RegistryServiceCard from './services/RegistryServiceCard';
import { Check, Plus, Shield } from 'lucide-react';

const InspectionCard: React.FC<{
  title: string;
  price: string;
  features: string[];
  includesLabel?: string;
  badge?: string;
  highlighted?: boolean;
}> = ({ title, price, features, includesLabel, badge, highlighted }) => (
  <div className={`rounded-lg shadow-card-depth border transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-card-depth-hover flex flex-col h-full overflow-hidden ${
    highlighted 
      ? 'border-primary/30 bg-gradient-to-b from-primary/10 to-card ring-1 ring-primary/20' 
      : 'border-white/[0.06] bg-gradient-to-b from-[hsl(222,28%,16%)] to-card'
  }`}>
    {badge && (
      <div className="bg-primary text-primary-foreground text-xs font-bold text-center py-1.5 uppercase tracking-wide">
        {badge}
      </div>
    )}
    <div className="p-4 sm:p-5 flex flex-col flex-1">
      <h4 className="text-base sm:text-lg font-semibold text-foreground mb-1">{title}</h4>
      <p className="text-lg sm:text-xl font-bold text-primary mb-3">{price}</p>
      {includesLabel && (
        <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">{includesLabel}</p>
      )}
      <ul className="space-y-1.5 flex-1">
        {features.map((f, i) => (
          <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-muted-foreground">
            <Check className="h-3.5 w-3.5 text-primary flex-shrink-0 mt-0.5" />
            <span>{f}</span>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

const ServicesSection: React.FC = () => {
  const { t } = useLanguage();
  
  const basicFeatures = [
    t('inspection.basic.f1'), t('inspection.basic.f2'), t('inspection.basic.f3'),
    t('inspection.basic.f4'), t('inspection.basic.f5')
  ];
  const standardFeatures = [
    t('inspection.standard.f1'), t('inspection.standard.f2'), t('inspection.standard.f3'),
    t('inspection.standard.f4'), t('inspection.standard.f5'), t('inspection.standard.f6')
  ];
  const premiumFeatures = [
    t('inspection.premium.f1'), t('inspection.premium.f2'), t('inspection.premium.f3'),
    t('inspection.premium.f4'), t('inspection.premium.f5'), t('inspection.premium.f6'),
    t('inspection.premium.f7')
  ];

  return (
    <section className="py-8 sm:py-12 md:py-16 -mt-12 sm:-mt-16 md:-mt-20 lg:-mt-24 px-4 sm:px-6 md:px-8 relative z-10">
      <div className="container mx-auto max-w-7xl">
        <SectionHeader 
          title={t('services.title')}
          subtitle={t('services.subtitle')}
        />
        
        {/* Services grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6 relative">
          {servicesData.map((service, index) => {
            let imagePosition = 'center 35%';
            if (service.titleKey === 'services.messaging') {
              imagePosition = 'center 60%';
            } else if (service.titleKey === 'services.transport') {
              imagePosition = 'center 65%';
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

        {/* Vehicle Inspection — replaces old "Entrega de Informes" */}
        <div className="mt-12 sm:mt-16">
          <div className="text-center mb-6 sm:mb-8">
            <div className="inline-flex items-center gap-2 mb-3">
              <Shield className="h-5 w-5 text-primary" />
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">
                {t('inspection.sectionTitle')}
              </h3>
            </div>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
              {t('inspection.sectionSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
            <InspectionCard
              title={t('inspection.basic.title')}
              price={t('inspection.basic.price')}
              features={basicFeatures}
            />
            <InspectionCard
              title={t('inspection.standard.title')}
              price={t('inspection.standard.price')}
              features={standardFeatures}
              includesLabel={t('inspection.standard.includes')}
              badge={t('inspection.standard.badge')}
              highlighted
            />
            <InspectionCard
              title={t('inspection.premium.title')}
              price={t('inspection.premium.price')}
              features={premiumFeatures}
              includesLabel={t('inspection.premium.includes')}
            />
          </div>

          {/* Extras informativos */}
          <div className="mt-4 sm:mt-6 flex flex-wrap justify-center gap-3 sm:gap-4">
            <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground bg-card border border-border rounded-full px-3 py-1.5">
              <Plus className="h-3 w-3 text-primary" />
              {t('inspection.extras.dgt')}
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground bg-card border border-border rounded-full px-3 py-1.5">
              <Plus className="h-3 w-3 text-primary" />
              {t('inspection.extras.carfax')}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
