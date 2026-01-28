
import React from 'react';
import { ShieldCheck, Timer, Globe, MapPin } from 'lucide-react';
import FeatureCard from '../FeatureCard';

interface TransportFeaturesProps {
  translations: {
    features: {
      safety: {
        title: Record<string, string>;
        description: Record<string, string>;
      };
      speed: {
        title: Record<string, string>;
        description: Record<string, string>;
      };
      coverage: {
        title: Record<string, string>;
        description: Record<string, string>;
      };
      tracking: {
        title: Record<string, string>;
        description: Record<string, string>;
      };
    };
  };
  lang: string;
}

const TransportFeatures: React.FC<TransportFeaturesProps> = ({ translations, lang }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      <FeatureCard 
        icon={<ShieldCheck className="h-12 w-12" />}
        title={translations.features.safety.title[lang as keyof typeof translations.features.safety.title] || translations.features.safety.title.es}
        description={translations.features.safety.description[lang as keyof typeof translations.features.safety.description] || translations.features.safety.description.es}
      />

      <FeatureCard 
        icon={<Timer className="h-12 w-12" />}
        title={translations.features.speed.title[lang as keyof typeof translations.features.speed.title] || translations.features.speed.title.es}
        description={translations.features.speed.description[lang as keyof typeof translations.features.speed.description] || translations.features.speed.description.es}
      />

      <FeatureCard 
        icon={<Globe className="h-12 w-12" />}
        title={translations.features.coverage.title[lang as keyof typeof translations.features.coverage.title] || translations.features.coverage.title.es}
        description={translations.features.coverage.description[lang as keyof typeof translations.features.coverage.description] || translations.features.coverage.description.es}
      />

      <FeatureCard 
        icon={<MapPin className="h-12 w-12" />}
        title={translations.features.tracking.title[lang as keyof typeof translations.features.tracking.title] || translations.features.tracking.title.es}
        description={translations.features.tracking.description[lang as keyof typeof translations.features.tracking.description] || translations.features.tracking.description.es}
      />
    </div>
  );
};

export default TransportFeatures;
