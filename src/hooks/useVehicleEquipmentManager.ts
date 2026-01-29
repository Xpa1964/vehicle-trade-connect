
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';

export const useVehicleEquipmentManager = () => {
  const { t } = useLanguage();

  const saveEquipment = async (vehicleId: string, equipmentIds: string[]) => {
    try {
      console.log(`Adding ${equipmentIds.length} equipment items to vehicle ${vehicleId}`);
      
      if (equipmentIds.length === 0) {
        console.log('No equipment to add, skipping');
        return;
      }
      
      // Verify equipment IDs exist before trying to insert them
      const { data: existingEquipment, error: verificationError } = await supabase
        .from('equipment_items')
        .select('id')
        .in('id', equipmentIds);
        
      if (verificationError) {
        console.error('Error verifying equipment IDs:', verificationError);
        toast.error(t('vehicles.equipmentError'));
        return;
      }
      
      // Filter out any IDs that don't exist in the database
      const validEquipmentIds = existingEquipment?.map(item => item.id) || [];
      console.log(`Verified equipment IDs: ${validEquipmentIds.length} of ${equipmentIds.length} are valid`);
      
      if (validEquipmentIds.length === 0) {
        console.warn('No valid equipment IDs found, skipping equipment insertion');
        return;
      }
      
      // Prepare equipment records - include name field which is required
      const equipmentData = validEquipmentIds.map(equipmentId => ({
        vehicle_id: vehicleId,
        equipment_id: equipmentId,
        name: equipmentId // Use equipment_id as name placeholder
      }));

      console.log('Equipment data to insert:', equipmentData);

      // Insert equipment records
      const { error: equipmentError, data: insertedEquipment } = await supabase
        .from('vehicle_equipment')
        .insert(equipmentData)
        .select();

      if (equipmentError) {
        console.error('Error inserting equipment:', equipmentError);
        toast.error(t('vehicles.equipmentError'));
      } else {
        console.log('Equipment inserted successfully:', insertedEquipment);
        toast.success(t('vehicles.equipmentSuccess'));
      }
    } catch (err) {
      console.error('Error in saveEquipment function:', err);
      toast.error(t('vehicles.equipmentError'));
    }
  };

  return { saveEquipment };
};
