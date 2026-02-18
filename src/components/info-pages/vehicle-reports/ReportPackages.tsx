import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Plus } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface ReportPackagesProps {
  translations: any;
  lang: string;
}

const ReportPackages: React.FC<ReportPackagesProps> = ({ translations, lang }) => {
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
    <div className="mb-16">
      <h2 className="text-2xl font-bold mb-8 text-center text-foreground">
        {t('inspection.sectionTitle')}
      </h2>
      <p className="text-center text-muted-foreground mb-8">
        {t('inspection.sectionSubtitle')}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Inspección Básica */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>{t('inspection.basic.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold mb-6 text-primary">{t('inspection.basic.price')}</p>
            <ul className="space-y-2">
              {basicFeatures.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <Check className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Inspección Estándar */}
        <Card className="relative hover:shadow-lg transition-shadow ring-1 ring-primary/20">
          <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground">
            {t('inspection.standard.badge')}
          </Badge>
          <CardHeader>
            <CardTitle>{t('inspection.standard.title')}</CardTitle>
            <CardDescription className="text-xs uppercase tracking-wide font-medium">
              {t('inspection.standard.includes')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold mb-6 text-primary">{t('inspection.standard.price')}</p>
            <ul className="space-y-2">
              {standardFeatures.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <Check className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Inspección Premium */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>{t('inspection.premium.title')}</CardTitle>
            <CardDescription className="text-xs uppercase tracking-wide font-medium">
              {t('inspection.premium.includes')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold mb-6 text-primary">{t('inspection.premium.price')}</p>
            <ul className="space-y-2">
              {premiumFeatures.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <Check className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Extras informativos */}
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground bg-card border border-border rounded-full px-4 py-2">
          <Plus className="h-3.5 w-3.5 text-primary" />
          {t('inspection.extras.dgt')}
        </span>
        <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground bg-card border border-border rounded-full px-4 py-2">
          <Plus className="h-3.5 w-3.5 text-primary" />
          {t('inspection.extras.carfax')}
        </span>
      </div>
    </div>
  );
};

export default ReportPackages;
