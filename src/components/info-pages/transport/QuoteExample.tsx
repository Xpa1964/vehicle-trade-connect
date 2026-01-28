
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Truck, Route } from 'lucide-react';

interface QuoteExampleProps {
  translations: {
    quoteExample: {
      title: Record<string, string>;
      route: Record<string, string>;
      origin: Record<string, string>;
      destination: Record<string, string>;
      vehicle: Record<string, string>;
      serviceType: Record<string, string>;
      estimatedTime: Record<string, string>;
      insurance: Record<string, string>;
      price: Record<string, string>;
      buttonText: Record<string, string>;
    };
  };
  quoteExample: {
    origin: string;
    destination: string;
    vehicle: string;
    serviceType: string;
    estimatedTime: string;
    insurance: string;
    price: string;
  };
  lang: string;
}

const QuoteExample: React.FC<QuoteExampleProps> = ({ translations, quoteExample, lang }) => {
  return (
    <div className="mb-16">
      <h2 className="text-2xl font-bold mb-8 text-center">
        {translations.quoteExample.title[lang as keyof typeof translations.quoteExample.title] || translations.quoteExample.title.es}
      </h2>

      <Card className="max-w-3xl mx-auto">
        <CardHeader className="bg-gray-50 border-b">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <Truck className="h-8 w-8 text-auto-blue mr-3" />
              <CardTitle>{translations.quoteExample.route[lang as keyof typeof translations.quoteExample.route] || translations.quoteExample.route.es}</CardTitle>
            </div>
            <div className="flex items-center">
              <Route className="h-6 w-6 text-auto-blue" />
              <div className="flex items-center">
                <span className="mx-2 text-sm font-medium">{quoteExample.origin}</span>
                <span className="mx-2">→</span>
                <span className="mx-2 text-sm font-medium">{quoteExample.destination}</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                {translations.quoteExample.vehicle[lang as keyof typeof translations.quoteExample.vehicle] || translations.quoteExample.vehicle.es}
              </h3>
              <p className="text-lg font-semibold">{quoteExample.vehicle}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                {translations.quoteExample.serviceType[lang as keyof typeof translations.quoteExample.serviceType] || translations.quoteExample.serviceType.es}
              </h3>
              <p className="text-lg font-semibold">{quoteExample.serviceType}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                {translations.quoteExample.estimatedTime[lang as keyof typeof translations.quoteExample.estimatedTime] || translations.quoteExample.estimatedTime.es}
              </h3>
              <p className="text-lg font-semibold">{quoteExample.estimatedTime}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                {translations.quoteExample.insurance[lang as keyof typeof translations.quoteExample.insurance] || translations.quoteExample.insurance.es}
              </h3>
              <p className="text-lg font-semibold">{quoteExample.insurance}</p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t flex flex-col md:flex-row items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">
                {translations.quoteExample.price[lang as keyof typeof translations.quoteExample.price] || translations.quoteExample.price.es}
              </h3>
              <p className="text-2xl font-bold text-auto-blue">{quoteExample.price}</p>
            </div>
            <div className="mt-4 md:mt-0">
              <Button size="lg" className="bg-auto-blue hover:bg-blue-700">
                {translations.quoteExample.buttonText[lang as keyof typeof translations.quoteExample.buttonText] || translations.quoteExample.buttonText.es}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuoteExample;
