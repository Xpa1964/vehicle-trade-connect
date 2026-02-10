import * as React from 'react';
const { memo } = React;
import { useNavigate } from 'react-router-dom';
import { Car, Database } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BackButton from '@/components/shared/BackButton';
import VehicleGalleryHero from '@/components/vehicles/VehicleGalleryHero';
import VehicleGalleryContent from '@/components/vehicles/VehicleGalleryContent';
import VehicleGalleryDebug from '@/components/vehicles/VehicleGalleryDebug';
import CreateSampleVehicles from '@/components/vehicles/CreateSampleVehicles';
import { useVehicleGallery } from '@/hooks/useVehicleGallery';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

const VehicleGallery: React.FC = memo(() => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const vehicleGalleryData = useVehicleGallery();

  const handleBack = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/');
    }
  };

  // Para usuarios no autenticados, solo mostrar la galería sin tabs de diagnóstico
  if (!isAuthenticated) {
    return (
      <div className="space-y-4">
        <div className="mb-4">
          <BackButton to="/" label="Inicio" />
        </div>

        <VehicleGalleryHero />

        <VehicleGalleryContent {...vehicleGalleryData} isPublicView={true} />
      </div>
    );
  }

  // Para usuarios autenticados, mostrar la funcionalidad completa
  return (
    <div className="space-y-4">
      <div className="mb-4">
        <BackButton to="/dashboard" label="Panel de Control" />
      </div>

      <VehicleGalleryHero />

      <Tabs defaultValue="gallery" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="gallery" className="flex items-center gap-2">
            <Car className="h-4 w-4" />
            {t('vehicles.galleryTab')}
          </TabsTrigger>
          <TabsTrigger value="debug" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            {t('vehicles.diagnosticTab')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="gallery" className="space-y-4">
          <VehicleGalleryContent {...vehicleGalleryData} />
        </TabsContent>

        <TabsContent value="debug" className="space-y-6">
          <VehicleGalleryDebug />
          <CreateSampleVehicles />
        </TabsContent>
      </Tabs>
    </div>
  );
});

VehicleGallery.displayName = 'VehicleGallery';

export default VehicleGallery;
