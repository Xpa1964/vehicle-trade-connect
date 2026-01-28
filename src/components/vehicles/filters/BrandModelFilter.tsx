
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
        <label className="text-xs font-medium text-gray-700 mb-1 block">{t('filters.brand')}</label>
        <Select value={brand} onValueChange={handleBrandChange}>
          <SelectTrigger className="h-8 text-xs">
            <SelectValue placeholder={t('filters.selectBrand')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('filters.allBrands')}</SelectItem>
            {brands.map((brandOption) => (
              <SelectItem key={brandOption} value={brandOption}>
                {brandOption}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-xs font-medium text-gray-700 mb-1 block">{t('filters.model')}</label>
        <Select value={model} onValueChange={setModel} disabled={brand === 'all'}>
          <SelectTrigger className="h-8 text-xs">
            <SelectValue placeholder={t('filters.selectModel')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('filters.allModels')}</SelectItem>
            {availableModels.map((modelOption) => (
              <SelectItem key={modelOption} value={modelOption}>
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
