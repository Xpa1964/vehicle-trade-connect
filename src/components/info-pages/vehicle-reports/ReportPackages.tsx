import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Check, Download, AlertCircle } from 'lucide-react';

interface ReportPackagesProps {
  translations: {
    restrictionNotice: Record<string, string>;
    reportTypes: {
      basic: {
        title: Record<string, string>;
        description: Record<string, string>;
        features: Record<string, string[]>;
        price: Record<string, string>;
      };
      plus: {
        title: Record<string, string>;
        description: Record<string, string>;
        features: Record<string, string[]>;
        price: Record<string, string>;
      };
      premium: {
        title: Record<string, string>;
        description: Record<string, string>;
        features: Record<string, string[]>;
        price: Record<string, string>;
        restrictions?: Record<string, string>;
      };
    };
    cta: Record<string, string>;
    viewSample: Record<string, string>;
  };
  lang: string;
}

const ReportPackages: React.FC<ReportPackagesProps> = ({ translations, lang }) => {
  const handleDownloadSample = (reportType: 'basic' | 'technical' | 'premium') => {
    const pdfPath = reportType === 'basic' 
      ? '/samples/informe-basico-ejemplo.pdf'
      : reportType === 'technical'
      ? '/samples/informe-tecnico-ejemplo.pdf'
      : '/samples/informe-premium-ejemplo.pdf';
    window.open(pdfPath, '_blank');
  };

  return (
    <div className="mb-16">
      {/* Restriction Notice Banner */}
      <Alert className="mb-8 border-amber-500 bg-amber-50">
        <AlertCircle className="h-5 w-5 text-amber-600" />
        <AlertDescription className="text-amber-900 font-medium">
          {translations.restrictionNotice[lang as keyof typeof translations.restrictionNotice] || translations.restrictionNotice.es}
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Basic Report - Informe DGT */}
      <Card className="border-t-4 border-t-gray-400 hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle>{translations.reportTypes.basic.title[lang as keyof typeof translations.reportTypes.basic.title] || translations.reportTypes.basic.title.es}</CardTitle>
          <CardDescription>{translations.reportTypes.basic.description[lang as keyof typeof translations.reportTypes.basic.description] || translations.reportTypes.basic.description.es}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold mb-6">{translations.reportTypes.basic.price[lang as keyof typeof translations.reportTypes.basic.price] || translations.reportTypes.basic.price.es}</p>
          <ul className="space-y-2">
            {(translations.reportTypes.basic.features[lang as keyof typeof translations.reportTypes.basic.features] || translations.reportTypes.basic.features.es).map((feature, index) => (
              <li key={index} className="flex items-start">
                <Check className="h-5 w-5 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{feature}</span>
              </li>
            ))}
          </ul>
        </CardContent>
        <CardFooter>
          <Button 
            variant="outline" 
            className="w-full border-gray-400 text-gray-600 hover:bg-gray-50"
            onClick={() => handleDownloadSample('basic')}
          >
            <Download className="h-4 w-4 mr-2" />
            {translations.viewSample[lang as keyof typeof translations.viewSample] || translations.viewSample.es}
          </Button>
        </CardFooter>
      </Card>

      {/* Plus Report - Informe Técnico Completo */}
      <Card className="border-t-4 border-t-auto-blue relative hover:shadow-lg transition-shadow">
        <Badge className="absolute top-4 right-4 bg-auto-blue">
          {lang === 'es' ? 'Más Popular' : lang === 'fr' ? 'Plus Populaire' : lang === 'it' ? 'Più Popolare' : 'Most Popular'}
        </Badge>
        <CardHeader>
          <CardTitle>{translations.reportTypes.plus.title[lang as keyof typeof translations.reportTypes.plus.title] || translations.reportTypes.plus.title.es}</CardTitle>
          <CardDescription>{translations.reportTypes.plus.description[lang as keyof typeof translations.reportTypes.plus.description] || translations.reportTypes.plus.description.es}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold mb-6">{translations.reportTypes.plus.price[lang as keyof typeof translations.reportTypes.plus.price] || translations.reportTypes.plus.price.es}</p>
          <ul className="space-y-2 mb-4">
            {(translations.reportTypes.plus.features[lang as keyof typeof translations.reportTypes.plus.features] || translations.reportTypes.plus.features.es).map((feature, index) => (
              <li key={index} className="flex items-start">
                <Check className="h-5 w-5 text-auto-blue mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{feature}</span>
              </li>
            ))}
          </ul>
        </CardContent>
        <CardFooter>
          <Button 
            variant="outline" 
            className="w-full border-auto-blue text-auto-blue hover:bg-auto-blue/10"
            onClick={() => handleDownloadSample('technical')}
          >
            <Download className="h-4 w-4 mr-2" />
            {translations.viewSample[lang as keyof typeof translations.viewSample] || translations.viewSample.es}
          </Button>
        </CardFooter>
      </Card>

      {/* Premium Report - Informe Premium con Inspección Física */}
      <Card className="border-t-4 border-t-auto-gold hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle>{translations.reportTypes.premium.title[lang as keyof typeof translations.reportTypes.premium.title] || translations.reportTypes.premium.title.es}</CardTitle>
          <CardDescription>{translations.reportTypes.premium.description[lang as keyof typeof translations.reportTypes.premium.description] || translations.reportTypes.premium.description.es}</CardDescription>
          {translations.reportTypes.premium.restrictions && (
            <div className="mt-3 p-2 bg-amber-50 border border-amber-200 rounded-md">
              <p className="text-xs text-amber-900 font-medium">
                ⚠️ {translations.reportTypes.premium.restrictions[lang as keyof typeof translations.reportTypes.premium.restrictions] || translations.reportTypes.premium.restrictions.es}
              </p>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold mb-6">{translations.reportTypes.premium.price[lang as keyof typeof translations.reportTypes.premium.price] || translations.reportTypes.premium.price.es}</p>
          <ul className="space-y-2 mb-4">
            {(translations.reportTypes.premium.features[lang as keyof typeof translations.reportTypes.premium.features] || translations.reportTypes.premium.features.es).map((feature, index) => (
              <li key={index} className="flex items-start">
                <Check className="h-5 w-5 text-auto-gold mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{feature}</span>
              </li>
            ))}
          </ul>
        </CardContent>
        <CardFooter>
          <Button 
            variant="outline" 
            className="w-full border-auto-gold text-auto-gold hover:bg-auto-gold/10"
            onClick={() => handleDownloadSample('premium')}
          >
            <Download className="h-4 w-4 mr-2" />
            {translations.viewSample[lang as keyof typeof translations.viewSample] || translations.viewSample.es}
          </Button>
        </CardFooter>
      </Card>
      </div>
    </div>
  );
};

export default ReportPackages;
