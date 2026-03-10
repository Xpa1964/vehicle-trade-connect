import React, { useState, useCallback } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { VehicleFormData } from '@/types/vehicle';
import { useLanguage } from '@/contexts/LanguageContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Sparkles, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { decodeVin, isValidVin } from '@/utils/vinDecoder';
import { countries } from '@/utils/countryUtils';

interface Step1VinIdentificationProps {
  form: UseFormReturn<VehicleFormData>;
  onChange: (field: string, value: string | number) => void;
  onBrandChange: (brand: string) => void;
  availableModels?: string[];
  isLoadingModels?: boolean;
  modelsError?: boolean;
}

// Vehicle brands list
const VEHICLE_BRANDS = [
  'AUDI', 'BMW', 'MERCEDES-BENZ', 'VOLKSWAGEN', 'FORD', 'RENAULT', 'PEUGEOT', 'CITROEN',
  'OPEL', 'SEAT', 'TOYOTA', 'NISSAN', 'HONDA', 'HYUNDAI', 'KIA', 'MAZDA', 'MITSUBISHI',
  'SUBARU', 'VOLVO', 'JAGUAR', 'LAND ROVER', 'PORSCHE', 'FERRARI', 'LAMBORGHINI', 'MASERATI',
  'ALFA ROMEO', 'FIAT', 'LANCIA', 'SKODA', 'DACIA', 'SUZUKI', 'ISUZU', 'JEEP', 'CHEVROLET',
  'CADILLAC', 'BUICK', 'GMC', 'CHRYSLER', 'DODGE', 'LINCOLN', 'ACURA', 'INFINITI', 'LEXUS',
  'TESLA'
].sort();

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: (currentYear + 1) - 1900 + 1 }, (_, i) => currentYear + 1 - i);

