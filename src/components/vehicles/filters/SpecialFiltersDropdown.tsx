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
      <SelectTrigger className="w-full bg-card border-border text-foreground hover:border-primary/30">
        <SelectValue placeholder={t('filters.selectSpecialFilter')} />
      </SelectTrigger>
      <SelectContent className="bg-card border-border">
        <SelectItem value="all" className="text-foreground hover:bg-primary/10">{t('filters.statusAll')}</SelectItem>
        <SelectItem value="ivaIncluded" className="text-foreground hover:bg-primary/10">{t('vehicles.ivaIncluded')}</SelectItem>
        <SelectItem value="ivaNotIncluded" className="text-foreground hover:bg-primary/10">{t('vehicles.ivaNotIncluded')}</SelectItem>
        <SelectItem value="acceptsExchange" className="text-foreground hover:bg-primary/10">{t('vehicles.acceptsExchange')}</SelectItem>
        <SelectItem value="noExchange" className="text-foreground hover:bg-primary/10">{t('vehicles.noExchange')}</SelectItem>
        <SelectItem value="nearlyNew" className="text-foreground hover:bg-primary/10">{t('vehicles.nearlyNew')}</SelectItem>
        <SelectItem value="commissionSale" className="text-foreground hover:bg-primary/10">{t('vehicles.commissionSale')}</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default SpecialFiltersDropdown;