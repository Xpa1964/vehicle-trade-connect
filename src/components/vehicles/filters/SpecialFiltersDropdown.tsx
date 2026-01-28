import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';

interface SpecialFiltersDropdownProps {
  specialFilter: string;
  setSpecialFilter: (filter: string) => void;
}

const SpecialFiltersDropdown: React.FC<SpecialFiltersDropdownProps> = ({ 
  specialFilter, 
  setSpecialFilter 
}) => {
  const { t } = useLanguage();
  
  return (
    <Select value={specialFilter} onValueChange={setSpecialFilter}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={t('filters.selectSpecialFilter')} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">{t('filters.statusAll')}</SelectItem>
        <SelectItem value="ivaIncluded">{t('vehicles.ivaIncluded')}</SelectItem>
        <SelectItem value="ivaNotIncluded">{t('vehicles.ivaNotIncluded')}</SelectItem>
        <SelectItem value="acceptsExchange">{t('vehicles.acceptsExchange')}</SelectItem>
        <SelectItem value="noExchange">{t('vehicles.noExchange')}</SelectItem>
        <SelectItem value="nearlyNew">{t('vehicles.nearlyNew')}</SelectItem>
        <SelectItem value="commissionSale">{t('vehicles.commissionSale')}</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default SpecialFiltersDropdown;