
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { countries, getCountryFlagUrl } from '@/utils/countryUtils';
import { useLanguage } from '@/contexts/LanguageContext';

interface SearchFiltersProps {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  sortBy: string;
  setSortBy: React.Dispatch<React.SetStateAction<string>>;
  filters: {
    country: string;
    brand: string;
    fuel: string;
    model: string;
  };
  setFilters: React.Dispatch<React.SetStateAction<{
    country: string;
    brand: string;
    fuel: string;
    model: string;
  }>>;
  availableBrands: string[];
  availableModels: string[];
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  sortBy,
  setSortBy,
  filters,
  setFilters,
  availableBrands,
  availableModels
}) => {
  const { t } = useLanguage();
  
  const sortOptions = [
    { value: 'newest', label: t('vehicles.sortNewest') },
    { value: 'priceAsc', label: t('vehicles.sortPriceAsc') },
    { value: 'priceDesc', label: t('vehicles.sortPriceDesc') },
    { value: 'mileage', label: t('vehicles.sortMileage') }
  ];

  return (
    <div className="bg-white shadow-sm border-b sticky top-16 z-10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              type="text"
              placeholder={t('vehicles.search')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          
          <Select value={filters.country} onValueChange={(value) => setFilters({ ...filters, country: value })}>
            <SelectTrigger>
              <SelectValue placeholder={t('vehicles.selectCountry')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('vehicles.allCountries')}</SelectItem>
              {countries.map((country) => (
                <SelectItem key={country.code} value={country.code.toLowerCase()}>
                  <div className="flex items-center gap-2">
                    <img 
                      src={getCountryFlagUrl(country.code.toLowerCase())}
                      alt={country.name}
                      className="w-4 h-3"
                    />
                    {country.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.brand} onValueChange={(value) => setFilters({ ...filters, brand: value, model: 'all' })}>
            <SelectTrigger>
              <SelectValue placeholder={t('vehicles.selectBrand')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('vehicles.allBrands')}</SelectItem>
              {availableBrands.map((brand) => (
                <SelectItem key={brand} value={brand}>{brand}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select 
            value={filters.model} 
            onValueChange={(value) => setFilters({ ...filters, model: value })}
            disabled={filters.brand === 'all'}
          >
            <SelectTrigger>
              <SelectValue placeholder={t('vehicles.selectModel')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('vehicles.allModels')}</SelectItem>
              {availableModels.map((model) => (
                <SelectItem key={model} value={model}>{model}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.fuel} onValueChange={(value) => setFilters({ ...filters, fuel: value })}>
            <SelectTrigger>
              <SelectValue placeholder={t('vehicles.selectFuel')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('vehicles.allFuels')}</SelectItem>
              <SelectItem value="gasoline">{t('vehicles.gasoline')}</SelectItem>
              <SelectItem value="diesel">{t('vehicles.diesel')}</SelectItem>
              <SelectItem value="hybrid">{t('vehicles.hybrid')}</SelectItem>
              <SelectItem value="electric">{t('vehicles.electric')}</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SelectValue placeholder={t('vehicles.sort')} />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;
