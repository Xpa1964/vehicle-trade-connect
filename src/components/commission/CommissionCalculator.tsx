
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calculator, Euro, Percent } from 'lucide-react';
import { useCommissionCalculator } from '@/hooks/useCommissionCalculator';
import { CommissionType } from '@/utils/commissionUtils';
import { formatCurrencyCommission, formatPercentage } from '@/utils/commissionUtils';
import { Separator } from '@/components/ui/separator';
import { useLanguage } from '@/contexts/LanguageContext';
import HighlightBox from '@/components/shared/HighlightBox';

interface CommissionCalculatorProps {
  initialPrice?: number;
  initialType?: CommissionType;
  compact?: boolean;
  showTitle?: boolean;
}

const CommissionCalculator: React.FC<CommissionCalculatorProps> = ({
  initialPrice = 0,
  initialType = 'comprador',
  compact = false,
  showTitle = true,
}) => {
  const { t } = useLanguage();
  const { price, type, result, updatePrice, updateType, allowedTypes } = useCommissionCalculator({
    initialPrice,
    initialType,
  });

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    updatePrice(value);
  };

  const handleTypeChange = (newType: string) => {
    updateType(newType as CommissionType);
  };

  if (compact) {
    return (
      <HighlightBox variant="orange" className="w-full">
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-3">
            <Calculator className="h-4 w-4 text-brand-orange" />
            <span className="font-heading font-semibold text-sm text-foreground">{t('commission.title')}</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="price-compact" className="text-xs font-medium text-neutral-700">
                {t('commission.vehiclePrice')} (€)
              </Label>
              <Input
                id="price-compact"
                type="number"
                value={price || ''}
                onChange={handlePriceChange}
                placeholder={t('commission.example')}
                className="h-8 border-neutral-200 focus:border-brand-orange"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-xs font-medium text-neutral-700">{t('commission.operationType')}</Label>
              {allowedTypes.length < 3 && (
                <p className="text-xs text-muted-foreground mb-1">
                  {t('commission.filteredByProfile')}
                </p>
              )}
              <RadioGroup value={type} onValueChange={handleTypeChange} className="flex gap-3">
                {allowedTypes.includes('comprador') && (
                  <div className="flex items-center space-x-1">
                    <RadioGroupItem value="comprador" id="comprador-compact" className="h-3 w-3" />
                    <Label htmlFor="comprador-compact" className="text-xs text-neutral-700">{t('commission.buyer')}</Label>
                  </div>
                )}
                {allowedTypes.includes('vendedor') && (
                  <div className="flex items-center space-x-1">
                    <RadioGroupItem value="vendedor" id="vendedor-compact" className="h-3 w-3" />
                    <Label htmlFor="vendedor-compact" className="text-xs text-neutral-700">{t('commission.seller')}</Label>
                  </div>
                )}
                {allowedTypes.includes('trader') && (
                  <div className="flex items-center space-x-1">
                    <RadioGroupItem value="trader" id="trader-compact" className="h-3 w-3" />
                    <Label htmlFor="trader-compact" className="text-xs text-neutral-700">{t('commission.trader')}</Label>
                  </div>
                )}
              </RadioGroup>
            </div>
          </div>

          <Separator className="bg-neutral-200" />
          <div className="bg-white/70 p-3 rounded-lg border border-neutral-100 space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-neutral-600 font-body">{t('commission.commissionAmount')} ({formatPercentage(result.commissionPercentage)}):</span>
              <span className="font-semibold text-neutral-900">{formatCurrencyCommission(result.commissionAmount)}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-neutral-600 font-body">{t('commission.maintenanceFee')}:</span>
              <span className="font-semibold text-neutral-900">{formatCurrencyCommission(result.maintenanceFee)}</span>
            </div>
            <Separator className="bg-neutral-200" />
            <div className="flex justify-between items-center text-sm">
              <span className="font-heading font-semibold text-neutral-900">{t('commission.totalCosts')}:</span>
              <span className="font-heading font-bold text-brand-orange text-base">{formatCurrencyCommission(result.totalCost)}</span>
            </div>
          </div>
        </div>
      </HighlightBox>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      {showTitle && (
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-blue-600" />
            {t('commission.title')}
          </CardTitle>
          <p className="text-sm text-gray-600">
            {t('commission.description')}
          </p>
        </CardHeader>
      )}
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="price" className="text-sm font-medium flex items-center gap-1">
              <Euro className="h-4 w-4" />
              {t('commission.vehiclePrice')} (€)
            </Label>
            <Input
              id="price"
              type="number"
              value={price || ''}
              onChange={handlePriceChange}
              placeholder={t('commission.example')}
              className="text-lg"
            />
          </div>
          
          <div className="space-y-3">
            <Label className="text-sm font-medium">{t('commission.operationType')}</Label>
            {allowedTypes.length < 3 && (
              <p className="text-xs text-muted-foreground">
                {t('commission.filteredByProfile')}
              </p>
            )}
            <RadioGroup value={type} onValueChange={handleTypeChange} className="grid grid-cols-3 gap-4">
              {allowedTypes.includes('comprador') && (
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="comprador" id="comprador" />
                  <Label htmlFor="comprador" className="cursor-pointer">{t('commission.buyer')}</Label>
                </div>
              )}
              {allowedTypes.includes('vendedor') && (
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="vendedor" id="vendedor" />
                  <Label htmlFor="vendedor" className="cursor-pointer">{t('commission.seller')}</Label>
                </div>
              )}
              {allowedTypes.includes('trader') && (
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="trader" id="trader" />
                  <Label htmlFor="trader" className="cursor-pointer">{t('commission.trader')}</Label>
                </div>
              )}
            </RadioGroup>
          </div>
        </div>

        <Separator />
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-100">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Percent className="h-5 w-5 text-blue-600" />
            {t('commission.costSummary')}
          </h3>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">{t('commission.basePrice')}:</span>
              <span className="font-medium">{formatCurrencyCommission(result.vehiclePrice)}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-700">
                {t('commission.commissionAmount')} ({formatPercentage(result.commissionPercentage)}):
              </span>
              <span className="font-medium">{formatCurrencyCommission(result.commissionAmount)}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-700">{t('commission.maintenanceFee')}:</span>
              <span className="font-medium">{formatCurrencyCommission(result.maintenanceFee)}</span>
            </div>
            
            <Separator />
            
            <div className="flex justify-between items-center text-lg font-bold">
              <span>{t('commission.totalCosts')} {type}:</span>
              <span className="text-blue-600">{formatCurrencyCommission(result.totalCost)}</span>
            </div>
          </div>
        </div>
        
        <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-md">
          <p className="font-medium mb-1">{t('commission.importantInfo')}:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>{t('commission.minCommissionInfo')}</li>
            <li>{t('commission.maxPriceInfo')}</li>
            <li>{t('commission.traderInfo')}</li>
            <li>{t('commission.maintenanceInfo')}</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default CommissionCalculator;
