
import React from 'react';
import { Car, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

const VehicleEmpty: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="text-center py-12">
      <Car className="mx-auto h-12 w-12 text-muted-foreground" />
      <h3 className="mt-2 text-sm font-semibold text-foreground">
        {t('vehicles.noVehiclesOwned')}
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        {t('vehicles.publishVehiclePrompt')}
      </p>
      <div className="mt-6">
        <Button onClick={() => navigate('/vehicle-management')} className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          {t('vehicles.publishNewVehicle')}
        </Button>
      </div>
    </div>
  );
};

export default VehicleEmpty;
