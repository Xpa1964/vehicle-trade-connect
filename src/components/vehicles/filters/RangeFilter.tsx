
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface RangeFilterProps {
  title: string;
  min: number;
  max: number;
  minValue: number;
  maxValue: number;
  step: number;
  setMinValue: (value: number) => void;
  setMaxValue: (value: number) => void;
  onRangeChange: (values: number[]) => void;
  formatValue?: (value: number) => string;
  defaultOpen?: boolean;
}

const RangeFilter: React.FC<RangeFilterProps> = ({
  title,
  min,
  max,
  minValue,
  maxValue,
  step,
  setMinValue,
  setMaxValue,
  onRangeChange,
  formatValue = (value) => value.toLocaleString(),
  defaultOpen = true
}) => {
  const { t } = useLanguage();
  
  return (
    <Collapsible defaultOpen={defaultOpen}>
      <CollapsibleTrigger className="flex items-center justify-between w-full p-1 hover:bg-secondary rounded">
        <Label className="text-xs font-medium text-foreground">{title}</Label>
        <ChevronDown className="h-3 w-3 text-muted-foreground" />
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-3 pt-1">
        <div className="px-1">
          <Slider
            value={[minValue, maxValue]}
            onValueChange={onRangeChange}
            max={max}
            min={min}
            step={step}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>{formatValue(minValue)}</span>
            <span>{formatValue(maxValue)}</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-1">
          <div>
            <Label className="text-xs text-foreground">{t('filters.minimum')}</Label>
            <Input
              type="number"
              value={minValue}
              onChange={(e) => setMinValue(Number(e.target.value))}
              className="text-xs h-7 bg-card border-border text-foreground"
            />
          </div>
          <div>
            <Label className="text-xs text-foreground">{t('filters.maximum')}</Label>
            <Input
              type="number"
              value={maxValue}
              onChange={(e) => setMaxValue(Number(e.target.value))}
              className="text-xs h-7 bg-card border-border text-foreground"
            />
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default RangeFilter;
