
import React, { memo } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Building2, Truck, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ServicesTabProps {
  useAgency: boolean;
  includeTransport: boolean;
  setUseAgency: (use: boolean) => void;
  setIncludeTransport: (include: boolean) => void;
}

const ServicesTab: React.FC<ServicesTabProps> = memo(({
  useAgency,
  includeTransport,
  setUseAgency,
  setIncludeTransport
}) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center space-x-3 py-2">
        <Switch
          id="useAgency"
          checked={useAgency}
          onCheckedChange={setUseAgency}
        />
        <Label htmlFor="useAgency" className="flex items-center gap-2 text-sm sm:text-base flex-1">
          <Building2 className="h-4 w-4" />
          {t('calculator.services.agency', { fallback: 'Hire agency services' })}
        </Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-4 w-4 text-gray-400 touch-manipulation" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p>{t('calculator.services.agencyTooltip', { fallback: 'Includes management of administrative procedures' })}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <div className="flex items-center space-x-3 py-2">
        <Switch
          id="includeTransport"
          checked={includeTransport}
          onCheckedChange={setIncludeTransport}
        />
        <Label htmlFor="includeTransport" className="flex items-center gap-2 text-sm sm:text-base flex-1">
          <Truck className="h-4 w-4" />
          {t('calculator.services.transport', { fallback: 'Include transport' })}
        </Label>
      </div>
    </div>
  );
});

ServicesTab.displayName = 'ServicesTab';

export default ServicesTab;
