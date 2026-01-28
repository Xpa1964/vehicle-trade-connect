
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { useLanguage } from '@/contexts/LanguageContext';
import { UseFormReturn } from 'react-hook-form';
import { VehicleFormData } from '@/types/vehicle';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { HelpCircle, Euro } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface TransactionDetailsProps {
  form: UseFormReturn<VehicleFormData>;
}

export const TransactionDetails: React.FC<TransactionDetailsProps> = ({ form }) => {
  const { t } = useLanguage();
  const commissionSaleValue = form.watch('commissionSale');

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold">{t('vehicles.transactionDetails')}</h3>
      
      {/* Exchange and Commission Sales - moved up */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-blue-50 rounded-lg">
        <FormField
          control={form.control}
          name="acceptsExchange"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value || false}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="text-sm font-medium">
                  {t('vehicles.acceptExchange')}
                </FormLabel>
              </div>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="commissionSale"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value || false}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="text-sm font-medium flex items-center gap-2">
                  {t('vehicles.commissionSale')}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p className="text-sm">
                          {t('vehicles.commissionSaleDescription')}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </FormLabel>
              </div>
            </FormItem>
          )}
        />
      </div>

      {/* Campos condicionales para Venta Comisionada */}
      {commissionSaleValue && (
        <div className="space-y-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
          <div className="flex items-center gap-2 mb-4">
            <Euro className="h-5 w-5 text-purple-600" />
            <h4 className="text-md font-medium text-purple-800">{t('vehicles.commissionSaleTitle')}</h4>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="publicSalePrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('vehicles.publicSalePrice')}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder={t('vehicles.priceExample')}
                      value={field.value || ''}
                      onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="commissionAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('vehicles.commissionAmount')}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder={t('vehicles.commissionExample')}
                      value={field.value || ''}
                      onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="commissionQuery"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('vehicles.consultQuery')}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={t('vehicles.commissionAdditionalInfo')}
                    className="min-h-[80px]"
                    value={field.value || ''}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      )}
      
      <FormField
        control={form.control}
        name="transactionType"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>{t('vehicles.transactionType')}</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                value={field.value || 'national'}
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="national" id="national" />
                  <FormLabel htmlFor="national">{t('vehicles.national')}</FormLabel>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="import" id="import" />
                  <FormLabel htmlFor="import">{t('vehicles.import')}</FormLabel>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="export" id="export" />
                  <FormLabel htmlFor="export">{t('vehicles.export')}</FormLabel>
                </div>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="ivaStatus"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('vehicles.ivaStatus')}</FormLabel>
            <Select 
              value={field.value || 'included'} 
              onValueChange={field.onChange}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="included">{t('vehicles.ivaIncluded')}</SelectItem>
                <SelectItem value="notIncluded">{t('vehicles.ivaNotIncluded')}</SelectItem>
                <SelectItem value="deductible">{t('vehicles.ivaDeductible')}</SelectItem>
                <SelectItem value="rebu">{t('vehicles.ivaRebu')}</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
          )}
        />
    </div>
  );
};
