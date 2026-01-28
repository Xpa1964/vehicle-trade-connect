
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import VehicleUploadForm from '@/components/vehicles/VehicleUploadForm';
import BulkVehicleUpload from '@/components/vehicles/BulkVehicleUpload';
import { ImageUploadTester } from '@/components/debug/ImageUploadTester';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowLeft, Upload, Car, TestTube } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const VehicleManagement: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("individual");

  if (!user) {
    return <div className="text-foreground">{t('auth.loginRequired')}</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary overflow-x-hidden">
      {/* Hero Section with Background Image - Optimized for mobile */}
      <div className="relative overflow-hidden rounded-none sm:rounded-xl shadow-lg mx-0 sm:mx-4 mt-0 sm:mt-4">
        {/* Background usando imagen para mejor rendimiento */}
        <div className="absolute inset-0">
          <div 
            className="w-full h-full bg-cover bg-no-repeat"
            style={{ 
              minHeight: '280px',
              backgroundImage: `url('/lovable-uploads/b04a7a23-c825-4659-a1f2-a510fc3b863b.png')`,
              backgroundPosition: '20% center',
              backgroundSize: 'cover'
            }}
          />
        </div>
        
        {/* Content - Responsive layout */}
        <div className="relative z-10 p-4 sm:p-6 md:p-8" style={{ minHeight: '280px' }}>
          <div className="flex flex-col justify-between h-full">
            {/* Botón Volver - Always at top */}
            <div className="mb-4">
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 w-fit" 
                onClick={() => navigate('/dashboard')}
              >
                <ArrowLeft className="h-4 w-4 mr-2 text-white" />
                {t('navigation.backToControlPanel')}
              </Button>
            </div>
            
            {/* Title and description - Responsive and properly spaced */}
            <div className="flex-1 flex flex-col justify-end space-y-3">
              {/* Logo + Title with proper mobile handling */}
              <div className="w-full">
                <div className="bg-black/20 backdrop-blur-sm rounded-lg p-3 sm:p-4 border border-white/10 inline-block max-w-full">
                  <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight break-words">
                    {t('vehicles.management')}
                  </h1>
                </div>
              </div>
              
              {/* Description with mobile optimization */}
              <div className="w-full">
                <div className="bg-black/20 backdrop-blur-sm rounded-lg p-3 sm:p-4 border border-white/10 inline-block max-w-full">
                  <p className="text-sm sm:text-base md:text-lg text-white font-medium leading-relaxed break-words">
                    {t('vehicles.managementDescription')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Improved mobile spacing */}
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6 md:py-8">
        <div className="bg-card rounded-lg shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 border border-border">
          <div className="flex justify-end items-center mb-4 sm:mb-6">
            <Button 
              variant="outline"
              onClick={() => navigate('/my-vehicles')}
              className="flex items-center text-sm sm:text-base touch-manipulation min-h-[44px]"
            >
              <Car className="h-4 w-4 mr-2" />
              {t('vehicles.myVehicles')}
            </Button>
          </div>

          <Tabs defaultValue="individual" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 mb-4 sm:mb-6">
              <TabsTrigger value="individual" className="text-xs sm:text-sm touch-manipulation min-h-[44px]">
                {t('vehicles.individualUpload')}
              </TabsTrigger>
              <TabsTrigger value="bulk" className="text-xs sm:text-sm touch-manipulation min-h-[44px]">
                {t('vehicles.bulkUpload')}
              </TabsTrigger>
              <TabsTrigger value="debug" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm touch-manipulation min-h-[44px]">
                <TestTube className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Debug Imágenes</span>
                <span className="sm:hidden">Debug</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="individual" className="py-4 sm:py-6">
              <VehicleUploadForm />
            </TabsContent>
            
            <TabsContent value="bulk" className="py-4 sm:py-6">
              <BulkVehicleUpload />
            </TabsContent>
            
            <TabsContent value="debug" className="py-4 sm:py-6">
              <div className="space-y-4">
                <div className="bg-warning/10 border border-warning/30 rounded-lg p-3 sm:p-4">
                  <h3 className="font-medium text-amber-400 mb-2 text-sm sm:text-base">🧪 Herramienta de Debug</h3>
                  <p className="text-xs sm:text-sm text-amber-300 leading-relaxed">
                    Esta herramienta te permite probar la subida de imágenes al proyecto y verificar que funciona correctamente.
                  </p>
                </div>
                <ImageUploadTester />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default VehicleManagement;
