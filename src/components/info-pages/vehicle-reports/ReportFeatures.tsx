
import React from 'react';
import { Card } from '@/components/ui/card';
import { Shield, Clock, Layers } from 'lucide-react';

interface ReportFeaturesProps {
  translations: {
    reportFeatures: {
      title: Record<string, string>;
      identity: {
        title: Record<string, string>;
        description: Record<string, string>;
      };
      history: {
        title: Record<string, string>;
        description: Record<string, string>;
      };
      legal: {
        title: Record<string, string>;
        description: Record<string, string>;
      };
    };
  };
  lang: string;
}

const ReportFeatures: React.FC<ReportFeaturesProps> = ({ translations, lang }) => {
  return (
    <div className="mb-16">
      <h2 className="text-2xl font-bold mb-8 text-center">
        {translations.reportFeatures.title[lang as keyof typeof translations.reportFeatures.title] || translations.reportFeatures.title.es}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex flex-col items-center text-center">
            <Shield className="h-12 w-12 text-auto-blue mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {translations.reportFeatures.identity.title[lang as keyof typeof translations.reportFeatures.identity.title] || translations.reportFeatures.identity.title.es}
            </h3>
            <p className="text-gray-600">
              {translations.reportFeatures.identity.description[lang as keyof typeof translations.reportFeatures.identity.description] || translations.reportFeatures.identity.description.es}
            </p>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex flex-col items-center text-center">
            <Clock className="h-12 w-12 text-auto-blue mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {translations.reportFeatures.history.title[lang as keyof typeof translations.reportFeatures.history.title] || translations.reportFeatures.history.title.es}
            </h3>
            <p className="text-gray-600">
              {translations.reportFeatures.history.description[lang as keyof typeof translations.reportFeatures.history.description] || translations.reportFeatures.history.description.es}
            </p>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex flex-col items-center text-center">
            <Layers className="h-12 w-12 text-auto-blue mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {translations.reportFeatures.legal.title[lang as keyof typeof translations.reportFeatures.legal.title] || translations.reportFeatures.legal.title.es}
            </h3>
            <p className="text-gray-600">
              {translations.reportFeatures.legal.description[lang as keyof typeof translations.reportFeatures.legal.description] || translations.reportFeatures.legal.description.es}
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ReportFeatures;
