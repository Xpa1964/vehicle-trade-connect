
import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useEquipmentTranslation } from '@/utils/equipmentTranslation';

interface EquipmentItem {
  id: string;
  name: string;
  standard_name?: string;
}

interface EquipmentCategory {
  categoryName: string;
  items: EquipmentItem[];
}

interface EquipmentCategoryListProps {
  equipmentByCategory: Record<string, EquipmentCategory>;
}

export const EquipmentCategoryList: React.FC<EquipmentCategoryListProps> = ({ 
  equipmentByCategory 
}) => {
  const { t } = useLanguage();
  const getEquipmentName = useEquipmentTranslation();
  const noEquipment = Object.keys(equipmentByCategory).length === 0;

  if (noEquipment) {
    return (
      <div className="text-center py-8 text-gray-500">
        {t('vehicles.equipmentNotAvailable')}
      </div>
    );
  }

  return (
    <>
      {Object.values(equipmentByCategory).map((category, index) => (
        <div key={index} className="mb-6">
          <h3 className="text-lg font-bold mb-2">{category.categoryName}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {category.items.map((item) => {
              return (
                <div key={item.id} className="flex items-center p-2 border rounded-md">
                  <CheckCircle2 className="w-5 h-5 mr-2 text-green-500" />
                  <span>{getEquipmentName(item.standard_name, item.name)}</span>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </>
  );
};
