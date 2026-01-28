
import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface FilterHeaderProps {
  vehicleCount: number;
  onClearFilters: () => void;
}

const FilterHeader: React.FC<FilterHeaderProps> = ({ vehicleCount, onClearFilters }) => {
  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold">Filtros</h2>
        <Button variant="ghost" size="sm" onClick={onClearFilters} className="h-7 px-2">
          <X className="h-3 w-3 mr-1" />
          <span className="text-xs">Limpiar</span>
        </Button>
      </div>

      {/* Results count */}
      <div className="text-xs text-muted-foreground bg-secondary p-2 rounded border border-border">
        {vehicleCount} vehículos encontrados
      </div>
    </>
  );
};

export default FilterHeader;
