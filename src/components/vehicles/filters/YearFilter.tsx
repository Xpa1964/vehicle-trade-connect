
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface YearFilterProps {
  yearMin: number;
  yearMax: number;
  setYearMin: (year: number) => void;
  setYearMax: (year: number) => void;
  onYearRangeChange: (values: number[]) => void;
}

const YearFilter: React.FC<YearFilterProps> = ({
  yearMin,
  yearMax,
  setYearMin,
  setYearMax,
  onYearRangeChange
}) => {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <Collapsible defaultOpen>
      <CollapsibleTrigger className="flex items-center justify-between w-full p-1 hover:bg-gray-50 rounded">
        <Label className="text-xs font-medium">{t('filters.year')}</Label>
        <ChevronDown className="h-3 w-3" />
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-3 pt-1">
        <div className="px-1">
          <Slider
            value={[yearMin, yearMax]}
            onValueChange={onYearRangeChange}
            max={currentYear}
            min={2000}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>{yearMin}</span>
            <span>{yearMax}</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-1">
          <div>
            <Label className="text-xs">{t('filters.minimum')}</Label>
            <Input
              type="number"
              value={yearMin}
              onChange={(e) => setYearMin(Number(e.target.value))}
              className="text-xs h-7"
              min={2000}
              max={currentYear}
            />
          </div>
          <div>
            <Label className="text-xs">{t('filters.maximum')}</Label>
            <Input
              type="number"
              value={yearMax}
              onChange={(e) => setYearMax(Number(e.target.value))}
              className="text-xs h-7"
              min={2000}
              max={currentYear}
            />
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default YearFilter;
