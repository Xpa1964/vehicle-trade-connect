
import React from 'react';
import { Search, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

interface NoVehiclesFoundProps {
  onResetFilters?: () => void;
  showResetButton?: boolean;
}

const NoVehiclesFound: React.FC<NoVehiclesFoundProps> = ({
  onResetFilters,
  showResetButton = true
}) => {
  const { t } = useLanguage();

  return (
    <div className="text-center py-12">
      <Search className="mx-auto h-12 w-12 text-muted-foreground" />
      <h3 className="mt-2 text-sm font-semibold text-foreground">
        {t('vehicles.noResults')}
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        {t('vehicles.tryDifferentSearch')}
      </p>
      {showResetButton && onResetFilters && (
        <div className="mt-6">
          <Button variant="outline" onClick={onResetFilters} className="border-border text-foreground hover:bg-secondary">
            <RotateCcw className="h-4 w-4 mr-2" />
            {t('vehicles.clearFilters')}
          </Button>
        </div>
      )}
    </div>
  );
};

export default NoVehiclesFound;
