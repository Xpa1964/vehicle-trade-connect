
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface TransportServicesProps {
  translations: {
    services: {
      title: Record<string, string>;
      standard: {
        title: Record<string, string>;
        description: Record<string, string>;
        features: Record<string, string[]>;
      };
      express: {
        title: Record<string, string>;
        description: Record<string, string>;
        features: Record<string, string[]>;
      };
      premium: {
        title: Record<string, string>;
        description: Record<string, string>;
        features: Record<string, string[]>;
      };
    };
    quoteExample: {
      buttonText: Record<string, string>;
    };
  };
  lang: string;
}

const TransportServices: React.FC<TransportServicesProps> = ({ translations, lang }) => {
  return (
    <div className="mb-16">
      <h2 className="text-2xl font-bold mb-8 text-center">
        {translations.services.title[lang as keyof typeof translations.services.title] || translations.services.title.es}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Standard Transport */}
        <Card className="flex flex-col h-full hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>{translations.services.standard.title[lang as keyof typeof translations.services.standard.title] || translations.services.standard.title.es}</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="mb-4 text-gray-600">{translations.services.standard.description[lang as keyof typeof translations.services.standard.description] || translations.services.standard.description.es}</p>
            <ul className="space-y-2">
              {(translations.services.standard.features[lang as keyof typeof translations.services.standard.features] || translations.services.standard.features.es).map((feature, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              {translations.quoteExample.buttonText[lang as keyof typeof translations.quoteExample.buttonText] || translations.quoteExample.buttonText.es}
            </Button>
          </CardFooter>
        </Card>

        {/* Express Transport */}
        <Card className="flex flex-col h-full border-t-4 border-t-auto-blue hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-auto-blue">{translations.services.express.title[lang as keyof typeof translations.services.express.title] || translations.services.express.title.es}</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="mb-4 text-gray-600">{translations.services.express.description[lang as keyof typeof translations.services.express.description] || translations.services.express.description.es}</p>
            <ul className="space-y-2">
              {(translations.services.express.features[lang as keyof typeof translations.services.express.features] || translations.services.express.features.es).map((feature, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-auto-blue mr-2">✓</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-auto-blue hover:bg-blue-700">
              {translations.quoteExample.buttonText[lang as keyof typeof translations.quoteExample.buttonText] || translations.quoteExample.buttonText.es}
            </Button>
          </CardFooter>
        </Card>

        {/* Premium Transport */}
        <Card className="flex flex-col h-full border-t-4 border-t-auto-gold hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-auto-gold">{translations.services.premium.title[lang as keyof typeof translations.services.premium.title] || translations.services.premium.title.es}</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="mb-4 text-gray-600">{translations.services.premium.description[lang as keyof typeof translations.services.premium.description] || translations.services.premium.description.es}</p>
            <ul className="space-y-2">
              {(translations.services.premium.features[lang as keyof typeof translations.services.premium.features] || translations.services.premium.features.es).map((feature, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-auto-gold mr-2">✓</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-auto-gold hover:bg-yellow-600">
              {translations.quoteExample.buttonText[lang as keyof typeof translations.quoteExample.buttonText] || translations.quoteExample.buttonText.es}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default TransportServices;
