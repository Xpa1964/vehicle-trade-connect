
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface SelectedEquipmentTagsProps {
  selectedEquipment: string[];
  onRemove: (id: string) => void;
}

export const SelectedEquipmentTags = ({ selectedEquipment = [], onRemove }: SelectedEquipmentTagsProps) => {
  const { data: equipmentItems = [] } = useQuery({
    queryKey: ['equipment-items', selectedEquipment],
    queryFn: async () => {
      // Check if selectedEquipment is an array and has items
      if (!Array.isArray(selectedEquipment) || selectedEquipment.length === 0) return [];
      
      const { data, error } = await supabase
        .from('equipment_items')
        .select('id, name')
        .in('id', selectedEquipment);
      
      if (error) {
        console.error('Error fetching selected equipment items:', error);
        return [];
      }
        
      return data || [];
    },
    // Only run query if selectedEquipment is valid
    enabled: Array.isArray(selectedEquipment) && selectedEquipment.length > 0,
  });

  if (!Array.isArray(equipmentItems) || !equipmentItems.length) return null;

  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {equipmentItems.map((item) => (
        <Badge
          key={item.id}
          variant="secondary"
          className="flex items-center gap-1 pr-1"
        >
          {item.name}
          <X
            className="h-3 w-3 cursor-pointer hover:text-destructive"
            onClick={() => onRemove(item.id)}
          />
        </Badge>
      ))}
    </div>
  );
};
