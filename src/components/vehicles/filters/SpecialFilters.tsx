import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';

interface SpecialFiltersProps {
  filters: {
    ivaIncluded?: boolean;
    ivaNotIncluded?: boolean;
    acceptsExchange?: boolean;
    noExchange?: boolean;
    nearlyNew?: boolean;
    commissionSale?: boolean;
  };
  setFilters: (filters: any) => void;
}

const SpecialFilters: React.FC<SpecialFiltersProps> = ({ filters, setFilters }) => {
  const { t } = useLanguage();

  const handleFilterChange = (filterKey: string, checked: boolean) => {
    setFilters({
      ...filters,
      [filterKey]: checked
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-2">
        <Checkbox
          id="ivaIncluded"
          checked={filters.ivaIncluded || false}
          onCheckedChange={(checked) => handleFilterChange('ivaIncluded', checked as boolean)}
        />
        <Label htmlFor="ivaIncluded" className="text-sm">{t('vehicles.filters.ivaIncluded')}</Label>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="ivaNotIncluded"
          checked={filters.ivaNotIncluded || false}
          onCheckedChange={(checked) => handleFilterChange('ivaNotIncluded', checked as boolean)}
        />
        <Label htmlFor="ivaNotIncluded" className="text-sm">{t('vehicles.filters.ivaNotIncluded')}</Label>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="acceptsExchange"
          checked={filters.acceptsExchange || false}
          onCheckedChange={(checked) => handleFilterChange('acceptsExchange', checked as boolean)}
        />
        <Label htmlFor="acceptsExchange" className="text-sm">{t('vehicles.filters.acceptsExchange')}</Label>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="noExchange"
          checked={filters.noExchange || false}
          onCheckedChange={(checked) => handleFilterChange('noExchange', checked as boolean)}
        />
        <Label htmlFor="noExchange" className="text-sm">{t('vehicles.filters.noExchange')}</Label>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="nearlyNew"
          checked={filters.nearlyNew || false}
          onCheckedChange={(checked) => handleFilterChange('nearlyNew', checked as boolean)}
        />
        <Label htmlFor="nearlyNew" className="text-sm">{t('vehicles.filters.nearlyNew')}</Label>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="commissionSale"
          checked={filters.commissionSale || false}
          onCheckedChange={(checked) => handleFilterChange('commissionSale', checked as boolean)}
        />
        <Label htmlFor="commissionSale" className="text-sm">{t('vehicles.filters.commissionSale')}</Label>
      </div>
    </div>
  );
};

export default SpecialFilters;
