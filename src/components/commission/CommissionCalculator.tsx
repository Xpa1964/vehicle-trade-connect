
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
            <Calculator className="h-4 w-4 text-primary" />
            <span className="font-heading font-semibold text-sm text-foreground">{t('commission.title')}</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="price-compact" className="text-xs font-medium text-muted-foreground">
                {t('commission.vehiclePrice')} (€)
              </Label>
              <Input
                id="price-compact"
                type="number"
                value={price || ''}
                onChange={handlePriceChange}
                placeholder={t('commission.example')}
                className="h-8 bg-card border-border text-foreground focus:border-primary"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">{t('commission.operationType')}</Label>
              {allowedTypes.length < 3 && (
                <p className="text-xs text-muted-foreground mb-1">
                  {t('commission.filteredByProfile')}
                </p>
              )}
              <RadioGroup value={type} onValueChange={handleTypeChange} className="flex flex-col gap-1.5">
                {allowedTypes.includes('comprador') && (
                  <div className="flex items-center space-x-1">
                    <RadioGroupItem value="comprador" id="comprador-compact" className="h-3 w-3 flex-shrink-0" />
                    <Label htmlFor="comprador-compact" className="text-xs text-foreground truncate">{t('commission.buyer')}</Label>
                  </div>
                )}
                {allowedTypes.includes('vendedor') && (
                  <div className="flex items-center space-x-1">
                    <RadioGroupItem value="vendedor" id="vendedor-compact" className="h-3 w-3 flex-shrink-0" />
                    <Label htmlFor="vendedor-compact" className="text-xs text-foreground truncate">{t('commission.seller')}</Label>
                  </div>
                )}
              </RadioGroup>
            </div>
          </div>

          <Separator className="bg-border" />
          <div className="bg-secondary p-3 rounded-lg border border-border space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground font-body">{t('commission.commissionAmount')} ({formatPercentage(result.commissionPercentage)}):</span>
              <span className="font-semibold text-foreground">{formatCurrencyCommission(result.commissionAmount)}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground font-body">{t('commission.maintenanceFee')}:</span>
              <span className="font-semibold text-foreground">{formatCurrencyCommission(result.maintenanceFee)}</span>
            </div>
            <Separator className="bg-border" />
            <div className="flex justify-between items-center text-sm">
              <span className="font-heading font-semibold text-foreground">{t('commission.totalCosts')}:</span>
              <span className="font-heading font-bold text-primary text-base">{formatCurrencyCommission(result.totalCost)}</span>
            </div>
          </div>
        </div>
      </HighlightBox>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto bg-card border-border">
      {showTitle && (
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Calculator className="h-5 w-5 text-primary" />
            {t('commission.title')}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {t('commission.description')}
          </p>
        </CardHeader>
      )}
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="price" className="text-sm font-medium text-foreground flex items-center gap-1">
              <Euro className="h-4 w-4 text-muted-foreground" />
              {t('commission.vehiclePrice')} (€)
            </Label>
            <Input
              id="price"
              type="number"
              value={price || ''}
              onChange={handlePriceChange}
              placeholder={t('commission.example')}
              className="text-lg bg-card border-border text-foreground"
            />
          </div>
          
          <div className="space-y-3">
            <Label className="text-sm font-medium text-foreground">{t('commission.operationType')}</Label>
            {allowedTypes.length < 3 && (
              <p className="text-xs text-muted-foreground">
                {t('commission.filteredByProfile')}
              </p>
            )}
            <RadioGroup value={type} onValueChange={handleTypeChange} className="flex flex-col sm:flex-row sm:flex-wrap gap-3">
              {allowedTypes.includes('comprador') && (
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="comprador" id="comprador" />
                  <Label htmlFor="comprador" className="cursor-pointer text-foreground">{t('commission.buyer')}</Label>
                </div>
              )}
              {allowedTypes.includes('vendedor') && (
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="vendedor" id="vendedor" />
                  <Label htmlFor="vendedor" className="cursor-pointer text-foreground">{t('commission.seller')}</Label>
                </div>
              )}
            </RadioGroup>
          </div>
        </div>

        <Separator className="bg-border" />
        <div className="bg-primary/10 p-6 rounded-lg border border-primary/30">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-foreground">
            <Percent className="h-5 w-5 text-primary" />
            {t('commission.costSummary')}
          </h3>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">{t('commission.basePrice')}:</span>
              <span className="font-medium text-foreground">{formatCurrencyCommission(result.vehiclePrice)}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">
                {t('commission.commissionAmount')} ({formatPercentage(result.commissionPercentage)}):
              </span>
              <span className="font-medium text-foreground">{formatCurrencyCommission(result.commissionAmount)}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">{t('commission.maintenanceFee')}:</span>
              <span className="font-medium text-foreground">{formatCurrencyCommission(result.maintenanceFee)}</span>
            </div>
            
            <Separator className="bg-border" />
            
            <div className="flex justify-between items-center text-lg font-bold">
              <span className="text-foreground">{t('commission.totalCosts')} {type === 'comprador' ? t('commission.buyer') : t('commission.seller')}:</span>
              <span className="text-primary">{formatCurrencyCommission(result.totalCost)}</span>
            </div>
          </div>
        </div>
        
        <div className="text-xs text-muted-foreground bg-secondary p-3 rounded-md border border-border">
          <p className="font-medium mb-1 text-foreground">{t('commission.importantInfo')}:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>{t('commission.minCommissionInfo')}</li>
            <li>{t('commission.maxPriceInfo')}</li>
            
            <li>{t('commission.maintenanceInfo')}</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default CommissionCalculator;
