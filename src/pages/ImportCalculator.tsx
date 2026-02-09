
import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import ImportCalculatorComponent from '@/components/import-calculator/ImportCalculator';
import BackButton from '@/components/shared/BackButton';
import SafeImage from '@/components/shared/SafeImage';

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
            <SafeImage 
              imageId="hero.import.calculator"
              alt="Import Calculator Background"
              className="w-full h-full object-cover object-center"
              style={{ minHeight: '320px' }}
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
