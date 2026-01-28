
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Settings } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useEquipmentTranslation } from '@/utils/equipmentTranslation';

interface VehicleEquipmentCardProps {
  vehicleId: string;
}

const VehicleEquipmentCard: React.FC<VehicleEquipmentCardProps> = ({
  vehicleId
}) => {
  const { t } = useLanguage();
  const getEquipmentName = useEquipmentTranslation();

  console.log('🔧 VehicleEquipmentCard - Component rendered for vehicle:', vehicleId);

  const { data: equipment = [], isLoading, error } = useQuery({
    queryKey: ['vehicle-equipment', vehicleId],
    queryFn: async () => {
      console.log('🔧 VehicleEquipmentCard - Fetching equipment for vehicle:', vehicleId);
      
      const { data, error } = await supabase
        .from('vehicle_equipment')
        .select(`
          equipment_items(name, standard_name)
        `)
        .eq('vehicle_id', vehicleId);
      
      if (error) {
        console.error('🔧 VehicleEquipmentCard - Error fetching equipment:', error);
        return [];
      }
      
      console.log('🔧 VehicleEquipmentCard - Raw equipment data from DB:', data);
      return data || [];
    }
  });

  console.log('🔧 VehicleEquipmentCard - Query state:', { 
    isLoading, 
    error, 
    equipmentCount: equipment.length,
    equipment 
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
        {equipment.length > 0 ? (
          <div className="grid grid-cols-1 gap-2">
            {equipment.map((item: any, index: number) => {
              console.log('🔧 VehicleEquipmentCard - Rendering equipment item:', {
                index,
                standardName: item.equipment_items?.standard_name,
                name: item.equipment_items?.name
              });
              
              return (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#22C55E] rounded-full"></div>
                  <span className="text-sm text-foreground">
                    {getEquipmentName(item.equipment_items?.standard_name, item.equipment_items?.name)}
                  </span>
                </div>
              );
            })}
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
