
import React, { memo } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { EU_COUNTRIES } from '../useImportCalculator';

interface VehicleTabProps {
  vehicleType: string;
  isNew: boolean;
  originCountry: string;
  setVehicleType: (type: string) => void;
  setIsNew: (isNew: boolean) => void;
  setOriginCountry: (country: string) => void;
}

const VehicleTab: React.FC<VehicleTabProps> = memo(({
  vehicleType,
  isNew,
  originCountry,
  setVehicleType,
  setIsNew,
  setOriginCountry
}) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="vehicleType" className="text-sm sm:text-base">
            {t('calculator.vehicle.type', { fallback: 'Vehicle type' })}
          </Label>
          <Select value={vehicleType} onValueChange={setVehicleType}>
            <SelectTrigger id="vehicleType" className="h-11 sm:h-10">
              <SelectValue placeholder={t('calculator.vehicle.selectType', { fallback: 'Select type' })} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="car">{t('calculator.vehicle.car', { fallback: 'Car' })}</SelectItem>
              <SelectItem value="commercial">{t('calculator.vehicle.commercial', { fallback: 'Commercial' })}</SelectItem>
              <SelectItem value="motorcycle">{t('calculator.vehicle.motorcycle', { fallback: 'Motorcycle' })}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="originCountry" className="text-sm sm:text-base">
            {t('calculator.vehicle.originCountry', { fallback: 'Country of origin' })}
          </Label>
          <Select value={originCountry} onValueChange={setOriginCountry}>
            <SelectTrigger id="originCountry" className="h-11 sm:h-10">
              <SelectValue placeholder={t('calculator.vehicle.selectCountry', { fallback: 'Select country' })} />
            </SelectTrigger>
            <SelectContent>
              {EU_COUNTRIES.filter(country => country !== "España").map(country => (
                <SelectItem key={country} value={country}>{country}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex items-center space-x-3 py-2">
        <Switch
          id="isNew"
          checked={isNew}
          onCheckedChange={setIsNew}
        />
        <Label htmlFor="isNew" className="text-sm sm:text-base flex-1">
          {t('calculator.vehicle.isNew', { fallback: 'New vehicle' })}
        </Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-4 w-4 text-gray-400 touch-manipulation" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p>{t('calculator.vehicle.newTooltip', { fallback: 'A vehicle is considered new if it is less than 6 months old or has less than 6,000 km' })}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
});

VehicleTab.displayName = 'VehicleTab';

export default VehicleTab;
