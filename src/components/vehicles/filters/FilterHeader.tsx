
import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface FilterHeaderProps {
  vehicleCount: number;
  onClearFilters: () => void;
}

const FilterHeader: React.FC<FilterHeaderProps> = ({ vehicleCount, onClearFilters }) => {
  const { t } = useLanguage();
  
  const getCountText = () => {
    if (vehicleCount === 1) {
      return t('vehicles.oneVehicleFound');
    }
    const template = t('vehicles.vehiclesFoundCount');
    return template.replace('{{count}}', String(vehicleCount));
  };

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold">{t('vehicles.filtersTitle')}</h2>
        <Button variant="ghost" size="sm" onClick={onClearFilters} className="h-7 px-2">
          <X className="h-3 w-3 mr-1" />
          <span className="text-xs">{t('vehicles.clearButton')}</span>
        </Button>
      </div>

      {/* Results count */}
      <div className="text-xs text-muted-foreground bg-secondary p-2 rounded border border-border">
        {getCountText()}
      </div>
    </>
  );
};

export default FilterHeader;
