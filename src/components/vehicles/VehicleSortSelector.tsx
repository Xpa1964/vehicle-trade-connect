
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';

interface VehicleSortSelectorProps {
  sortBy: string;
  setSortBy: (sort: string) => void;
}

const VehicleSortSelector: React.FC<VehicleSortSelectorProps> = ({
  sortBy,
  setSortBy
}) => {
  const { t } = useLanguage();

  const sortOptions = [
    { value: 'newest', label: t('vehicles.sortNewest') },
    { value: 'priceAsc', label: t('vehicles.sortPriceAsc') },
    { value: 'priceDesc', label: t('vehicles.sortPriceDesc') },
    { value: 'mileage', label: t('vehicles.sortMileage') },
    { value: 'year', label: t('vehicles.sortYear') }
  ];

  return (
    <Select value={sortBy} onValueChange={setSortBy}>
      <SelectTrigger className="w-48">
        <SelectValue placeholder={t('vehicles.sortByPlaceholder')} />
      </SelectTrigger>
      <SelectContent>
        {sortOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default VehicleSortSelector;
