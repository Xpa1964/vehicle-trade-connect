
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

interface VehicleActionsProps {
  vehicleId: string;
  onDelete: () => void;
}

const VehicleActions: React.FC<VehicleActionsProps> = ({
  vehicleId,
  onDelete
}) => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-lg text-primary">{t('vehicleActions.title')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(`/upload-vehicle/${vehicleId}`)}
          className="w-full flex items-center gap-2 border-border text-foreground hover:bg-secondary"
        >
          <Edit className="h-4 w-4" />
          {t('vehicleActions.editVehicle')}
        </Button>
        
        <Button
          variant="destructive"
          size="sm"
          onClick={onDelete}
          className="w-full flex items-center gap-2 bg-[#EF4444] hover:bg-[#EF4444]/90"
        >
          <Trash2 className="h-4 w-4" />
          {t('vehicleActions.deleteVehicle')}
        </Button>
      </CardContent>
    </Card>
  );
};

export default VehicleActions;
