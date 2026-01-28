
import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface StatusFilterProps {
  status: string;
  setStatus: (status: string) => void;
}

const StatusFilter: React.FC<StatusFilterProps> = ({ status, setStatus }) => {
  const { t } = useLanguage();
  
  return (
    <Collapsible defaultOpen>
      <CollapsibleTrigger className="flex items-center justify-between w-full p-1 hover:bg-gray-50 rounded">
        <Label className="text-xs font-medium">{t('filters.vehicleStatus')}</Label>
        <ChevronDown className="h-3 w-3" />
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-2 pt-1">
        <RadioGroup value={status} onValueChange={setStatus}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="all" id="status-all" className="w-3 h-3" />
            <Label htmlFor="status-all" className="text-xs">{t('filters.statusAll')}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="available" id="status-available" className="w-3 h-3" />
            <Label htmlFor="status-available" className="text-xs">{t('filters.statusAvailable')}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="reserved" id="status-reserved" className="w-3 h-3" />
            <Label htmlFor="status-reserved" className="text-xs">{t('filters.statusReserved')}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="sold" id="status-sold" className="w-3 h-3" />
            <Label htmlFor="status-sold" className="text-xs">{t('filters.statusSold')}</Label>
          </div>
        </RadioGroup>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default StatusFilter;
