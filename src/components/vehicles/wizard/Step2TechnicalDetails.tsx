import React, { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { VehicleFormData } from '@/types/vehicle';
import { useLanguage } from '@/contexts/LanguageContext';
import { VehicleSpecs } from '../form-sections/VehicleSpecs';
import { TransactionDetails } from '../form-sections/TransactionDetails';
import { EquipmentSelection } from '../form-sections/EquipmentSelection';
import { DamagesSection } from '../form-sections/DamagesSection';
import { Settings, CreditCard, Package, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Step2TechnicalDetailsProps {
  form: UseFormReturn<VehicleFormData>;
}

const sections = [
  { id: 'specs', label: 'Especificaciones', icon: Settings },
  { id: 'transaction', label: 'Transacción', icon: CreditCard },
  { id: 'equipment', label: 'Equipamiento', icon: Package },
  { id: 'damages', label: 'Daños', icon: AlertTriangle },
];

export const Step2TechnicalDetails: React.FC<Step2TechnicalDetailsProps> = ({ form }) => {
  const { t } = useLanguage();
  const [activeSection, setActiveSection] = useState('specs');

  const renderContent = () => {
    switch (activeSection) {
      case 'specs': return <VehicleSpecs form={form} />;
      case 'transaction': return <TransactionDetails form={form} />;
      case 'equipment': return <EquipmentSelection form={form} />;
      case 'damages': return <DamagesSection form={form} />;
      default: return <VehicleSpecs form={form} />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Mobile: barra horizontal scrollable */}
      <div className="flex md:hidden gap-2 overflow-x-auto pb-2 -mx-1 px-1">
        {sections.map((section) => {
          const Icon = section.icon;
          const isActive = activeSection === section.id;
          return (
            <button
              key={section.id}
              type="button"
              onClick={() => setActiveSection(section.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium whitespace-nowrap transition-all border min-h-[48px] touch-manipulation",
                isActive
                  ? "bg-primary/10 text-primary border-primary shadow-sm"
                  : "bg-card text-muted-foreground border-border hover:bg-muted/50"
              )}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {section.label}
            </button>
          );
        })}
      </div>

      {/* Desktop: sidebar + contenido */}
      <div className="hidden md:flex gap-6">
        {/* Sidebar */}
        <div className="w-[200px] flex-shrink-0">
          <nav className="bg-card/50 border border-border rounded-xl p-2 space-y-1 sticky top-4">
            {sections.map((section) => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;
              return (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => setActiveSection(section.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all text-left",
                    isActive
                      ? "bg-primary/10 text-primary border-l-[3px] border-primary shadow-sm"
                      : "text-muted-foreground hover:bg-muted/50 border-l-[3px] border-transparent"
                  )}
                >
                  <Icon className={cn(
                    "h-5 w-5 flex-shrink-0",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )} />
                  {section.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Contenido */}
        <div className="flex-1 min-w-0">
          {renderContent()}
        </div>
      </div>

      {/* Mobile: contenido debajo de la barra */}
      <div className="md:hidden">
        {renderContent()}
      </div>
    </div>
  );
};
