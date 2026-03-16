import React, { useState } from 'react';
import { UseFormReturn, useWatch } from 'react-hook-form';
import { VehicleFormData } from '@/types/vehicle';
import { useLanguage } from '@/contexts/LanguageContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Sparkles, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { decodeVinAsync, isValidVin } from '@/utils/vinDecoder';
import { countries, getCountryCodeByName, getCountryNameByCode } from '@/utils/countryUtils';

interface Step1VinIdentificationProps {
  form: UseFormReturn<VehicleFormData>;
  onChange: (field: string, value: string | number) => void;
  onBrandChange: (brand: string) => string[];
  availableModels?: string[];
  isLoadingModels?: boolean;
  modelsError?: boolean;
}

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

const normalizeModelName = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^A-Z0-9]/gi, '')
    .toUpperCase();

const FUEL_VALUE_MAP: Record<string, string> = {
  gasolina: 'gasolina',
  gasoline: 'gasolina',
  petrol: 'gasolina',
  diesel: 'diesel',
  gasoil: 'diesel',
  electrico: 'electrico',
  eléctrico: 'electrico',
  electric: 'electrico',
  hybrid: 'hibrido',
  hibrido: 'hibrido',
  híbrido: 'hibrido',
  'mild hybrid': 'hibrido',
  'full hybrid': 'hibrido',
  'plug-in hybrid': 'hibrido_enchufable',
  'plug in hybrid': 'hibrido_enchufable',
  phev: 'hibrido_enchufable',
  hibrido_enchufable: 'hibrido_enchufable',
  'híbrido enchufable': 'hibrido_enchufable',
  'compressed natural gas (cng)': 'gas_natural',
  cng: 'gas_natural',
  gas: 'gas_natural',
  gas_natural: 'gas_natural',
  lpg: 'glp',
  glp: 'glp',
  autogas: 'glp',
  hydrogen: 'hidrogeno',
  hidrogeno: 'hidrogeno',
  hidrógeno: 'hidrogeno',
};

const normalizeFuelValue = (fuel: string | null | undefined) => {
  if (!fuel) return '';
  return FUEL_VALUE_MAP[fuel.trim().toLowerCase()] || '';
};

