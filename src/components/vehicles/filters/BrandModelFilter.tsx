
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useVehicleFilterData } from '@/hooks/useVehicleFilterData';
import { useLanguage } from '@/contexts/LanguageContext';

interface BrandModelFilterProps {
  brand: string;
  model: string;
  setBrand: (brand: string) => void;
  setModel: (model: string) => void;
}

const BrandModelFilter: React.FC<BrandModelFilterProps> = ({
  brand,
  model,
  setBrand,
  setModel
}) => {
  const { t } = useLanguage();
  const { brands, getModelsForBrand } = useVehicleFilterData();
  const availableModels = getModelsForBrand(brand);

  const handleBrandChange = (newBrand: string) => {
    setBrand(newBrand);
    setModel('all'); // Reset model when brand changes
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="text-xs font-medium text-foreground mb-1 block">{t('filters.brand')}</label>
        <Select value={brand} onValueChange={handleBrandChange}>
          <SelectTrigger className="h-8 text-xs bg-card border-border text-foreground hover:border-primary/30">
            <SelectValue placeholder={t('filters.selectBrand')} />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            <SelectItem value="all" className="text-foreground hover:bg-primary/10">{t('filters.allBrands')}</SelectItem>
            {brands.map((brandOption) => (
              <SelectItem key={brandOption} value={brandOption} className="text-foreground hover:bg-primary/10">
                {brandOption}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-xs font-medium text-foreground mb-1 block">{t('filters.model')}</label>
        <Select value={model} onValueChange={setModel} disabled={brand === 'all'}>
          <SelectTrigger className="h-8 text-xs bg-card border-border text-foreground hover:border-primary/30 disabled:bg-secondary disabled:text-muted-foreground">
            <SelectValue placeholder={t('filters.selectModel')} />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            <SelectItem value="all" className="text-foreground hover:bg-primary/10">{t('filters.allModels')}</SelectItem>
            {availableModels.map((modelOption) => (
              <SelectItem key={modelOption} value={modelOption} className="text-foreground hover:bg-primary/10">
                {modelOption}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default BrandModelFilter;
