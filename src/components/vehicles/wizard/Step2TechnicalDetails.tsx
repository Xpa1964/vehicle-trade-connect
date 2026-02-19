import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { VehicleFormData } from '@/types/vehicle';
import { useLanguage } from '@/contexts/LanguageContext';
import { VehicleSpecs } from '../form-sections/VehicleSpecs';
import { TransactionDetails } from '../form-sections/TransactionDetails';
import { EquipmentSelection } from '../form-sections/EquipmentSelection';
import { DamagesSection } from '../form-sections/DamagesSection';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, CreditCard, Package, AlertTriangle } from 'lucide-react';

interface Step2TechnicalDetailsProps {
  form: UseFormReturn<VehicleFormData>;
}

export const Step2TechnicalDetails: React.FC<Step2TechnicalDetailsProps> = ({ form }) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <Tabs defaultValue="specs" className="w-full">
        <TabsList className="w-full grid grid-cols-4 h-auto">
          <TabsTrigger value="specs" className="flex items-center gap-2 py-3 text-xs sm:text-sm">
            <Settings className="h-4 w-4 hidden sm:block" />
            {t('vehicles.technicalDetails', { fallback: 'Especificaciones' })}
          </TabsTrigger>
          <TabsTrigger value="transaction" className="flex items-center gap-2 py-3 text-xs sm:text-sm">
            <CreditCard className="h-4 w-4 hidden sm:block" />
            {t('vehicles.transactionDetails', { fallback: 'Transacción' })}
          </TabsTrigger>
          <TabsTrigger value="equipment" className="flex items-center gap-2 py-3 text-xs sm:text-sm">
            <Package className="h-4 w-4 hidden sm:block" />
            {t('vehicles.equipment', { fallback: 'Equipamiento' })}
          </TabsTrigger>
          <TabsTrigger value="damages" className="flex items-center gap-2 py-3 text-xs sm:text-sm">
            <AlertTriangle className="h-4 w-4 hidden sm:block" />
            {t('vehicles.damages', { fallback: 'Daños' })}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="specs" className="mt-6">
          <VehicleSpecs form={form} />
        </TabsContent>

        <TabsContent value="transaction" className="mt-6">
          <TransactionDetails form={form} />
        </TabsContent>

        <TabsContent value="equipment" className="mt-6">
          <EquipmentSelection form={form} />
        </TabsContent>

        <TabsContent value="damages" className="mt-6">
          <DamagesSection form={form} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
