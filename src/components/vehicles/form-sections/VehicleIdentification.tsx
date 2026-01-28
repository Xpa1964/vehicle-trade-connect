
import React, { useState, useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useLanguage } from '@/contexts/LanguageContext';
import { VehicleFormData } from '@/types/vehicle';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { CalendarIcon, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, parse, isValid } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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

export const VehicleIdentification = ({ form }: VehicleIdentificationProps) => {
  const { t } = useLanguage();
  const [manualDate, setManualDate] = useState('');

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
          <FormField
            control={form.control}
            name="vin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('vehicles.vin')}</FormLabel>
                <FormControl>
                  <Input 
                    placeholder={t('vehicles.vinPlaceholder')} 
                    {...field} 
                    value={field.value || ''} 
                  />
                </FormControl>
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