export const Step1VinIdentification: React.FC<Step1VinIdentificationProps> = ({
  form,
  onBrandChange,
  availableModels = [],
  isLoadingModels = false,
  modelsError = false,
}) => {
  const { t } = useLanguage();
  const [vinStatus, setVinStatus] = useState<'idle' | 'decoded' | 'not-found' | 'loading'>('idle');
  const [decodedFields, setDecodedFields] = useState<string[]>([]);
  const formData = (useWatch({ control: form.control }) || {}) as VehicleFormData;

  const setFieldValue = <K extends keyof VehicleFormData>(field: K, value: VehicleFormData[K]) => {
    form.setValue(field, value as VehicleFormData[K], {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const handleVinChange = async (rawVin: string) => {
    const vin = rawVin.toUpperCase().replace(/[^A-HJ-NPR-Z0-9]/gi, '');
    setFieldValue('vin', vin);

    if (!(vin.length === 17 && isValidVin(vin))) {
      setVinStatus('idle');
      setDecodedFields([]);
      return;
    }

    setVinStatus('loading');

    try {
      const decoded = await decodeVinAsync(vin);
      const filled: string[] = [];
      let brandModels = availableModels;

      if (decoded.brand) {
        setFieldValue('brand', decoded.brand);
        brandModels = onBrandChange(decoded.brand);
        filled.push('brand');
      }

      if (decoded.model) {
        const normalizedDecodedModel = normalizeModelName(decoded.model);
        const matchedModel = brandModels.find((model) => {
          const normalizedModel = normalizeModelName(model);
          return (
            normalizedModel === normalizedDecodedModel ||
            normalizedModel.includes(normalizedDecodedModel) ||
            normalizedDecodedModel.includes(normalizedModel)
          );
        });

        setFieldValue('model', matchedModel || decoded.model.toUpperCase());
        filled.push('model');
      }

      if (decoded.year) {
        setFieldValue('year', decoded.year);
        filled.push('year');
      }

      const normalizedFuel = normalizeFuelValue(decoded.fuel);
      if (normalizedFuel) {
        setFieldValue('fuel', normalizedFuel);
        filled.push('fuel');
      }

      if (decoded.engineSize) {
        setFieldValue('engineSize', decoded.engineSize);
        filled.push('engineSize');
      }

      if (decoded.enginePower) {
        setFieldValue('enginePower', decoded.enginePower);
        filled.push('enginePower');
      }

      if (decoded.doors) {
        setFieldValue('doors', decoded.doors);
        filled.push('doors');
      }

      if (decoded.country && decoded.country !== 'Europa') {
        const countryCode = getCountryCodeByName(decoded.country);
        if (countryCode) {
          setFieldValue('countryCode', countryCode);
          setFieldValue('country', getCountryNameByCode(countryCode));
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
    } catch (error) {
      console.error('[Step1VinIdentification] VIN decode error:', error);
      setVinStatus('not-found');
      setDecodedFields([]);
    }
  };

  const handleBrandChange = (value: string) => {
    const upper = value.toUpperCase();
    setFieldValue('brand', upper);
    setFieldValue('model', '');
    onBrandChange(upper);
  };

  const handleCountryChange = (countryCode: string) => {
    const selectedCountry = countries.find((country) => country.code === countryCode);
    setFieldValue('countryCode', countryCode);
    setFieldValue('country', selectedCountry?.name || '');
  };

  const selectedCountryCode = formData.countryCode || (formData.country ? getCountryCodeByName(formData.country) : '');

  return (
    <div className="space-y-6">
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
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                {vinStatus === 'loading' && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
                <Badge
                  variant={
                    vinStatus === 'decoded' ? 'default' :
                    vinStatus === 'not-found' ? 'secondary' : 'outline'
                  }
                  className="text-xs"
                >
                  {(formData.vin || '').length}/17
                </Badge>
              </div>
            </div>

            {vinStatus === 'decoded' && (
              <div className="flex items-center gap-2 text-sm text-primary bg-primary/10 p-3 rounded-lg">
                <Sparkles className="h-4 w-4" />
                <span>
                  {t('vehicles.vinDecoded', { fallback: '¡VIN reconocido!' })}{' '}
                  {decodedFields.map((field) => t(`vehicles.${field}`, { fallback: field })).join(', ')}{' '}
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>{t('vehicles.licensePlate')}</Label>
          <Input
            value={formData.licensePlate || ''}
            onChange={(e) => setFieldValue('licensePlate', e.target.value.toUpperCase())}
            placeholder={t('vehicles.licensePlatePlaceholder', { fallback: '1234 ABC' })}
            className="uppercase"
          />
        </div>
        <div className="space-y-2">
          <Label>{t('vehicles.vehicleType')}</Label>
          <Select
            value={formData.vehicleType || ''}
            onValueChange={(value) => setFieldValue('vehicleType', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder={t('vehicles.vehicleTypePlaceholder')} />
            </SelectTrigger>
            <SelectContent>
              {['sedan', 'hatchback', 'suv', 'wagon', 'coupe', 'convertible', 'minivan', 'pickup', 'van', 'truck', 'motorcycle', 'other'].map((type) => (
                <SelectItem key={type} value={type}>
                  {t(`vehicles.${type}`, { fallback: type })}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            {t('vehicles.brand')} *
            {decodedFields.includes('brand') && <CheckCircle2 className="h-4 w-4 text-primary" />}
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
              value={availableModels.includes(formData.model || '') ? (formData.model || '') : '__other__'}
              onValueChange={(value) => setFieldValue('model', value === '__other__' ? '' : value)}
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
          ) : null}

          {(availableModels.length === 0 || modelsError || !availableModels.includes(formData.model || '')) && (
            <Input
              className={availableModels.length > 0 && !modelsError ? 'mt-2' : ''}
              value={formData.model || ''}
              onChange={(e) => setFieldValue('model', e.target.value.toUpperCase())}
              placeholder={modelsError
                ? t('vehicles.modelManualEntry', { fallback: 'Escribe el modelo manualmente' })
                : t('vehicles.modelExample', { fallback: 'Escribe el modelo' })}
              disabled={isLoadingModels}
            />
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label>{t('vehicles.version')}</Label>
        <Input
          value={formData.version || ''}
          onChange={(e) => setFieldValue('version', e.target.value)}
          placeholder={t('vehicles.versionPlaceholder')}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            {t('vehicles.year')} *
            {decodedFields.includes('year') && <CheckCircle2 className="h-4 w-4 text-primary" />}
          </Label>
          <Select
            value={formData.year?.toString() || ''}
            onValueChange={(value) => setFieldValue('year', parseInt(value, 10))}
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
            onValueChange={(value) => setFieldValue('fuel', value)}
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
            onValueChange={(value) => setFieldValue('transmission', value)}
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>{t('vehicles.country')} *</Label>
          <Select value={selectedCountryCode || ''} onValueChange={handleCountryChange}>
            <SelectTrigger>
              <SelectValue placeholder={t('vehicles.selectCountry')} />
            </SelectTrigger>
            <SelectContent className="max-h-60">
              {countries.map((country) => (
                <SelectItem key={country.code} value={country.code}>{country.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>{t('vehicles.city', { fallback: 'Ciudad' })}</Label>
          <Input
            value={formData.location || ''}
            onChange={(e) => setFieldValue('location', e.target.value)}
            placeholder={t('vehicles.cityExample', { fallback: 'Ciudad (opcional)' })}
          />
        </div>
      </div>
    </div>
  );
};