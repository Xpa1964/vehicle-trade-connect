
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { countries } from '@/utils/countryUtils';

interface BasicDetailsProps {
  formData: any;
  onChange: (field: string, value: string | number) => void;
  onBrandChange: (value: string) => void;
  availableModels: string[];
}

// Lista de marcas de vehículos más comunes (incluye TESLA)
const VEHICLE_BRANDS = [
  'AUDI', 'BMW', 'MERCEDES-BENZ', 'VOLKSWAGEN', 'FORD', 'RENAULT', 'PEUGEOT', 'CITROEN',
  'OPEL', 'SEAT', 'TOYOTA', 'NISSAN', 'HONDA', 'HYUNDAI', 'KIA', 'MAZDA', 'MITSUBISHI',
  'SUBARU', 'VOLVO', 'JAGUAR', 'LAND ROVER', 'PORSCHE', 'FERRARI', 'LAMBORGHINI', 'MASERATI',
  'ALFA ROMEO', 'FIAT', 'LANCIA', 'SKODA', 'DACIA', 'SUZUKI', 'ISUZU', 'JEEP', 'CHEVROLET',
  'CADILLAC', 'BUICK', 'GMC', 'CHRYSLER', 'DODGE', 'LINCOLN', 'ACURA', 'INFINITI', 'LEXUS',
  'TESLA'
].sort();

// Opciones de combustible - ahora se traducirán dinámicamente

// Generar años desde 2000 hasta el año actual + 1
const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: (currentYear + 1) - 2000 + 1 }, (_, i) => currentYear + 1 - i);

const BasicDetails: React.FC<BasicDetailsProps> = ({
  formData,
  onChange,
  onBrandChange,
  availableModels
}) => {
  const { t } = useLanguage();
  
  // Opciones de combustible traducidas
  const FUEL_OPTIONS = [
    { value: 'gasolina', label: t('vehicles.fuelGasoline') },
    { value: 'diesel', label: t('vehicles.fuelDiesel') },
    { value: 'electrico', label: t('vehicles.fuelElectric') },
    { value: 'hibrido', label: t('vehicles.fuelHybrid') },
    { value: 'hibrido_enchufable', label: t('vehicles.fuelPluginHybrid') },
    { value: 'gas_natural', label: t('vehicles.fuelNaturalGas') },
    { value: 'glp', label: t('vehicles.fuelLPG') },
    { value: 'hidrogeno', label: t('vehicles.fuelHydrogen') },
    { value: 'etanol', label: t('vehicles.fuelEthanol') },
    { value: 'biodiesel', label: t('vehicles.fuelBiodiesel') }
  ];

  const handleBrandChange = (value: string) => {
    const upperCaseBrand = value.toUpperCase();
    onBrandChange(upperCaseBrand);
    onChange('brand', upperCaseBrand);
  };

  const handleModelChange = (value: string) => {
    const upperCaseModel = value.toUpperCase();
    onChange('model', upperCaseModel);
  };

  const handleCountryChange = (countryName: string) => {
    const selectedCountry = countries.find(c => c.name === countryName);
    if (selectedCountry) {
      onChange('country', countryName);
      onChange('countryCode', selectedCountry.code);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-bold text-lg">{t('vehicles.basicDetails')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="brand">{t('vehicles.brand')} *</Label>
            <Select 
              value={formData.brand || ''} 
              onValueChange={handleBrandChange}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('vehicles.selectBrand')} />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {VEHICLE_BRANDS.map((brand) => (
                  <SelectItem key={brand} value={brand}>
                    {brand}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="model">{t('vehicles.model')} *</Label>
            <Input
              id="model"
              value={formData.model || ''}
              onChange={(e) => handleModelChange(e.target.value)}
              placeholder={t('vehicles.modelExample')}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="version">{t('vehicles.version')}</Label>
            <Input
              id="version"
              value={formData.version || ''}
              onChange={(e) => onChange('version', e.target.value)}
              placeholder={t('vehicles.versionPlaceholder')}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="year">{t('vehicles.year')} *</Label>
            <Select 
              value={formData.year?.toString() || ''} 
              onValueChange={(value) => onChange('year', parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('vehicles.selectYear')} />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {YEARS.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="mileage">{t('vehicles.mileage')} *</Label>
            <Input
              id="mileage"
              type="number"
              value={formData.mileage || ''}
              onChange={(e) => onChange('mileage', parseInt(e.target.value) || 0)}
              placeholder="50000"
              min="0"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">{t('vehicles.price')} (€) *</Label>
            <Input
              id="price"
              type="number"
              value={formData.price || ''}
              onChange={(e) => onChange('price', parseFloat(e.target.value) || 0)}
              placeholder="25000"
              min="0"
              step="0.01"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fuel">{t('vehicles.fuel')} *</Label>
            <Select 
              value={formData.fuel || ''} 
              onValueChange={(value) => onChange('fuel', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('vehicles.selectFuel')} />
              </SelectTrigger>
              <SelectContent className="max-h-60 z-50" side="top">
                {FUEL_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="country">{t('vehicles.country')} *</Label>
            <Select 
              value={formData.country || ''} 
              onValueChange={handleCountryChange}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('vehicles.selectCountry')} />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {countries.map((country) => (
                  <SelectItem key={country.code} value={country.name}>
                    {country.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">{t('vehicles.city')} *</Label>
          <Input
            id="location"
            value={formData.location || ''}
            onChange={(e) => onChange('location', e.target.value)}
            placeholder={t('vehicles.cityExample')}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">{t('vehicles.description')}</Label>
          <Textarea
            id="description"
            value={formData.description || ''}
            onChange={(e) => onChange('description', e.target.value)}
            placeholder={t('vehicles.additionalDescriptionPlaceholder')}
            rows={4}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default BasicDetails;
