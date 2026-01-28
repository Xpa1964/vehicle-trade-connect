
import React from 'react';
import { Search, Filter, BarChart, Bookmark } from 'lucide-react';
import FeatureCard from '../FeatureCard';

interface FeaturesProps {
  translations: {
    features: {
      search: { title: Record<string, string>; description: Record<string, string> };
      filters: { title: Record<string, string>; description: Record<string, string> };
      stats: { title: Record<string, string>; description: Record<string, string> };
      saved: { title: Record<string, string>; description: Record<string, string> };
    };
  };
  lang: string;
}

const GalleryFeatures: React.FC<FeaturesProps> = ({ translations, lang }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      <FeatureCard 
        icon={<Search className="h-12 w-12" />}
        title={translations.features.search.title[lang as keyof typeof translations.features.search.title] || translations.features.search.title.es}
        description={translations.features.search.description[lang as keyof typeof translations.features.search.description] || translations.features.search.description.es}
      />
      
      <FeatureCard 
        icon={<Filter className="h-12 w-12" />}
        title={translations.features.filters.title[lang as keyof typeof translations.features.filters.title] || translations.features.filters.title.es}
        description={translations.features.filters.description[lang as keyof typeof translations.features.filters.description] || translations.features.filters.description.es}
      />
      
      <FeatureCard 
        icon={<BarChart className="h-12 w-12" />}
        title={translations.features.stats.title[lang as keyof typeof translations.features.stats.title] || translations.features.stats.title.es}
        description={translations.features.stats.description[lang as keyof typeof translations.features.stats.description] || translations.features.stats.description.es}
      />
      
      <FeatureCard 
        icon={<Bookmark className="h-12 w-12" />}
        title={translations.features.saved.title[lang as keyof typeof translations.features.saved.title] || translations.features.saved.title.es}
        description={translations.features.saved.description[lang as keyof typeof translations.features.saved.description] || translations.features.saved.description.es}
      />
    </div>
  );
};

export default GalleryFeatures;
