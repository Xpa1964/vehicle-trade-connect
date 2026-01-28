
import React from 'react';
import { ShieldCheck, Star, Users, Percent, Zap } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface FeatureItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ icon, title, description }) => (
  <div className="bg-gradient-to-br from-card to-secondary rounded-xl p-5 sm:p-6 md:p-7 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02] border border-border">
    <div className="flex gap-3 sm:gap-4 items-start">
      <div className="flex-shrink-0 text-primary min-h-[44px] flex items-center justify-center">
        {icon}
      </div>
      <div className="flex-1">
        <h3 className="text-base sm:text-lg md:text-xl font-bold mb-2 text-foreground">{title}</h3>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </div>
  </div>
);

const FeaturesSection: React.FC = () => {
  const { t } = useLanguage();

  const features = [
    {
      icon: <ShieldCheck className="w-8 h-8" />,
      title: t('home.features.verifiedMembers.title'),
      description: t('home.features.verifiedMembers.description'),
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: t('home.features.transparentRating.title'),
      description: t('home.features.transparentRating.description'),
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: t('home.features.noIntermediaries.title'),
      description: t('home.features.noIntermediaries.description'),
    },
    {
      icon: <Percent className="w-8 h-8" />,
      title: t('home.features.minimalCommissions.title'),
      description: t('home.features.minimalCommissions.description'),
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: t('home.features.advancedServices.title'),
      description: t('home.features.advancedServices.description'),
    }
  ];

  return (
    <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-8 bg-background">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-8 sm:mb-10 md:mb-12 text-center text-foreground">
          {t('home.whyChooseUs')}
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
          {features.map((feature, index) => (
            <FeatureItem 
              key={index} 
              icon={feature.icon} 
              title={feature.title} 
              description={feature.description} 
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
