
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import TranslationStatus from '@/components/admin/TranslationStatus';
import { TranslationAuditResults } from '@/components/admin/TranslationAuditResults';
import { RatingTranslationStatus } from '@/components/admin/RatingTranslationStatus';
import { ChevronLeft, Download, RefreshCw } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const TranslationManagement: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulamos una actualización de datos
    setTimeout(() => {
      setIsRefreshing(false);
      toast({
        title: t('common.success'),
        description: t('control.translationsRefreshed', { fallback: 'Translation status refreshed successfully' }),
      });
    }, 1000);
  };

  const handleExportData = () => {
    // Esta función simula la exportación de los datos de traducción faltantes
    toast({
      title: t('common.success'),
      description: t('control.translationsExported', { fallback: 'Translation data has been exported successfully' }),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t('control.translationManagement')}</h1>
          <p className="text-muted-foreground mt-1">
            {t('control.translationDescription')}
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => navigate('/admin/control-panel')}
          className="gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          {t('common.back', { fallback: 'Back' })}
        </Button>
      </div>
      
      <Tabs defaultValue="rating" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-4">
          <TabsTrigger value="rating">{t('control.ratingSystem', { fallback: 'Rating System' })}</TabsTrigger>
          <TabsTrigger value="audit">{t('control.systemAudit', { fallback: 'System Audit' })}</TabsTrigger>
          <TabsTrigger value="overview">{t('control.overview', { fallback: 'Overview' })}</TabsTrigger>
          <TabsTrigger value="missing">{t('common.missingTranslations')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="rating" className="space-y-4">
          <RatingTranslationStatus />
        </TabsContent>
        
        <TabsContent value="audit" className="space-y-4">
          <TranslationAuditResults />
        </TabsContent>
        
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{t('control.translationStatus')}</CardTitle>
                  <CardDescription>
                    {t('control.translationStatusDescription')}
                  </CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                  {t('control.refresh', { fallback: 'Refresh' })}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <TranslationStatus />
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button 
                variant="outline" 
                onClick={handleExportData}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                {t('control.exportData', { fallback: 'Export Data' })}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="missing">
          <Card>
            <CardHeader>
              <CardTitle>{t('common.missingTranslations')}</CardTitle>
              <CardDescription>
                {t('control.missingTranslationsDescription', { 
                  fallback: 'Here you can see all missing translations across languages and manage them accordingly'
                })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TranslationStatus initialTab="all" showOnlyMissing={true} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TranslationManagement;
