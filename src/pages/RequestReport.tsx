import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ReportRequestForm } from '@/components/vehicle-reports/ReportRequestForm';
import { useLanguage } from '@/contexts/LanguageContext';
import SafeImage from '@/components/shared/SafeImage';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const RequestReport = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleSuccess = () => {
    navigate('/vehicle-reports');
  };

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
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-xl shadow-lg mb-6 mx-4 mt-4" style={{ minHeight: '320px' }}>
        <div className="absolute inset-0 z-0">
          <SafeImage 
            imageId="hero.reports.delivery"
            alt="Solicitar Informe"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60" />
        </div>
        
        <div className="relative z-10 p-8 flex flex-col justify-between" style={{ minHeight: '320px' }}>
          <div className="mb-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate('/dashboard')}
              className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('navigation.backToControlPanel')}
            </Button>
          </div>
          
           <div className="flex-1 flex flex-col justify-end gap-3">
            <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg [text-shadow:_0_2px_8px_rgb(0_0_0_/_80%)]">
              {t('reports.form.title')}
            </h1>
            <p className="text-lg text-white font-medium drop-shadow-lg [text-shadow:_0_2px_8px_rgb(0_0_0_/_80%)]">
              {t('reports.form.description')}
            </p>
          </div>
        </div>
      </div>

      {/* Compact Inspection Packages */}
      <div className="container mx-auto px-4 max-w-5xl mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Básica */}
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-base">{t('inspection.basic.title')}</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4 pt-0">
              <p className="text-xl font-bold mb-3 text-primary">{t('inspection.basic.price')}</p>
              <ul className="space-y-1">
                {basicFeatures.map((f, i) => (
                  <li key={i} className="flex items-start text-xs">
                    <Check className="h-3.5 w-3.5 text-primary mr-1.5 mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{f}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-3 pt-2 border-t border-border/50 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Plus className="h-3 w-3 text-primary" />
                    {t('inspection.extras.dgt')}
                  </span>
                  <span className="text-muted-foreground font-medium">{t('inspection.extras.dgt.price')}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Plus className="h-3 w-3 text-primary" />
                    {t('inspection.extras.carfax')}
                  </span>
                  <span className="text-muted-foreground font-medium">{t('inspection.extras.carfax.price')}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Estándar */}
          <Card className="relative hover:shadow-md transition-shadow ring-1 ring-primary/20">
            <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground text-[10px]">
              {t('inspection.standard.badge')}
            </Badge>
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-base">{t('inspection.standard.title')}</CardTitle>
              <CardDescription className="text-[10px] uppercase tracking-wide font-medium">
                {t('inspection.standard.includes')}
              </CardDescription>
            </CardHeader>
            <CardContent className="px-4 pb-4 pt-0">
              <p className="text-xl font-bold mb-3 text-primary">{t('inspection.standard.price')}</p>
              <ul className="space-y-1">
                {standardFeatures.map((f, i) => (
                  <li key={i} className="flex items-start text-xs">
                    <Check className="h-3.5 w-3.5 text-primary mr-1.5 mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{f}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-3 pt-2 border-t border-border/50 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Plus className="h-3 w-3 text-primary" />
                    {t('inspection.extras.dgt')}
                  </span>
                  <span className="text-muted-foreground font-medium">{t('inspection.extras.dgt.price')}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Plus className="h-3 w-3 text-primary" />
                    {t('inspection.extras.carfax')}
                  </span>
                  <span className="text-muted-foreground font-medium">{t('inspection.extras.carfax.price')}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Premium */}
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-base">{t('inspection.premium.title')}</CardTitle>
              <CardDescription className="text-[10px] uppercase tracking-wide font-medium">
                {t('inspection.premium.includes')}
              </CardDescription>
            </CardHeader>
            <CardContent className="px-4 pb-4 pt-0">
              <p className="text-xl font-bold mb-3 text-primary">{t('inspection.premium.price')}</p>
              <ul className="space-y-1">
                {premiumFeatures.map((f, i) => (
                  <li key={i} className="flex items-start text-xs">
                    <Check className="h-3.5 w-3.5 text-primary mr-1.5 mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{f}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-3 pt-2 border-t border-border/50 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Plus className="h-3 w-3 text-primary" />
                    {t('inspection.extras.dgt')}
                  </span>
                  <span className="text-muted-foreground font-medium">{t('inspection.extras.dgt.price')}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Plus className="h-3 w-3 text-primary" />
                    {t('inspection.extras.carfax')}
                  </span>
                  <span className="text-muted-foreground font-medium">{t('inspection.extras.carfax.price')}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Formulario */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <ReportRequestForm onSuccess={handleSuccess} />
      </div>
    </div>
  );
};

export default RequestReport;
