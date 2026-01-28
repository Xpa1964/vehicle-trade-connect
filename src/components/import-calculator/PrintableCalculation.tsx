
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { LOGO_IMAGES } from '@/constants/imageAssets';
import type { CalculationResults } from './useImportCalculator';
import { ADMIN_COSTS } from './useImportCalculator';

interface PrintableCalculationProps {
  results: CalculationResults;
  vehicleType: string;
  isNew: boolean;
  originCountry: string;
  co2Emissions: number;
  useAgency: boolean;
  includeTransport: boolean;
}

const PrintableCalculation: React.FC<PrintableCalculationProps> = ({ 
  results, useAgency, includeTransport 
}) => {
  const { t } = useLanguage();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(value);
  };

  return (
    <div className="bg-white p-8 max-w-4xl mx-auto print:shadow-none">
      {/* Header con logo y título */}
      <div className="flex justify-between items-center mb-8 border-b-2 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Calculadora de Gastos de Importación
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            KONECT VO - Automotive Marketplace
          </p>
        </div>
        <img 
          src={LOGO_IMAGES.primary} 
          alt="KONECT VO Logo" 
          className="h-6 w-auto object-contain" 
        />
      </div>
      
      {/* Resumen de costes */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Resumen de costes
        </h2>
        <div className="border-2 border-gray-200 rounded-lg p-6">
          <table className="w-full">
            <tbody>
              <tr className="border-b border-gray-200">
                <td className="py-3 text-gray-700 font-medium">Precio neto</td>
                <td className="py-3 text-right font-semibold text-gray-800">{formatCurrency(results.netPrice)}</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-3 text-gray-700 font-medium">IVA (21%)</td>
                <td className="py-3 text-right font-semibold text-gray-800">{formatCurrency(results.vatCost)}</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-3 text-gray-700 font-medium">Impuesto de matriculación</td>
                <td className="py-3 text-right font-semibold text-gray-800">{formatCurrency(results.matriculationTax)}</td>
              </tr>
              
              {/* Costes administrativos */}
              <tr className="border-b border-gray-200 bg-gray-50">
                <td className="py-3 font-semibold text-gray-800">Costes administrativos</td>
                <td className="py-3 text-right font-semibold text-gray-800">{formatCurrency(results.adminCosts)}</td>
              </tr>
              
              {/* Desglose de costes administrativos */}
              <tr>
                <td colSpan={2} className="py-2 pl-6">
                  <table className="w-full">
                    <tbody>
                      <tr>
                        <td className="py-1 text-sm text-gray-600">• Tasa de matriculación (DGT)</td>
                        <td className="py-1 text-right text-sm text-gray-700">{formatCurrency(ADMIN_COSTS.dgtFee)}</td>
                      </tr>
                      <tr>
                        <td className="py-1 text-sm text-gray-600">• Ficha técnica reducida</td>
                        <td className="py-1 text-right text-sm text-gray-700">{formatCurrency(ADMIN_COSTS.technicalSheet)}</td>
                      </tr>
                      <tr>
                        <td className="py-1 text-sm text-gray-600">• ITV de importación</td>
                        <td className="py-1 text-right text-sm text-gray-700">{formatCurrency(ADMIN_COSTS.itv)}</td>
                      </tr>
                      <tr>
                        <td className="py-1 text-sm text-gray-600">• Tasa de Tráfico (permiso circulación)</td>
                        <td className="py-1 text-right text-sm text-gray-700">{formatCurrency(ADMIN_COSTS.trafficFee)}</td>
                      </tr>
                      <tr>
                        <td className="py-1 text-sm text-gray-600">• Impuesto de circulación (IVTM)</td>
                        <td className="py-1 text-right text-sm text-gray-700">{formatCurrency(results.ivtmTax)}</td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
              
              {/* Servicios opcionales */}
              {useAgency && (
                <tr className="border-b border-gray-200">
                  <td className="py-3 text-gray-700 font-medium">Gestoría</td>
                  <td className="py-3 text-right font-semibold text-gray-800">{formatCurrency(results.agencyCost)}</td>
                </tr>
              )}
              
              {includeTransport && (
                <tr className="border-b border-gray-200">
                  <td className="py-3 text-gray-700 font-medium">Transporte</td>
                  <td className="py-3 text-right font-semibold text-gray-800">{formatCurrency(results.transportCost)}</td>
                </tr>
              )}
              
              {/* Total */}
              <tr className="bg-blue-50 border-t-2 border-blue-200">
                <td className="py-4 font-bold text-xl text-blue-800">COSTE TOTAL</td>
                <td className="py-4 text-right font-bold text-xl text-blue-800">{formatCurrency(results.totalCost)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Fecha de generación */}
      <div className="text-sm text-gray-500 text-center border-t pt-4">
        <p>Generado el {new Date().toLocaleDateString('es-ES')} - KONECT VO Automotive Marketplace</p>
      </div>
    </div>
  );
};

export default PrintableCalculation;
