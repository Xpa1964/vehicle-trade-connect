import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calculator, ExternalLink, AlertTriangle } from 'lucide-react';
import { useImportCalculator } from '@/components/import-calculator/useImportCalculator';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import type { Vehicle } from '@/types/vehicle';

interface ImportCalculatorWidgetProps {
  vehicle: Vehicle;
}

export const ImportCalculatorWidget: React.FC<ImportCalculatorWidgetProps> = ({ vehicle }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  const {
    price,
    setPrice,
    originCountry,
    setOriginCountry,
    vehicleType,
    setVehicleType,
    co2Emissions,
    setCo2Emissions,
    includesVAT,
    setIncludesVAT,
    results,
    printCalculation
  } = useImportCalculator();

  // Función para mapear country_code a nombre completo del país
  const mapCountryCodeToName = (countryCode: string): string => {
    const countryMap: Record<string, string> = {
      'pt': 'Portugal',
      'de': 'Germany', 
      'fr': 'France',
      'it': 'Italy',
      'nl': 'Netherlands',
      'be': 'Belgium',
      'at': 'Austria',
      'ch': 'Switzerland',
      'uk': 'United Kingdom',
      'gb': 'United Kingdom'
    };
    return countryMap[countryCode?.toLowerCase()] || countryCode || 'Unknown';
  };

  // Función para estimar CO2 basado en combustible y año
  const estimateCO2Emissions = (fuel: string, year: number, vehicleType: string): number => {
    if (fuel?.toLowerCase().includes('electric') || vehicleType?.toLowerCase().includes('electric')) {
      return 0;
    }
    
    // Estimaciones basadas en combustible y año del vehículo
    const fuelType = fuel?.toLowerCase() || '';
    const baseYear = 2020;
    const yearFactor = Math.max(0, (baseYear - year) * 5); // Vehículos más antiguos tienden a tener más emisiones
    
    if (fuelType.includes('diesel')) {
      return Math.min(200, 110 + yearFactor); // Diesel: 110-200 g/km
    } else if (fuelType.includes('gasoline') || fuelType.includes('petrol')) {
      return Math.min(180, 120 + yearFactor); // Gasolina: 120-180 g/km
    } else if (fuelType.includes('hybrid')) {
      return Math.min(120, 80 + yearFactor); // Híbrido: 80-120 g/km
    }
    
    return 130; // Valor por defecto
  };

  // Auto-poblar los datos del vehículo cuando el componente se monta
  useEffect(() => {
    if (vehicle.price) setPrice(vehicle.price);
    
    // Mapear country_code a nombre completo
    const countryName = mapCountryCodeToName(vehicle.country_code || vehicle.country || '');
    setOriginCountry(countryName);
    
    // Mapear tipo de vehículo
    if (vehicle.type) setVehicleType(vehicle.type);
    
    // Estimar CO2 basado en datos del vehículo
    const estimatedCo2 = estimateCO2Emissions(vehicle.fuel || '', vehicle.year, vehicle.type);
    setCo2Emissions(estimatedCo2);
    
    // Determinar estado IVA - asumimos que vehículos usados no incluyen IVA
    const hasVAT = vehicle.condition === 'new' || vehicle.condition === 'nearly_new';
    setIncludesVAT(hasVAT);
  }, [vehicle, setPrice, setOriginCountry, setVehicleType, setCo2Emissions, setIncludesVAT]);

  const handleOpenFullCalculator = () => {
    navigate('/import-calculator');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Card className="mt-4 border-orange-200 bg-orange-50/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            <CardTitle className="text-lg text-orange-900">
              Calculadora de Importación
            </CardTitle>
          </div>
          <Badge variant="outline" className="border-orange-300 text-orange-700">
            Importación requerida
          </Badge>
        </div>
        <p className="text-sm text-orange-700">
          Este vehículo requiere importación. Aquí tienes el cálculo automático de los costes:
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Información del vehículo */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-600">Origen:</span>
            <span className="ml-2 text-gray-900">{originCountry}</span>
          </div>
          <div>
            <span className="font-medium text-gray-600">Precio base:</span>
            <span className="ml-2 text-gray-900">{formatPrice(price)}</span>
          </div>
        </div>
        
        {/* Datos estimados */}
        <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
          <div>
            <span>CO2 estimado: {co2Emissions} g/km</span>
          </div>
          <div>
            <span>{includesVAT ? 'Incluye IVA' : 'Sin IVA'}</span>
          </div>
        </div>
        
        {/* Resultados del cálculo */}
        <div className="border-t pt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">IVA:</span>
            <span className="font-medium">{formatPrice(results.vatCost)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Impuesto de matriculación:</span>
            <span className="font-medium">{formatPrice(results.matriculationTax)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Costes administrativos:</span>
            <span className="font-medium">{formatPrice(results.adminCosts)}</span>
          </div>
          <hr className="my-2" />
          <div className="flex justify-between font-bold text-lg">
            <span className="text-gray-900">Coste total:</span>
            <span className="text-orange-700">{formatPrice(results.totalCost)}</span>
          </div>
        </div>
        
        {/* Botones de acción */}
        <div className="flex gap-2 pt-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleOpenFullCalculator}
            className="flex-1"
          >
            <Calculator className="h-4 w-4 mr-2" />
            Cálculo detallado
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={printCalculation}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Imprimir
          </Button>
        </div>
        
        <p className="text-xs text-gray-500 mt-2">
          Los cálculos son estimativos. Consulte con un profesional para obtener cifras exactas.
        </p>
      </CardContent>
    </Card>
  );
};