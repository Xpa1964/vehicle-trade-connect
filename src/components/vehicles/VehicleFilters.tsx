
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RotateCcw } from 'lucide-react';
import BrandModelFilter from './filters/BrandModelFilter';
import RangeFilter from './filters/RangeFilter';
import YearFilter from './filters/YearFilter';
import FuelFilter from './filters/FuelFilter';
import StatusFilter from './filters/StatusFilter';
import { useVehicleFilterData } from '@/hooks/useVehicleFilterData';

interface VehicleFiltersProps {
  filters: any;
  setFilters: (filters: any) => void;
  availableBrands: string[];
  availableModels: string[];
  onReset: () => void;
}

const VehicleFilters: React.FC<VehicleFiltersProps> = ({
  filters,
  setFilters,
  availableBrands,
  availableModels,
  onReset
}) => {
  const { fuelTypes } = useVehicleFilterData();

  const handlePriceRangeChange = (values: number[]) => {
    setFilters({
      ...filters,
      priceMin: values[0],
      priceMax: values[1]
    });
  };

  const handleMileageRangeChange = (values: number[]) => {
    setFilters({
      ...filters,
      mileageMin: values[0],
      mileageMax: values[1]
    });
  };

  const handleYearRangeChange = (values: number[]) => {
    setFilters({
      ...filters,
      yearMin: values[0],
      yearMax: values[1]
    });
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-foreground">Filtros</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={onReset}
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Limpiar
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <BrandModelFilter
          brand={filters.brand || 'all'}
          model={filters.model || 'all'}
          setBrand={(brand) => setFilters({ ...filters, brand })}
          setModel={(model) => setFilters({ ...filters, model })}
        />

        <RangeFilter
          title="Precio (€)"
          min={0}
          max={100000}
          minValue={filters.priceMin || 0}
          maxValue={filters.priceMax || 100000}
          step={1000}
          setMinValue={(value) => setFilters({ ...filters, priceMin: value })}
          setMaxValue={(value) => setFilters({ ...filters, priceMax: value })}
          onRangeChange={handlePriceRangeChange}
          formatValue={(value) => `€${value.toLocaleString()}`}
        />

        <RangeFilter
          title="Kilómetros"
          min={0}
          max={300000}
          minValue={filters.mileageMin || 0}
          maxValue={filters.mileageMax || 300000}
          step={5000}
          setMinValue={(value) => setFilters({ ...filters, mileageMin: value })}
          setMaxValue={(value) => setFilters({ ...filters, mileageMax: value })}
          onRangeChange={handleMileageRangeChange}
          formatValue={(value) => `${value.toLocaleString()} km`}
        />

        <YearFilter
          yearMin={filters.yearMin || 2000}
          yearMax={filters.yearMax || new Date().getFullYear()}
          setYearMin={(year) => setFilters({ ...filters, yearMin: year })}
          setYearMax={(year) => setFilters({ ...filters, yearMax: year })}
          onYearRangeChange={handleYearRangeChange}
        />

        <FuelFilter
          fuel={filters.fuel || 'all'}
          setFuel={(fuel) => setFilters({ ...filters, fuel })}
          fuelTypes={fuelTypes}
        />

        <StatusFilter
          status={filters.status || 'all'}
          setStatus={(status) => setFilters({ ...filters, status })}
        />
      </CardContent>
    </Card>
  );
};

export default VehicleFilters;
