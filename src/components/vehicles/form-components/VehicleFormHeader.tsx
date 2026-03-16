
import React from 'react';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import orangeLogo from '@/assets/kontact-vo-logo-orange-2.png';

interface VehicleFormHeaderProps {
  isEditing: boolean;
}

export const VehicleFormHeader: React.FC<VehicleFormHeaderProps> = ({ isEditing }) => {
  const { t } = useLanguage();

  return (
    <CardHeader className="border-b">
      <div className="flex items-center gap-4 md:gap-6">
        {/* Logo KONTACT naranja */}
        <img 
          src={orangeLogo}
          alt="KONTACT VO Logo" 
          className="h-12 md:h-16 lg:h-20 w-auto object-contain flex-shrink-0"
        />
        
        {/* Títulos */}
        <div className="flex-1 min-w-0">
          <CardTitle className="text-lg md:text-xl lg:text-2xl text-left font-bold">
            {isEditing ? t('vehicles.editVehicle') : t('vehicles.publishNewVehicle')}
          </CardTitle>
          <CardDescription className="text-xs md:text-sm lg:text-base text-left mt-1">
            {t('vehicles.completeVehicleDetails')}
          </CardDescription>
        </div>
      </div>
    </CardHeader>
  );
};
