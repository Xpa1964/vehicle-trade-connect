import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Briefcase, Search, Car, Wrench, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useStaticImage } from '@/hooks/useStaticImage';

const BulletinInfoPage: React.FC = () => {
  // Use registry-based image that updates from Storage
  const { src: bulletinHeroSrc, objectPosition } = useStaticImage('hero.bulletin');
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="relative overflow-hidden rounded-xl shadow-lg mb-6">
        <div className="absolute inset-0">
          <img 
            src={bulletinHeroSrc}
            alt="Bulletin Board Background"
            className="w-full h-full object-cover"
            style={{ objectPosition }}
            loading="lazy"
            decoding="async"
          />
        </div>
        
        <div className="relative z-10 p-8" style={{ minHeight: '320px' }}>
          <div className="flex flex-col md:flex-row justify-between items-start gap-6 h-full">
            <div className="flex flex-col justify-end flex-1 h-full">
              <div className="mb-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => navigate('/')}
                  className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  {t('navigation.back')}
                </Button>
              </div>
              
              <div className="space-y-3">
                <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                  {t('bulletinInfo.title')}
                </h1>
                <p className="text-lg text-white font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                  {t('bulletinInfo.subtitle')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 mb-12">
        <p className="max-w-3xl mx-auto text-foreground">
          {t('bulletinInfo.description')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <Card className="p-4 hover:shadow-lg transition-shadow">
          <CardContent className="p-6 flex flex-col items-center">
            <Briefcase className="h-12 w-12 text-blue-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">{t('bulletinInfo.examples.business.title')}</h3>
            <p className="text-center text-muted-foreground">{t('bulletin.business_opportunities_desc')}</p>
          </CardContent>
        </Card>

        <Card className="p-4 hover:shadow-lg transition-shadow">
          <CardContent className="p-6 flex flex-col items-center">
            <Search className="h-12 w-12 text-green-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">{t('bulletinInfo.examples.search.title')}</h3>
            <p className="text-center text-muted-foreground">{t('bulletin.vehicle_search_desc')}</p>
          </CardContent>
        </Card>

        <Card className="p-4 hover:shadow-lg transition-shadow">
          <CardContent className="p-6 flex flex-col items-center">
            <Car className="h-12 w-12 text-red-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">{t('bulletinInfo.examples.vehicles.title')}</h3>
            <p className="text-center text-muted-foreground">{t('bulletin.available_vehicles_desc')}</p>
          </CardContent>
        </Card>

        <Card className="p-4 hover:shadow-lg transition-shadow">
          <CardContent className="p-6 flex flex-col items-center">
            <Wrench className="h-12 w-12 text-purple-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">{t('bulletinInfo.examples.services.title')}</h3>
            <p className="text-center text-muted-foreground">{t('bulletin.professional_services_desc')}</p>
          </CardContent>
        </Card>
      </div>

      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {t('bulletinInfo.examples.title')}
        </h2>

        <Tabs defaultValue="business">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 mb-8 h-auto gap-1">
            <TabsTrigger value="business" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              {t('bulletinInfo.examples.business.title')}
            </TabsTrigger>
            <TabsTrigger value="search" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              {t('bulletinInfo.examples.search.title')}
            </TabsTrigger>
            <TabsTrigger value="vehicles" className="flex items-center gap-2">
              <Car className="h-4 w-4" />
              {t('bulletinInfo.examples.vehicles.title')}
            </TabsTrigger>
            <TabsTrigger value="services" className="flex items-center gap-2">
              <Wrench className="h-4 w-4" />
              {t('bulletinInfo.examples.services.title')}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="business">
            <Card>
              <CardContent className="p-6">
                <p className="text-foreground italic">
                  "{t('bulletinInfo.examples.business.content')}"
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="search">
            <Card>
              <CardContent className="p-6">
                <p className="text-foreground italic">
                  "{t('bulletinInfo.examples.search.content')}"
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="vehicles">
            <Card>
              <CardContent className="p-6">
                <p className="text-foreground italic">
                  "{t('bulletinInfo.examples.vehicles.content')}"
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="services">
            <Card>
              <CardContent className="p-6">
                <p className="text-foreground italic">
                  "{t('bulletinInfo.examples.services.content')}"
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default BulletinInfoPage;
