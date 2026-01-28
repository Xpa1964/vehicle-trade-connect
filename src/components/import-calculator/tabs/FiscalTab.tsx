
import React, { memo } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Info, FileText } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface FiscalTabProps {
  price: number;
  includesVAT: boolean;
  ivtmTax: number;
  setPrice: (price: number) => void;
  setIncludesVAT: (includes: boolean) => void;
  setIvtmTax: (tax: number) => void;
}

const FiscalTab: React.FC<FiscalTabProps> = memo(({
  price,
  includesVAT,
  ivtmTax,
  setPrice,
  setIncludesVAT,
  setIvtmTax
}) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <Label htmlFor="price" className="text-sm sm:text-base">
          {t('calculator.fiscal.price', { fallback: 'Vehicle price (€)' })}
        </Label>
        <Input
          id="price"
          type="number"
          value={price || ''}
          onChange={(e) => setPrice(Number(e.target.value))}
          className="mt-1 h-11 sm:h-10"
        />
      </div>
      
      <div className="flex items-center space-x-3 py-2">
        <Switch
          id="includesVAT"
          checked={includesVAT}
          onCheckedChange={setIncludesVAT}
        />
        <Label htmlFor="includesVAT" className="text-sm sm:text-base flex-1">
          {t('calculator.fiscal.includesVAT', { fallback: 'Price includes VAT' })}
        </Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-4 w-4 text-gray-400 touch-manipulation" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p>{t('calculator.fiscal.vatTooltip', { fallback: 'For intra-community B2B operations, VAT is self-assessed in Spain' })}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div>
        <Label htmlFor="ivtmTax" className="flex items-center gap-2 text-sm sm:text-base mb-2">
          <FileText className="h-4 w-4" />
          {t('calculator.fiscal.ivtmTax', { fallback: 'Circulation tax (IVTM) (€)' })}
        </Label>
        <div className="flex items-center gap-2">
          <Input
            id="ivtmTax"
            type="number"
            value={ivtmTax || ''}
            onChange={(e) => setIvtmTax(Number(e.target.value))}
            className="h-11 sm:h-10"
          />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-gray-400 touch-manipulation flex-shrink-0" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>{t('calculator.fiscal.ivtmTooltip', { fallback: 'Annual municipal tax varies by vehicle power and municipality. Typically ranges from 30€ to 200€.' })}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
});

FiscalTab.displayName = 'FiscalTab';

export default FiscalTab;
