
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';

interface SortFilterProps {
  sortBy: string;
  setSortBy: (sort: string) => void;
}

const SortFilter: React.FC<SortFilterProps> = ({ sortBy, setSortBy }) => {
  const { t } = useLanguage();

  const sortOptions = [
    { value: 'newest', label: t('vehicles.sortNewest') },
    { value: 'priceAsc', label: t('vehicles.sortPriceAsc') },
    { value: 'priceDesc', label: t('vehicles.sortPriceDesc') },
    { value: 'mileage', label: t('vehicles.sortMileage') }
  ];

  return (
    <div className="space-y-2">
      <Label className="text-xs font-medium">{t('filters.sortBy')}</Label>
      <Select value={sortBy} onValueChange={setSortBy}>
        <SelectTrigger className="w-full h-8 text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {sortOptions.map((option) => (
            <SelectItem key={option.value} value={option.value} className="text-xs">
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default SortFilter;
