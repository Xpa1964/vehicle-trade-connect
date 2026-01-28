
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SearchFilter from './filters/SearchFilter';
import SortFilter from './filters/SortFilter';
import CountryFilter from './filters/CountryFilter';
import BrandModelFilter from './filters/BrandModelFilter';
import FuelFilter from './filters/FuelFilter';
import StatusFilter from './filters/StatusFilter';
import RangeFilter from './filters/RangeFilter';
import YearFilter from './filters/YearFilter';
import SpecialFiltersDropdown from './filters/SpecialFiltersDropdown';
import CompanyFilter from './filters/CompanyFilter';
import { Button } from '@/components/ui/button';
import { RotateCcw, Filter } from 'lucide-react';
import { useVehicleFilterData } from '@/hooks/useVehicleFilterData';
import { useLanguage } from '@/contexts/LanguageContext';

interface VehicleSidebarFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  filters: any;
  setFilters: (filters: any) => void;
  vehicleCount: number;
  vehicles: any[];
  isPublicView?: boolean;
}

const VehicleSidebarFilters: React.FC<VehicleSidebarFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  sortBy,
  setSortBy,
  filters,
  setFilters,
  vehicleCount,
  vehicles,
  isPublicView = false
}) => {
  const { countries, fuelTypes } = useVehicleFilterData();
  const [tempFilters, setTempFilters] = useState(filters);
  const { t } = useLanguage();

  const resetFilters = () => {
    const defaultFilters = {
      country: 'all',
      brand: 'all',
      fuel: 'all',
      model: 'all',
      status: 'all',
      priceMin: 0,
      priceMax: 100000,
      mileageMin: 0,
      mileageMax: 200000,
      yearMin: 2000,
      yearMax: new Date().getFullYear(),
      // Special filters
      specialFilter: 'all',
      company: 'all'
    };
    setSearchTerm('');
    setTempFilters(defaultFilters);
    setFilters(defaultFilters);
  };

  const applyFilters = () => {
    setFilters(tempFilters);
  };

  const hasChanges = JSON.stringify(filters) !== JSON.stringify(tempFilters);

  return (
    <div className="w-56 bg-white border-r border-gray-200 h-full overflow-y-auto">
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold">{t('vehicles.filtersTitle')}</h2>
          <div className="flex gap-2">
            <Button 
              onClick={applyFilters}
              disabled={!hasChanges}
              size="sm"
              variant={hasChanges ? "default" : "outline"}
              className="text-xs h-7 px-2"
            >
              <Filter className="h-3 w-3 mr-1" />
              {t('vehicles.filterButton')}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={resetFilters}
              className="text-xs h-7 px-2"
            >
              <RotateCcw className="h-3 w-3 mr-1" />
              {t('vehicles.clearButton')}
            </Button>
          </div>
        </div>

        <div className="text-sm text-gray-600">
          {t('vehicles.vehiclesFoundCount', { count: vehicleCount })}
          {isPublicView && (
            <div className="mt-2 text-xs bg-blue-50 text-blue-700 p-2 rounded">
              {t('vehicles.limitedView')}
            </div>
          )}
        </div>

        <SearchFilter searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        
        <SortFilter sortBy={sortBy} setSortBy={setSortBy} />

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">{t('vehicles.locationTitle')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <CountryFilter 
              country={tempFilters.country}
              setCountry={(country) => setTempFilters({ ...tempFilters, country })}
              countries={countries}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">{t('vehicles.companyTitle')}</CardTitle>
          </CardHeader>
          <CardContent>
            <CompanyFilter 
              company={tempFilters.company}
              setCompany={(company) => setTempFilters({ ...tempFilters, company })}
              vehicles={vehicles}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">{t('vehicles.vehicleTitle')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <BrandModelFilter 
              brand={tempFilters.brand}
              model={tempFilters.model}
              setBrand={(brand) => setTempFilters({ ...tempFilters, brand, model: 'all' })}
              setModel={(model) => setTempFilters({ ...tempFilters, model })}
            />
            <FuelFilter 
              fuel={tempFilters.fuel}
              setFuel={(fuel) => setTempFilters({ ...tempFilters, fuel })}
              fuelTypes={fuelTypes}
            />
            <StatusFilter 
              status={tempFilters.status}
              setStatus={(status) => setTempFilters({ ...tempFilters, status })}
            />
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('vehicles.specialFilters')}</label>
              <SpecialFiltersDropdown 
                specialFilter={tempFilters.specialFilter}
                setSpecialFilter={(specialFilter) => setTempFilters({ ...tempFilters, specialFilter })}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">{t('vehicles.rangesTitle')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <RangeFilter 
              title={t('vehicles.priceTitle')}
              min={0}
              max={100000}
              minValue={tempFilters.priceMin}
              maxValue={tempFilters.priceMax}
              step={1000}
              setMinValue={(min) => setTempFilters({ ...tempFilters, priceMin: min })}
              setMaxValue={(max) => setTempFilters({ ...tempFilters, priceMax: max })}
              onRangeChange={(values) => setTempFilters({ ...tempFilters, priceMin: values[0], priceMax: values[1] })}
              formatValue={(value) => `€${value.toLocaleString()}`}
            />
            <RangeFilter 
              title={t('vehicles.mileageTitle')}
              min={0}
              max={200000}
              minValue={tempFilters.mileageMin}
              maxValue={tempFilters.mileageMax}
              step={5000}
              setMinValue={(min) => setTempFilters({ ...tempFilters, mileageMin: min })}
              setMaxValue={(max) => setTempFilters({ ...tempFilters, mileageMax: max })}
              onRangeChange={(values) => setTempFilters({ ...tempFilters, mileageMin: values[0], mileageMax: values[1] })}
              formatValue={(value) => `${value.toLocaleString()} km`}
            />
            <YearFilter 
              yearMin={tempFilters.yearMin}
              yearMax={tempFilters.yearMax}
              setYearMin={(year) => setTempFilters({ ...tempFilters, yearMin: year })}
              setYearMax={(year) => setTempFilters({ ...tempFilters, yearMax: year })}
              onYearRangeChange={(values) => setTempFilters({ ...tempFilters, yearMin: values[0], yearMax: values[1] })}
            />
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default VehicleSidebarFilters;
