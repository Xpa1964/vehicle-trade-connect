
import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import ImportCalculatorComponent from '@/components/import-calculator/ImportCalculator';
import BackButton from '@/components/shared/BackButton';

const ImportCalculator: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Extraer información del vehículo de los parámetros URL
  const fromVehicleId = searchParams.get('from_vehicle');
  const vehicleInfo = searchParams.get('vehicle_info');

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header con imagen de fondo SIN máscara */}
        <div className="relative overflow-hidden rounded-xl shadow-lg mb-6">
          <div className="absolute inset-0">
            <img 
              src="/lovable-uploads/ba9a7ade-a335-4687-9895-ed163a824df5.png"
              alt="Import Calculator Background"
              className="w-full h-full object-cover object-center"
              style={{ minHeight: '320px' }}
              onError={(e) => {
                console.log('Error loading import calculator background image, using gradient fallback');
                e.currentTarget.style.display = 'none';
                const parent = e.currentTarget.parentElement;
                if (parent) {
                  parent.style.background = 'linear-gradient(135deg, #0f766e 0%, #0d9488 50%, #14b8a6 100%)';
                }
              }}
              onLoad={() => {
                console.log('Import calculator background image loaded successfully');
              }}
            />
          </div>
          
          <div className="relative z-10 p-8" style={{ minHeight: '320px' }}>
            <div className="flex flex-col md:flex-row justify-between items-start gap-6 h-full">
              <div className="flex flex-col justify-end flex-1 h-full">
                <div className="mb-4">
                  <BackButton 
                    to={fromVehicleId ? `/vehicle-preview/${fromVehicleId}` : '/'}
                    label={fromVehicleId && vehicleInfo ? `${t('navigation.back')} a ${decodeURIComponent(vehicleInfo)}` : t('navigation.back')}
                    variant="outline"
                    size="sm"
                    className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
                  />
                </div>
                
                <div className="mb-4">
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                    <span className="font-bold">{t('calculator.title')}</span>
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contenedor de la calculadora */}
        <div className="bg-card rounded-lg shadow-lg border border-border">
          <ImportCalculatorComponent />
        </div>
      </div>
    </div>
  );
};

export default ImportCalculator;
