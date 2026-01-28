
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { UseFormReturn } from 'react-hook-form';
import { VehicleFormData } from '@/types/vehicle';

interface VehicleSpecsProps {
  form: UseFormReturn<VehicleFormData>;
}

export const VehicleSpecs: React.FC<VehicleSpecsProps> = ({ form }) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold">{t('vehicles.technicalDetails')}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="grid grid-cols-1 gap-4 md:col-span-2 lg:col-span-1">
          <FormField
            control={form.control}
            name="mileage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('vehicles.mileage')}</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    {...field} 
                    onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                    value={field.value || ''}
                    min="0"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="mileageUnit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('vehicles.mileageUnit')}</FormLabel>
                <Select value={field.value || 'km'} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="km" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="km">{t('vehicles.kilometers')}</SelectItem>
                    <SelectItem value="mi">{t('vehicles.miles')}</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="units"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('vehicles.units')}</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  {...field} 
                  onChange={e => field.onChange(parseInt(e.target.value) || 1)}
                  value={field.value || 1}
                  min="1"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="fuel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('vehicles.fuel')}</FormLabel>
              <Select value={field.value || ''} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={t('vehicles.selectFuel')} />
                  </SelectTrigger>
                </FormControl>
                  <SelectContent>
                    <SelectItem value="gasolina">{t('vehicles.fuelGasoline')}</SelectItem>
                    <SelectItem value="diesel">{t('vehicles.fuelDiesel')}</SelectItem>
                    <SelectItem value="electrico">{t('vehicles.fuelElectric')}</SelectItem>
                    <SelectItem value="hibrido">{t('vehicles.fuelHybrid')}</SelectItem>
                    <SelectItem value="hibrido_enchufable">{t('vehicles.fuelPluginHybrid')}</SelectItem>
                    <SelectItem value="gas_natural">{t('vehicles.fuelNaturalGas')}</SelectItem>
                    <SelectItem value="glp">{t('vehicles.fuelLPG')}</SelectItem>
                    <SelectItem value="hidrogeno">{t('vehicles.fuelHydrogen')}</SelectItem>
                    <SelectItem value="etanol">{t('vehicles.fuelEthanol')}</SelectItem>
                    <SelectItem value="biodiesel">{t('vehicles.fuelBiodiesel')}</SelectItem>
                  </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="transmission"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('vehicles.transmission')}</FormLabel>
              <Select value={field.value || ''} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={t('vehicles.selectTransmission')} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="manual">{t('vehicles.manual')}</SelectItem>
                  <SelectItem value="automatic">{t('vehicles.automatic')}</SelectItem>
                  <SelectItem value="semiautomatic">{t('vehicles.semiautomatic')}</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="engineSize"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('vehicles.engineSize')}</FormLabel>
              <FormControl>
                <Input 
                  placeholder="cc" 
                  type="number" 
                  {...field} 
                  onChange={e => field.onChange(parseFloat(e.target.value) || undefined)}
                  value={field.value || ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="enginePower"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('vehicles.enginePower')}</FormLabel>
              <FormControl>
                <Input 
                  placeholder="hp" 
                  type="number" 
                  {...field} 
                  onChange={e => field.onChange(parseFloat(e.target.value) || undefined)}
                  value={field.value || ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="color"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('vehicles.color')}</FormLabel>
              <FormControl>
                <Input 
                  placeholder={t('vehicles.colorExample', { fallback: "e.g. White" })}
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
          name="doors"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('vehicles.doors')}</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  {...field} 
                  onChange={e => field.onChange(parseInt(e.target.value) || undefined)}
                  value={field.value || ''}
                  min="2"
                  max="5"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      {/* Emissions Section */}
      <div className="mt-6">
        <h4 className="text-md font-bold mb-4">{t('vehicles.emissionsRegulations')}</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="euroStandard"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('vehicles.euroStandard')}</FormLabel>
                <Select value={field.value || ''} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t('vehicles.selectEuroStandard')} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="euro1">Euro 1 (1992)</SelectItem>
                    <SelectItem value="euro2">Euro 2 (1996)</SelectItem>
                    <SelectItem value="euro3">Euro 3 (2000)</SelectItem>
                    <SelectItem value="euro4">Euro 4 (2005)</SelectItem>
                    <SelectItem value="euro5">Euro 5 (2009)</SelectItem>
                    <SelectItem value="euro6">Euro 6 (2014)</SelectItem>
                    <SelectItem value="euro6d">Euro 6d (2020)</SelectItem>
                    <SelectItem value="euro7">Euro 7 (Próximamente)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="co2Emissions"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('vehicles.co2EmissionsSeller')}</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="g/km" 
                    type="number" 
                    {...field} 
                    onChange={e => field.onChange(parseFloat(e.target.value) || undefined)}
                    value={field.value || ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
};