export const Step1VinIdentification: React.FC<Step1VinIdentificationProps> = ({
  form,
  onChange,
  onBrandChange,
  availableModels = [],
  isLoadingModels = false,
  modelsError = false,
}) => {
  const { t } = useLanguage();
  const [vinStatus, setVinStatus] = useState<'idle' | 'decoded' | 'not-found'>('idle');
  const [decodedFields, setDecodedFields] = useState<string[]>([]);

  const handleVinChange = useCallback((rawVin: string) => {
    const vin = rawVin.toUpperCase().replace(/[^A-HJ-NPR-Z0-9]/gi, '');
    onChange('vin', vin);

    if (vin.length === 17 && isValidVin(vin)) {
      const decoded = decodeVin(vin);
      const filled: string[] = [];

      if (decoded.brand) {
        onChange('brand', decoded.brand);
        onBrandChange(decoded.brand);
        filled.push('brand');
      }
      if (decoded.year) {
        onChange('year', decoded.year);
        filled.push('year');
      }
      if (decoded.country) {
        const selectedCountry = countries.find(c => c.name === decoded.country);
        if (selectedCountry) {
          onChange('country', decoded.country);
          onChange('countryCode', selectedCountry.code);
          filled.push('country');
        }
      }

      if (filled.length > 0) {
        setVinStatus('decoded');
        setDecodedFields(filled);
      } else {
        setVinStatus('not-found');
        setDecodedFields([]);
      }
    } else {
      setVinStatus('idle');
      setDecodedFields([]);
    }
  }, [onChange, onBrandChange]);

  const handleBrandChange = (value: string) => {
    const upper = value.toUpperCase();
    onBrandChange(upper);
    onChange('brand', upper);
  };

  const handleCountryChange = (countryName: string) => {
    const selectedCountry = countries.find(c => c.name === countryName);
    if (selectedCountry) {
      onChange('country', countryName);
      onChange('countryCode', selectedCountry.code);
    }
  };

  const formData = form.getValues();

  return (
    <div className="space-y-6">
      {/* VIN Hero Input */}
      <Card className="border-2 border-primary/20 bg-primary/5">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Search className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">
                  {t('vehicles.vinAutoFill', { fallback: 'Autocompletado por VIN' })}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t('vehicles.vinAutoFillDesc', { fallback: 'Introduce el VIN de 17 caracteres para rellenar automáticamente los datos del vehículo' })}
                </p>
              </div>
            </div>

            <div className="relative">
              <Input
                value={formData.vin || ''}
                onChange={(e) => handleVinChange(e.target.value)}
                placeholder="WVWZZZ3CZWE123456"
                className="text-lg font-mono tracking-wider h-14 pr-24 uppercase bg-background"
                maxLength={17}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Badge variant={
                  vinStatus === 'decoded' ? 'default' :
                  vinStatus === 'not-found' ? 'secondary' : 'outline'
                } className="text-xs">
                  {(formData.vin || '').length}/17
                </Badge>
              </div>
            </div>

            {/* VIN Status Feedback */}
            {vinStatus === 'decoded' && (
              <div className="flex items-center gap-2 text-sm text-primary bg-primary/10 p-3 rounded-lg">
                <Sparkles className="h-4 w-4" />
                <span>
                  {t('vehicles.vinDecoded', { fallback: '¡VIN reconocido!' })}
                  {' '}
                  {decodedFields.map(f => t(`vehicles.${f}`, { fallback: f })).join(', ')}
                  {' '}
                  {t('vehicles.autoFilled', { fallback: 'autocompletados' })}
                </span>
              </div>
            )}
            {vinStatus === 'not-found' && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted p-3 rounded-lg">
                <AlertCircle className="h-4 w-4" />
                <span>
                  {t('vehicles.vinNotRecognized', { fallback: 'VIN no reconocido automáticamente. Puedes rellenar los campos manualmente.' })}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* License plate */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>{t('vehicles.licensePlate')}</Label>
          <Input
            value={formData.licensePlate || ''}
            onChange={(e) => onChange('licensePlate', e.target.value.toUpperCase())}
            placeholder={t('vehicles.licensePlatePlaceholder', { fallback: '1234 ABC' })}
            className="uppercase"
          />
        </div>
        <div className="space-y-2">
          <Label>{t('vehicles.vehicleType')}</Label>
          <Select
            value={formData.vehicleType || ''}
            onValueChange={(v) => onChange('vehicleType', v)}
          >
            <SelectTrigger>
              <SelectValue placeholder={t('vehicles.vehicleTypePlaceholder')} />
            </SelectTrigger>
            <SelectContent>
              {['sedan', 'hatchback', 'suv', 'wagon', 'coupe', 'convertible', 'minivan', 'pickup', 'van', 'truck', 'motorcycle', 'other'].map(type => (
                <SelectItem key={type} value={type}>
                  {t(`vehicles.${type}`, { fallback: type })}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Brand & Model */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            {t('vehicles.brand')} *
            {decodedFields.includes('brand') && (
              <CheckCircle2 className="h-4 w-4 text-primary" />
            )}
          </Label>
          <Select value={formData.brand || ''} onValueChange={handleBrandChange}>
            <SelectTrigger>
              <SelectValue placeholder={t('vehicles.selectBrand')} />
            </SelectTrigger>
            <SelectContent className="max-h-60">
              {VEHICLE_BRANDS.map((brand) => (
                <SelectItem key={brand} value={brand}>{brand}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            {t('vehicles.model')} *
            {isLoadingModels && <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />}
          </Label>
          {availableModels.length > 0 && !modelsError ? (
            <Select
              value={formData.model || ''}
              onValueChange={(v) => onChange('model', v)}
              disabled={isLoadingModels}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('vehicles.selectModel', { fallback: 'Seleccionar modelo' })} />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {availableModels.map((model) => (
                  <SelectItem key={model} value={model}>{model}</SelectItem>
                ))}
                <SelectItem value="__other__">{t('vehicles.otherModel', { fallback: 'Otro modelo...' })}</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <Input
              value={formData.model || ''}
              onChange={(e) => onChange('model', e.target.value.toUpperCase())}
              placeholder={modelsError 
                ? t('vehicles.modelManualEntry', { fallback: 'Escribe el modelo manualmente' })
                : t('vehicles.modelExample')}
              disabled={isLoadingModels}
            />
          )}
          {formData.model === '__other__' && (
            <Input
              className="mt-2"
              value=""
              onChange={(e) => onChange('model', e.target.value.toUpperCase())}
              placeholder={t('vehicles.modelManualEntry', { fallback: 'Escribe el modelo' })}
              autoFocus
            />
          )}
        </div>
      </div>

      {/* Version (optional) */}
      <div className="space-y-2">
        <Label>{t('vehicles.version')}</Label>
        <Input
          value={formData.version || ''}
          onChange={(e) => onChange('version', e.target.value)}
          placeholder={t('vehicles.versionPlaceholder')}
        />
      </div>

      {/* Year, Fuel, Transmission */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            {t('vehicles.year')} *
            {decodedFields.includes('year') && (
              <CheckCircle2 className="h-4 w-4 text-primary" />
            )}
          </Label>
          <Select
            value={formData.year?.toString() || ''}
            onValueChange={(v) => onChange('year', parseInt(v))}
          >
            <SelectTrigger>
              <SelectValue placeholder={t('vehicles.selectYear')} />
            </SelectTrigger>
            <SelectContent className="max-h-60">
              {YEARS.map((year) => (
                <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>{t('vehicles.fuel')} *</Label>
          <Select
            value={formData.fuel || ''}
            onValueChange={(v) => onChange('fuel', v)}
          >
            <SelectTrigger>
              <SelectValue placeholder={t('vehicles.selectFuel')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gasolina">{t('vehicles.fuelGasoline')}</SelectItem>
              <SelectItem value="diesel">{t('vehicles.fuelDiesel')}</SelectItem>
              <SelectItem value="electrico">{t('vehicles.fuelElectric')}</SelectItem>
              <SelectItem value="hibrido">{t('vehicles.fuelHybrid')}</SelectItem>
              <SelectItem value="hibrido_enchufable">{t('vehicles.fuelPluginHybrid')}</SelectItem>
              <SelectItem value="gas_natural">{t('vehicles.fuelNaturalGas')}</SelectItem>
              <SelectItem value="glp">{t('vehicles.fuelLPG')}</SelectItem>
              <SelectItem value="hidrogeno">{t('vehicles.fuelHydrogen')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>{t('vehicles.transmission')} *</Label>
          <Select
            value={formData.transmission || ''}
            onValueChange={(v) => onChange('transmission', v)}
          >
            <SelectTrigger>
              <SelectValue placeholder={t('vehicles.selectTransmission')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="manual">{t('vehicles.manual')}</SelectItem>
              <SelectItem value="automatic">{t('vehicles.automatic')}</SelectItem>
              <SelectItem value="semiautomatic">{t('vehicles.semiautomatic')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Location */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>{t('vehicles.country')} *</Label>
          <Select value={formData.country || ''} onValueChange={handleCountryChange}>
            <SelectTrigger>
              <SelectValue placeholder={t('vehicles.selectCountry')} />
            </SelectTrigger>
            <SelectContent className="max-h-60">
              {countries.map((country) => (
                <SelectItem key={country.code} value={country.name}>{country.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>{t('vehicles.city')} *</Label>
          <Input
            value={formData.location || ''}
            onChange={(e) => onChange('location', e.target.value)}
            placeholder={t('vehicles.cityExample')}
          />
        </div>
      </div>
    </div>
  );
};
