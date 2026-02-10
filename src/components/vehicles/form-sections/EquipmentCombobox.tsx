import React, { useState } from 'react';
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
import { useVehicleOptions } from '@/hooks/useVehicleOptions';
import { AddEquipmentDialog } from './AddEquipmentDialog';

interface EquipmentComboboxProps {
  onSelect: (optionKey: string) => void;
  selectedEquipment?: string[];
}

// Category label translations
const CATEGORY_LABELS: Record<string, Record<string, string>> = {
  safety: { es: 'Seguridad', en: 'Safety', fr: 'Sécurité', de: 'Sicherheit', it: 'Sicurezza', pt: 'Segurança', nl: 'Veiligheid', pl: 'Bezpieczeństwo', ro: 'Siguranță' },
  assistance: { es: 'Asistencia', en: 'Assistance', fr: 'Assistance', de: 'Assistenz', it: 'Assistenza', pt: 'Assistência', nl: 'Assistentie', pl: 'Asystent', ro: 'Asistență' },
  comfort: { es: 'Confort', en: 'Comfort', fr: 'Confort', de: 'Komfort', it: 'Comfort', pt: 'Conforto', nl: 'Comfort', pl: 'Komfort', ro: 'Confort' },
  infotainment: { es: 'Infoentretenimiento', en: 'Infotainment', fr: 'Infodivertissement', de: 'Infotainment', it: 'Infotainment', pt: 'Infoentretenimento', nl: 'Infotainment', pl: 'Infotainment', ro: 'Infotainment' },
  interior: { es: 'Interior', en: 'Interior', fr: 'Intérieur', de: 'Innenraum', it: 'Interni', pt: 'Interior', nl: 'Interieur', pl: 'Wnętrze', ro: 'Interior' },
  exterior: { es: 'Exterior', en: 'Exterior', fr: 'Extérieur', de: 'Exterieur', it: 'Esterno', pt: 'Exterior', nl: 'Exterieur', pl: 'Nadwozie', ro: 'Exterior' },
  lighting: { es: 'Iluminación', en: 'Lighting', fr: 'Éclairage', de: 'Beleuchtung', it: 'Illuminazione', pt: 'Iluminação', nl: 'Verlichting', pl: 'Oświetlenie', ro: 'Iluminare' },
  climate: { es: 'Climatización', en: 'Climate', fr: 'Climatisation', de: 'Klima', it: 'Climatizzazione', pt: 'Climatização', nl: 'Klimaat', pl: 'Klimatyzacja', ro: 'Climatizare' },
  seats: { es: 'Asientos', en: 'Seats', fr: 'Sièges', de: 'Sitze', it: 'Sedili', pt: 'Bancos', nl: 'Stoelen', pl: 'Fotele', ro: 'Scaune' },
  security: { es: 'Seguridad', en: 'Security', fr: 'Sécurité', de: 'Sicherung', it: 'Sicurezza', pt: 'Segurança', nl: 'Beveiliging', pl: 'Zabezpieczenia', ro: 'Securitate' },
  driving: { es: 'Conducción', en: 'Driving', fr: 'Conduite', de: 'Fahrdynamik', it: 'Guida', pt: 'Condução', nl: 'Rijdynamiek', pl: 'Jazda', ro: 'Conducere' },
  performance: { es: 'Rendimiento', en: 'Performance', fr: 'Performance', de: 'Leistung', it: 'Prestazioni', pt: 'Desempenho', nl: 'Prestaties', pl: 'Osiągi', ro: 'Performanță' },
  others: { es: 'Otros', en: 'Others', fr: 'Autres', de: 'Sonstiges', it: 'Altro', pt: 'Outros', nl: 'Overig', pl: 'Inne', ro: 'Altele' },
};

export const EquipmentCombobox = ({ onSelect, selectedEquipment = [] }: EquipmentComboboxProps) => {
  const { t, currentLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);

  const { groupedOptions, isLoading } = useVehicleOptions();

  // Get translated category label
  const getCategoryLabel = (categoryKey: string): string => {
    return CATEGORY_LABELS[categoryKey]?.[currentLanguage] || 
           CATEGORY_LABELS[categoryKey]?.['en'] || 
           categoryKey;
  };

  // Filter options based on search term
  const filteredGroups = React.useMemo(() => {
    if (!searchTerm) return groupedOptions;

    const filtered: Record<string, typeof groupedOptions[string]> = {};
    Object.entries(groupedOptions).forEach(([category, items]) => {
      const filteredItems = items.filter(item =>
        item.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.key.toLowerCase().includes(searchTerm.toLowerCase())
      );
      if (filteredItems.length > 0) {
        filtered[category] = filteredItems;
      }
    });
    return filtered;
  }, [groupedOptions, searchTerm]);

  const selectedCount = selectedEquipment.length;

  const handleSelect = (optionKey: string) => {
    onSelect(optionKey);
  };

  const handleNewEquipmentAdded = (equipmentId: string) => {
    console.log('🎯 New custom equipment added:', equipmentId);
    onSelect(equipmentId);
  };

  // Define category display order
  const categoryOrder = ['safety', 'assistance', 'comfort', 'infotainment', 'interior', 'exterior', 'lighting', 'climate', 'seats', 'security', 'driving', 'performance', 'others'];

  const sortedCategories = Object.keys(filteredGroups).sort((a, b) => {
    const indexA = categoryOrder.indexOf(a);
    const indexB = categoryOrder.indexOf(b);
    return (indexA === -1 ? 99 : indexA) - (indexB === -1 ? 99 : indexB);
  });

  return (
    <>
      <AddEquipmentDialog 
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onEquipmentAdded={handleNewEquipmentAdded}
      />
      <div className="space-y-2">
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
                {sortedCategories.map((category) => (
                  <CommandGroup key={category} heading={getCategoryLabel(category)}>
                    {filteredGroups[category].map((item) => (
                      <CommandItem
                        key={item.key}
                        value={item.label}
                        onSelect={() => handleSelect(item.key)}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span>{item.label}</span>
                          <Check
                            className={cn(
                              "h-4 w-4",
                              selectedEquipment?.includes(item.key) ? "opacity-100" : "opacity-0"
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
