
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Vehicle } from '@/types/vehicle';
import { AlertCircle, Grid, List, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import VehicleList from './VehicleList';
import VehicleSidebarFilters from './VehicleSidebarFilters';
import VehicleSortSelector from './VehicleSortSelector';

interface VehicleGalleryContentProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  viewMode: 'compact' | 'normal';
  setViewMode: (mode: 'compact' | 'normal') => void;
  filters: any;
  setFilters: (filters: any) => void;
  vehicles: Vehicle[];
  isLoading: boolean;
  error: any;
  availableBrands: string[];
  availableModels: string[];
  resetFilters: () => void;
  isPublicView?: boolean;
}

const VehicleGalleryContent: React.FC<VehicleGalleryContentProps> = ({
  searchTerm,
  setSearchTerm,
  sortBy,
  setSortBy,
  viewMode,
  setViewMode,
  filters,
  setFilters,
  vehicles,
  isLoading,
  error,
  availableBrands,
  availableModels,
  resetFilters,
  isPublicView = false
}) => {
  const { t } = useLanguage();

  const handleResetSearch = () => {
    setSearchTerm('');
    resetFilters();
  };

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {t('vehicles.errorLoading')}: {error.message}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="flex gap-6">
      {/* Sidebar de Filtros Verticales */}
      <VehicleSidebarFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        sortBy={sortBy}
        setSortBy={setSortBy}
        filters={filters}
        setFilters={setFilters}
        vehicleCount={vehicles.length}
        vehicles={vehicles}
        isPublicView={isPublicView}
      />

      {/* Contenido Principal */}
      <div className="flex-1 space-y-6">
        {/* Search and View Controls */}
        <div className="bg-card rounded-lg shadow-sm border border-border p-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('vehicles.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* View Mode Controls */}
            <div className="flex border rounded-md">
              <Button
                variant={viewMode === 'compact' ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode('compact')}
                className="rounded-r-none border-r"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'normal' ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode('normal')}
                className="rounded-l-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Results Counter and Sort */}
          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              {isLoading ? (
                <span>{t('vehicles.loading')}...</span>
              ) : (
                <span>
                  {vehicles.length === 1 
                    ? t('vehicles.oneVehicleFound')
                    : t('vehicles.vehiclesFound', { count: vehicles.length })
                  }
                </span>
              )}
            </div>
            
            <VehicleSortSelector 
              sortBy={sortBy} 
              setSortBy={setSortBy} 
            />
          </div>
        </div>

        {/* Vehicle Grid */}
        <VehicleList
          vehicles={vehicles}
          onResetSearch={handleResetSearch}
          compact={viewMode === 'compact'}
          isPublicView={isPublicView}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default VehicleGalleryContent;
