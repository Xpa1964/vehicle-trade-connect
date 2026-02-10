import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Settings } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useVehicleOptions } from '@/hooks/useVehicleOptions';

interface VehicleEquipmentCardProps {
  vehicleId: string;
}

const VehicleEquipmentCard: React.FC<VehicleEquipmentCardProps> = ({
  vehicleId
}) => {
  const { t } = useLanguage();
  const { getLabelForKey } = useVehicleOptions();

  const { data: equipmentKeys = [], isLoading } = useQuery({
    queryKey: ['vehicle-equipment-keys', vehicleId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vehicle_equipment')
        .select('name')
        .eq('vehicle_id', vehicleId);
      
      if (error) {
        console.error('Error fetching vehicle equipment:', error);
        return [];
      }
      
      return (data || []).map(item => item.name).filter(Boolean);
    }
  });

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Settings className="h-5 w-5 text-muted-foreground" />
          {t('vehicles.equipment')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {equipmentKeys.length > 0 ? (
          <div className="grid grid-cols-1 gap-2">
            {equipmentKeys.map((key, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#22C55E] rounded-full"></div>
                <span className="text-sm text-foreground">
                  {getLabelForKey(key)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground italic">
            {t('vehicles.equipmentNotAvailable')}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default VehicleEquipmentCard;
