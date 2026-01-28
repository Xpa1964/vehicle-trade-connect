
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Check, ChevronsUpDown, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { AddEquipmentDialog } from './AddEquipmentDialog';

interface Equipment {
  id: string;
  name: string;
  category_id: string;
  equipment_categories?: {
    name: string;
  };
}

interface EquipmentComboboxProps {
  onSelect: (equipmentId: string) => void;
  selectedEquipment?: string[];
}

export const EquipmentCombobox = ({ onSelect, selectedEquipment = [] }: EquipmentComboboxProps) => {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCount, setSelectedCount] = useState(selectedEquipment.length);
  const [showAddDialog, setShowAddDialog] = useState(false);

  const { data: equipment = [], isLoading } = useQuery({
    queryKey: ['equipment-with-categories'],
    queryFn: async () => {
      const { data: equipmentData, error } = await supabase
        .from('equipment_items')
        .select(`
          id,
          name,
          category_id,
          equipment_categories (
            name
          )
        `)
        .order('display_order');
      
      if (error) {
        console.error('Error fetching equipment:', error);
        return [];
      }

      return equipmentData || [];
    }
  });

  // Always ensure we have a valid array to work with
  const groupedEquipment = React.useMemo(() => {
    // Ensure equipment is an array before processing
    const equipmentArray = Array.isArray(equipment) ? equipment : [];
    
    if (equipmentArray.length === 0) return {};
    
    return equipmentArray.reduce<Record<string, Equipment[]>>((acc, item) => {
      // Safely access category name with fallback
      const categoryName = item?.equipment_categories?.name || 'Other';
      if (!acc[categoryName]) {
        acc[categoryName] = [];
      }
      acc[categoryName].push(item);
      return acc;
    }, {});
  }, [equipment]);

  // Filter equipment based on search term
  const filteredGroupedEquipment = React.useMemo(() => {
    if (!searchTerm) return groupedEquipment;
    
    const filtered: Record<string, Equipment[]> = {};
    
    Object.entries(groupedEquipment).forEach(([category, items]) => {
      const filteredItems = items.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      if (filteredItems.length > 0) {
        filtered[category] = filteredItems;
      }
    });
    
    return filtered;
  }, [groupedEquipment, searchTerm]);

  // Ensure we always have a valid object even if no equipment is loaded
  const safeGroupedEquipment = Object.keys(filteredGroupedEquipment).length > 0 ? filteredGroupedEquipment : {};

  // Update selected count when selectedEquipment prop changes
  React.useEffect(() => {
    setSelectedCount(selectedEquipment.length);
  }, [selectedEquipment]);

  const handleSelect = (equipmentId: string) => {
    onSelect(equipmentId);
    // Don't close the popover, allowing multiple selections
  };

  const handleNewEquipmentAdded = (equipmentId: string) => {
    console.log('🎯 New equipment added:', equipmentId);
    onSelect(equipmentId);
  };

  return (
    <>
      <AddEquipmentDialog 
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onEquipmentAdded={handleNewEquipmentAdded}
      />
      <div className="space-y-2">
        {/* Botón principal de selección */}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between"
              disabled={isLoading}
            >
              {selectedCount > 0 ? (
                <span>
                  {t('vehicles.selectedEquipmentCount', { count: selectedCount, fallback: `${selectedCount} items selected` })}
                </span>
              ) : (
                t('vehicles.selectEquipment')
              )}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[400px] p-0 max-h-[350px] overflow-y-auto">
            <Command shouldFilter={false}>
              <CommandInput 
                placeholder={t('vehicles.searchEquipment')}
                value={searchTerm}
                onValueChange={setSearchTerm}
              />
              <CommandEmpty>{t('vehicles.noEquipmentFound')}</CommandEmpty>
              <CommandList>
                {Object.entries(safeGroupedEquipment).map(([category, items]) => (
                  <CommandGroup key={category} heading={category}>
                    {Array.isArray(items) && items.map((item) => (
                      <CommandItem
                        key={item.id}
                        value={item.name}
                        onSelect={() => handleSelect(item.id)}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span>{item.name}</span>
                          <Check
                            className={cn(
                              "h-4 w-4",
                              selectedEquipment?.includes(item.id) ? "opacity-100" : "opacity-0"
                            )}
                          />
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                ))}
              </CommandList>
              <div className="p-2 border-t">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setOpen(false)}
                  className="w-full"
                >
                  {t('common.done', { fallback: 'Done' })}
                </Button>
              </div>
            </Command>
          </PopoverContent>
        </Popover>
        
        {/* Botón "Agregar nuevo" VISIBLE siempre fuera del popover */}
        <Button 
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setShowAddDialog(true)}
          className="w-full gap-2"
        >
          <Plus className="h-4 w-4" />
          {t('vehicles.addNewEquipment')}
        </Button>
      </div>
    </>
  );
};
