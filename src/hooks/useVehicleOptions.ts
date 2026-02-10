import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { useMemo } from 'react';

export interface VehicleOption {
  id: string;
  key: string;
  name: string; // fallback English name
  label: string; // translated label
  category: string;
  categoryName: string;
  active: boolean;
}

export interface GroupedVehicleOptions {
  [category: string]: VehicleOption[];
}

/**
 * Hook to fetch vehicle equipment options with translated labels
 * based on the current language context.
 * Options are stored by `key` (snake_case), never by UUID or translated text.
 */
export const useVehicleOptions = () => {
  const { currentLanguage } = useLanguage();

  const { data: rawOptions = [], isLoading } = useQuery({
    queryKey: ['vehicle-options-translated', currentLanguage],
    queryFn: async () => {
      // Fetch equipment items with their category and translations in one go
      const { data: items, error: itemsError } = await supabase
        .from('equipment_items')
        .select(`
          id,
          key,
          name,
          active,
          category_id,
          equipment_categories (
            name
          )
        `)
        .eq('active', true)
        .not('key', 'is', null)
        .order('name');

      if (itemsError) {
        console.error('Error fetching equipment items:', itemsError);
        return [];
      }

      if (!items || items.length === 0) return [];

      // Fetch translations for current language
      const itemIds = items.map(i => i.id);
      const { data: translations, error: transError } = await supabase
        .from('vehicle_option_translations')
        .select('option_id, label')
        .eq('language_code', currentLanguage)
        .in('option_id', itemIds);

      if (transError) {
        console.error('Error fetching translations:', transError);
      }

      // Build translation map
      const translationMap = new Map<string, string>();
      if (translations) {
        translations.forEach(t => {
          translationMap.set(t.option_id, t.label);
        });
      }

      // Map items with translated labels
      return items.map(item => ({
        id: item.id,
        key: item.key!,
        name: item.name,
        label: translationMap.get(item.id) || item.name,
        category: item.equipment_categories?.name || 'others',
        categoryName: item.equipment_categories?.name || 'others',
        active: item.active,
      }));
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  // Group options by category
  const groupedOptions = useMemo(() => {
    const groups: GroupedVehicleOptions = {};
    rawOptions.forEach(option => {
      const cat = option.categoryName;
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(option);
    });
    return groups;
  }, [rawOptions]);

  // Helper: get translated label for a key
  const getLabelForKey = (key: string): string => {
    const option = rawOptions.find(o => o.key === key);
    return option?.label || key;
  };

  // Helper: get option by key
  const getOptionByKey = (key: string): VehicleOption | undefined => {
    return rawOptions.find(o => o.key === key);
  };

  // Helper: get option by id
  const getOptionById = (id: string): VehicleOption | undefined => {
    return rawOptions.find(o => o.id === id);
  };

  // Helper: resolve a list of keys to translated labels
  const resolveLabels = (keys: string[]): { key: string; label: string }[] => {
    return keys.map(key => ({
      key,
      label: getLabelForKey(key),
    }));
  };

  return {
    options: rawOptions,
    groupedOptions,
    isLoading,
    getLabelForKey,
    getOptionByKey,
    getOptionById,
    resolveLabels,
  };
};
