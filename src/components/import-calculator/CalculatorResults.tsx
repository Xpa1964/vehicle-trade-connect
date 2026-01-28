
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';
import { ADMIN_COSTS } from './useImportCalculator';
import type { CalculationResults } from './useImportCalculator';

interface CalculatorResultsProps {
  results: CalculationResults;
  useAgency: boolean;
  includeTransport: boolean;
}

const CalculatorResults: React.FC<CalculatorResultsProps> = ({ results, useAgency, includeTransport }) => {
  const { t } = useLanguage();
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('calculator.results.title', { fallback: 'Cost Summary' })}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">{t('calculator.results.netPrice', { fallback: 'Net price' })}</span>
            <span className="font-medium">{formatCurrency(results.netPrice)}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1">
              <span className="text-gray-600">{t('calculator.results.vat', { fallback: 'VAT (21%)' })}</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{t('calculator.results.vatInfo', { fallback: 'Self-assessed VAT in Spain for B2B operations' })}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <span className="font-medium">{formatCurrency(results.vatCost)}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1">
              <span className="text-gray-600">{t('calculator.results.matriculation', { fallback: 'Registration tax' })}</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{t('calculator.results.matriculationInfo', { fallback: 'Based on CO2 emissions' })}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <span className="font-medium">{formatCurrency(results.matriculationTax)}</span>
          </div>
          
          {/* Desglose detallado de costes administrativos */}
          <div className="flex justify-between items-center">
            <span className="text-gray-600">{t('calculator.results.adminCostsTitle', { fallback: 'Administrative costs' })}</span>
            <span className="font-medium">{formatCurrency(results.adminCosts)}</span>
          </div>
          
          <div className="ml-6 space-y-2 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-gray-500">{t('calculator.results.dgtFee', { fallback: 'DGT Registration fee' })}</span>
              <span>{formatCurrency(ADMIN_COSTS.dgtFee)}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-500">{t('calculator.results.technicalSheet', { fallback: 'Technical data sheet' })}</span>
              <span>{formatCurrency(ADMIN_COSTS.technicalSheet)}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-500">{t('calculator.results.itv', { fallback: 'Import vehicle inspection' })}</span>
              <span>{formatCurrency(ADMIN_COSTS.itv)}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-500">{t('calculator.results.trafficFee', { fallback: 'Traffic fee (circulation permit)' })}</span>
              <span>{formatCurrency(ADMIN_COSTS.trafficFee)}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1">
                <span className="text-gray-500">{t('calculator.results.ivtm', { fallback: 'Circulation tax (IVTM)' })}</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-4 w-4 text-gray-400" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{t('calculator.results.ivtmInfo', { fallback: 'Annual municipal tax (varies by power and location)' })}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <span>{formatCurrency(results.ivtmTax)}</span>
            </div>
          </div>
          
          {useAgency && (
            <div className="flex justify-between items-center">
              <span className="text-gray-600">{t('calculator.results.agency', { fallback: 'Agency services' })}</span>
              <span className="font-medium">{formatCurrency(results.agencyCost)}</span>
            </div>
          )}
          
          {includeTransport && (
            <div className="flex justify-between items-center">
              <span className="text-gray-600">{t('calculator.results.transport', { fallback: 'Transport' })}</span>
              <span className="font-medium">{formatCurrency(results.transportCost)}</span>
            </div>
          )}
          
          <Separator />
          
          <div className="flex justify-between items-center text-lg font-bold">
            <span>{t('calculator.results.total', { fallback: 'Total cost' })}</span>
            <span>{formatCurrency(results.totalCost)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CalculatorResults;
