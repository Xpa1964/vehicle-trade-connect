
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

interface VehicleEquipmentHeaderProps {
  vehicleId: string;
  brand: string;
  model: string;
}

export const VehicleEquipmentHeader: React.FC<VehicleEquipmentHeaderProps> = ({
  vehicleId,
  brand,
  model
}) => {
  const { t } = useLanguage();

  return (
    <div className="flex items-center mb-6">
      <Link to={`/vehicle-preview/${vehicleId}`}>
        <Button variant="outline" size="sm" className="mr-4">
          <ArrowLeft className="w-4 h-4 mr-2" /> {t('common.back')}
        </Button>
      </Link>
      <h1 className="text-2xl font-bold">
        {brand} {model} - {t('vehicles.equipment')}
      </h1>
    </div>
  );
};
