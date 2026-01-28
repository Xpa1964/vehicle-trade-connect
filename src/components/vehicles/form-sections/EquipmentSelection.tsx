
import React, { useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { UseFormReturn } from 'react-hook-form';
import { VehicleFormData } from '@/types/vehicle';
import { EquipmentCombobox } from './EquipmentCombobox';
import { SelectedEquipmentTags } from './SelectedEquipmentTags';
import { toast } from 'sonner';

interface EquipmentSelectionProps {
  form: UseFormReturn<VehicleFormData>;
}

export const EquipmentSelection = ({ form }: EquipmentSelectionProps) => {
  const { t } = useLanguage();
  
  // Always initialize equipment as an empty array if it's undefined or null
  useEffect(() => {
    const currentEquipment = form.getValues('equipment');
    if (!currentEquipment || !Array.isArray(currentEquipment)) {
      console.log('Initializing equipment array as it was not properly set');
      form.setValue('equipment', [], { shouldValidate: true });
    }
  }, [form]);
  
  // Get the current equipment, ensuring it's a valid array
  const equipment = form.watch('equipment') || [];
  
  console.log('Current equipment selection in EquipmentSelection:', equipment);

  const handleSelect = (equipmentId: string) => {
    try {
      // Get current equipment, ensuring it's an array
      const currentEquipment = Array.isArray(form.getValues('equipment')) 
        ? form.getValues('equipment') 
        : [];
      
      console.log('Equipment selection - Current:', currentEquipment, 'Selected:', equipmentId);
      
      // Prevent duplicates
      if (currentEquipment.includes(equipmentId)) {
        console.log('Removing equipment item:', equipmentId);
        form.setValue(
          'equipment', 
          currentEquipment.filter(id => id !== equipmentId), 
          { shouldDirty: true, shouldValidate: true }
        );
      } else {
        console.log('Adding equipment item:', equipmentId);
        form.setValue(
          'equipment', 
          [...currentEquipment, equipmentId], 
          { shouldDirty: true, shouldValidate: true }
        );
      }
      
      // Log after update
      console.log('Updated equipment:', form.getValues('equipment'));
    } catch (error) {
      console.error('Error handling equipment selection:', error);
      toast.error(t('common.error'));
    }
  };

  const handleRemove = (equipmentId: string) => {
    try {
      const currentEquipment = Array.isArray(form.getValues('equipment')) 
        ? form.getValues('equipment') 
        : [];
      
      console.log('Removing equipment item:', equipmentId);
        
      form.setValue(
        'equipment', 
        currentEquipment.filter(id => id !== equipmentId), 
        { shouldDirty: true, shouldValidate: true }
      );
      
      // Log after update
      console.log('Updated equipment after removal:', form.getValues('equipment'));
    } catch (error) {
      console.error('Error removing equipment:', error);
      toast.error(t('common.error'));
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-bold text-lg">
          <CheckCircle2 className="h-5 w-5" />
          {t('vehicles.equipment')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <EquipmentCombobox
          onSelect={handleSelect}
          selectedEquipment={equipment}
        />
        <SelectedEquipmentTags
          selectedEquipment={equipment}
          onRemove={handleRemove}
        />
      </CardContent>
    </Card>
  );
};
