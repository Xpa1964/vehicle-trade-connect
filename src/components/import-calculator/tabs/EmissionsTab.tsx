
import React, { memo } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { AlertCircle } from 'lucide-react';
import { MATRICULATION_TAX_RATES } from '../useImportCalculator';

interface EmissionsTabProps {
  co2Emissions: number;
  setCo2Emissions: (emissions: number) => void;
}

// Create an array representation of the tax rates for rendering
const taxRateBrackets = [
  { maxEmission: 0, rate: MATRICULATION_TAX_RATES['0'] },
  { maxEmission: 120, rate: MATRICULATION_TAX_RATES['120'] },
  { maxEmission: 160, rate: MATRICULATION_TAX_RATES['160'] },
  { maxEmission: 200, rate: MATRICULATION_TAX_RATES['200'] },
  { maxEmission: Infinity, rate: MATRICULATION_TAX_RATES['over200'] }
];

const EmissionsTab: React.FC<EmissionsTabProps> = memo(({
  co2Emissions,
  setCo2Emissions
}) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <div className="flex justify-between items-center mb-3 sm:mb-2">
          <Label htmlFor="co2Emissions" className="text-sm sm:text-base">
            {t('calculator.emissions.co2', { fallback: 'CO2 emissions (g/km)' })}
          </Label>
          <span className="text-sm font-medium bg-gray-100 px-2 py-1 rounded">
            {co2Emissions} g/km
          </span>
        </div>
        <Slider
          id="co2Emissions"
          min={0}
          max={300}
          step={1}
          value={[co2Emissions]}
          onValueChange={(values) => setCo2Emissions(values[0])}
          className="touch-manipulation"
        />
      </div>
      
      <Card className="bg-gray-50">
        <CardContent className="pt-4 sm:pt-6">
          <div className="flex items-center gap-2 mb-3 sm:mb-2">
            <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500 flex-shrink-0" />
            <h4 className="font-medium text-sm sm:text-base">
              {t('calculator.emissions.taxRate', { fallback: 'Applicable registration tax' })}
            </h4>
          </div>
          
          <div className="space-y-1 text-xs sm:text-sm">
            {taxRateBrackets.map((bracket, index) => {
              // Determine range label
              let rangeLabel;
              if (index === 0) {
                rangeLabel = `${bracket.maxEmission} g/km`;
              } else if (bracket.maxEmission === Infinity) {
                rangeLabel = `> ${taxRateBrackets[index - 1].maxEmission} g/km`;
              } else {
                rangeLabel = `${taxRateBrackets[index - 1].maxEmission + 1} - ${bracket.maxEmission} g/km`;
              }
              
              // Determine if this range is the current applicable one
              const isCurrentRange = 
                index === 0 ? 
                  co2Emissions === 0 : 
                  co2Emissions > (index > 0 ? taxRateBrackets[index - 1].maxEmission : 0) && 
                  co2Emissions <= bracket.maxEmission;
                
              return (
                <div 
                  key={index} 
                  className={`flex justify-between py-2 px-3 rounded transition-colors ${
                    isCurrentRange ? 'bg-blue-100 text-blue-800 font-medium' : 'hover:bg-gray-100'
                  }`}
                >
                  <span>{rangeLabel}</span>
                  <span className="font-medium">{bracket.rate}%</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
});

EmissionsTab.displayName = 'EmissionsTab';

export default EmissionsTab;
