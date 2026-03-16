
import React from 'react';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import orangeLogo from '@/assets/kontact-vo-logo-orange-2.png';

        
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
