import React from 'react';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { useVehicleOptions } from '@/hooks/useVehicleOptions';

interface SelectedEquipmentTagsProps {
  selectedEquipment: string[];
  onRemove: (key: string) => void;
}

export const SelectedEquipmentTags = ({ selectedEquipment = [], onRemove }: SelectedEquipmentTagsProps) => {
  const { getLabelForKey } = useVehicleOptions();

  if (!Array.isArray(selectedEquipment) || selectedEquipment.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {selectedEquipment.map((key) => (
        <Badge
          key={key}
          variant="secondary"
          className="flex items-center gap-1 pr-1"
        >
          {getLabelForKey(key)}
          <X
            className="h-3 w-3 cursor-pointer hover:text-destructive"
            onClick={() => onRemove(key)}
          />
        </Badge>
      ))}
    </div>
  );
};
