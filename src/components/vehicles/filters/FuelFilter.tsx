
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';

interface FuelFilterProps {
  fuel: string;
  setFuel: (fuel: string) => void;
  fuelTypes: string[];
}

const FuelFilter: React.FC<FuelFilterProps> = ({ fuel, setFuel, fuelTypes }) => {
  const { t } = useLanguage();
  
  return (
    <div>
      <label className="text-xs font-medium text-foreground mb-1 block">{t('filters.fuel')}</label>
      <Select value={fuel} onValueChange={setFuel}>
        <SelectTrigger className="h-8 text-xs bg-card border-border text-foreground hover:border-primary/30">
          <SelectValue placeholder={t('filters.selectFuel')} />
        </SelectTrigger>
        <SelectContent className="bg-card border-border">
          <SelectItem value="all" className="text-foreground hover:bg-primary/10">{t('filters.allFuels')}</SelectItem>
          {fuelTypes.map((type) => (
            <SelectItem key={type} value={type} className="text-foreground hover:bg-primary/10">
              {type}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default FuelFilter;
