
import React, { useState, useEffect } from 'react';
import { UseFormReturn, useWatch } from 'react-hook-form';
import { useLanguage } from '@/contexts/LanguageContext';
import { VehicleFormData } from '@/types/vehicle';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { CalendarIcon, Truck, Search, Sparkles, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, parse, isValid } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { decodeVinAsync, isValidVin } from '@/utils/vinDecoder';

interface VehicleIdentificationProps {
  form: UseFormReturn<VehicleFormData>;
}

// Vehicle type options
const vehicleTypes = [
  { value: 'sedan', label: 'vehicles.sedan' },
  { value: 'hatchback', label: 'vehicles.hatchback' },
  { value: 'suv', label: 'vehicles.suv' },
  { value: 'wagon', label: 'vehicles.wagon' },
  { value: 'coupe', label: 'vehicles.coupe' },
  { value: 'convertible', label: 'vehicles.convertible' },
  { value: 'minivan', label: 'vehicles.minivan' },
  { value: 'pickup', label: 'vehicles.pickup' },
  { value: 'van', label: 'vehicles.van' },
  { value: 'truck', label: 'vehicles.truck' },
  { value: 'motorcycle', label: 'vehicles.motorcycle' },
  { value: 'other', label: 'vehicles.other' }
];

const FUEL_VALUE_MAP: Record<string, string> = {
  gasolina: 'gasolina', gasoline: 'gasolina', petrol: 'gasolina',
  diesel: 'diesel', gasoil: 'diesel',
  electrico: 'electrico', electric: 'electrico',
  hybrid: 'hibrido', hibrido: 'hibrido',
  'plug-in hybrid': 'hibrido_enchufable', phev: 'hibrido_enchufable', hibrido_enchufable: 'hibrido_enchufable',
  'compressed natural gas (cng)': 'gas_natural', cng: 'gas_natural', gas_natural: 'gas_natural',
  lpg: 'glp', glp: 'glp',
  hydrogen: 'hidrogeno', hidrogeno: 'hidrogeno',
};

const normalizeFuelValue = (fuel: string | null | undefined) => {
  if (!fuel) return '';
  return FUEL_VALUE_MAP[fuel.trim().toLowerCase()] || '';
};

export const VehicleIdentification = ({ form }: VehicleIdentificationProps) => {
  const { t } = useLanguage();
  const [manualDate, setManualDate] = useState('');
  const [vinStatus, setVinStatus] = useState<'idle' | 'decoded' | 'not-found' | 'loading'>('idle');
  const [decodedFields, setDecodedFields] = useState<string[]>([]);

  // Watch the registrationDate field to sync with manual input
  const registrationDate = form.watch('registrationDate');

  useEffect(() => {
    if (registrationDate && !manualDate) {
      setManualDate(format(registrationDate, 'dd/MM/yyyy'));
    }
  }, [registrationDate, manualDate]);

  const handleManualDateChange = (value: string) => {
    setManualDate(value);
    
    // Validar formato DD/MM/YYYY
    const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const match = value.match(dateRegex);
    
    if (match) {
      const [, day, month, year] = match;
      const parsedDate = parse(`${day}/${month}/${year}`, 'dd/MM/yyyy', new Date());
      
      if (isValid(parsedDate)) {
        form.setValue('registrationDate', parsedDate);
      }
    } else if (value === '') {
      form.setValue('registrationDate', undefined);
    }
  };

  const setFieldValue = (field: keyof VehicleFormData, value: VehicleFormData[keyof VehicleFormData]) => {
    form.setValue(field as any, value as any, {
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

      if (decoded.brand) {
        setFieldValue('brand', decoded.brand);
        filled.push('brand');
      }

      if (decoded.model) {
        setFieldValue('model', decoded.model.toUpperCase());
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

      if (filled.length > 0) {
        setVinStatus('decoded');
        setDecodedFields(filled);
      } else {
        setVinStatus('not-found');
        setDecodedFields([]);
      }
    } catch (error) {
      console.error('[VehicleIdentification] VIN decode error:', error);
      setVinStatus('not-found');
      setDecodedFields([]);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-bold text-lg">
          <Truck className="h-5 w-5" />
          {t('vehicles.identification')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* VIN con decodificación automática */}
          <FormField
            control={form.control}
            name="vin"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-2">
                  <FormLabel>{t('vehicles.vin')}</FormLabel>
                  {vinStatus === 'loading' && (
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                  )}
                  {vinStatus === 'decoded' && (
                    <Badge variant="default" className="text-xs bg-primary/10 text-primary border-primary/20">
                      <Sparkles className="h-3 w-3 mr-1" />
                      {t('vehicles.vinDecoded', { fallback: '¡Reconocido!' })}
                    </Badge>
                  )}
                  {vinStatus === 'not-found' && (
                    <Badge variant="secondary" className="text-xs">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {t('vehicles.vinNotFound', { fallback: 'No reconocido' })}
                    </Badge>
                  )}
                </div>
                <FormControl>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder={t('vehicles.vinPlaceholder', { fallback: 'Introduce el VIN de 17 caracteres' })}
                      value={field.value || ''}
                      onChange={(e) => handleVinChange(e.target.value)}
                      className="pl-9 uppercase font-mono tracking-wider"
                      maxLength={17}
                    />
                  </div>
                </FormControl>
                {vinStatus === 'decoded' && decodedFields.length > 0 && (
                  <p className="text-xs text-primary mt-1">
                    {t('vehicles.autoFilled', { fallback: 'Autocompletados' })}: {decodedFields.map((f) => t(`vehicles.${f}`, { fallback: f })).join(', ')}
                  </p>
                )}
                {vinStatus === 'not-found' && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {t('vehicles.vinNotRecognized', { fallback: 'VIN no reconocido automáticamente. Puedes rellenar los campos manualmente.' })}
                  </p>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="licensePlate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('vehicles.licensePlate')}</FormLabel>
                <FormControl>
                  <Input 
                    placeholder={t('vehicles.licensePlatePlaceholder')} 
                    {...field} 
                    value={field.value || ''} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="registrationDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>{t('vehicles.registrationDate')}</FormLabel>
                
                <div className="flex gap-2">
                  {/* Entrada manual */}
                  <Input
                    placeholder={t('vehicles.dateFormat')}
                    value={manualDate}
                    onChange={(e) => handleManualDateChange(e.target.value)}
                    className="flex-1"
                  />

                  {/* Selector de calendario */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="shrink-0"
                      >
                        <CalendarIcon className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={(date) => {
                          field.onChange(date);
                          if (date) {
                            setManualDate(format(date, 'dd/MM/yyyy'));
                          }
                        }}
                        initialFocus
                        className="pointer-events-auto"
                        captionLayout="dropdown"
                        fromYear={1980}
                        toYear={new Date().getFullYear()}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="vehicleType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('vehicles.vehicleType')}</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  value={field.value || ''}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t('vehicles.vehicleTypePlaceholder')} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {vehicleTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {t(type.label)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
};
