
import React from 'react';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { UseFormReturn, useWatch } from 'react-hook-form';
import { VehicleFormData } from '@/types/vehicle';
import { useLanguage } from '@/contexts/LanguageContext';
import { useVehicleFormTabs } from '@/hooks/useVehicleFormTabs';
import BasicDetails from '../form-sections/BasicDetails';
import { VehicleIdentification } from '../form-sections/VehicleIdentification';
import { TransactionDetails } from '../form-sections/TransactionDetails';
import { VehicleSpecs } from '../form-sections/VehicleSpecs';
import { EquipmentSelection } from '../form-sections/EquipmentSelection';
import { AdditionalInfo } from '../form-sections/AdditionalInfo';
import { DamagesSection } from '../form-sections/DamagesSection';
import { FileUpload } from '../form-sections/FileUpload';
import { cn } from '@/lib/utils';
import {
  Upload, Save, FileEdit, ChevronLeft, ChevronRight,
  Car, CreditCard, Settings, Package, Info, AlertTriangle, Image, CheckCircle
} from 'lucide-react';

interface VehicleFormContentProps {
  form: UseFormReturn<VehicleFormData>;
  isEditing: boolean;
  onSubmit: (data: VehicleFormData) => Promise<any>;
  onChange: (field: string, value: string | number) => void;
  onBrandChange: (brand: string) => string[];
  availableModels: string[];
  isLoadingModels?: boolean;
  modelsError?: boolean;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  previewUrl: string | null;
}

const TAB_ICONS: Record<string, React.ElementType> = {
  basic: Car,
  identification: CreditCard,
  transaction: CreditCard,
  specs: Settings,
  equipment: Package,
  additional: Info,
  damages: AlertTriangle,
  media: Image,
  published: CheckCircle,
};

export const VehicleFormContent: React.FC<VehicleFormContentProps> = ({
  form,
  isEditing,
  onSubmit,
  onChange,
  onBrandChange,
  availableModels,
  isLoadingModels,
  modelsError,
  onImageChange,
  previewUrl
}) => {
  const { t } = useLanguage();
  const {
    activeTab,
    setActiveTab,
    tabs,
    getCurrentTabIndex,
    goToNextTab,
    goToPreviousTab,
    isVehiclePublished,
    markAsPublished
  } = useVehicleFormTabs();

  const formData = useWatch({ control: form.control }) as VehicleFormData;

  const handleFormSubmit = async () => {
    const allFormValues = form.getValues();
    try {
      allFormValues.status = 'available';
      const result = await onSubmit(allFormValues);
      if (result?.id) {
        markAsPublished();
      } else {
        console.error('❌ [VehicleForm] No vehicle ID returned');
        import('sonner').then(({ toast }) => {
          toast.error('Error al publicar el vehículo. Inténtalo de nuevo.');
        });
      }
    } catch (error) {
      console.error('❌ [VehicleForm] Submit error:', error);
      import('sonner').then(({ toast }) => {
        toast.error('Error al publicar el vehículo. Revisa los datos e inténtalo de nuevo.');
      });
    }
  };

  const handleSaveDraft = async () => {
    const allFormValues = form.getValues();
    try {
      allFormValues.status = 'draft';
      await onSubmit(allFormValues);
    } catch (error) {
      console.error('❌ [VehicleForm] Draft save error:', error);
    }
  };

  const onValidationError = (errors: any) => {
    console.error('❌ [VehicleForm] Validation errors:', JSON.stringify(errors, null, 2));
    const fieldNames = Object.keys(errors);
    if (fieldNames.length > 0) {
      const firstError = errors[fieldNames[0]];
      const msg = firstError?.message || `Campo inválido: ${fieldNames[0]}`;
      import('sonner').then(({ toast }) => {
        toast.error(`Error de validación: ${msg}`, {
          description: `Campos con error: ${fieldNames.join(', ')}`,
        });
      });
    }
  };

  const preventDragNavigation = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const currentTabIndex = getCurrentTabIndex();
  const currentTabLabel = tabs.find(tab => tab.id === activeTab)?.label || '';

  return (
    <div
      className="relative bg-background"
      onDragOver={preventDragNavigation}
      onDrop={preventDragNavigation}
    >
      <Form {...form}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit(onSubmit, onValidationError)(e);
          }}
          className="relative"
        >
          <div className="flex flex-col md:flex-row min-h-[600px]">
            {/* Sidebar Navigation */}
            <aside className="w-full md:w-56 lg:w-64 flex-shrink-0 border-b md:border-b-0 md:border-r border-border bg-card/50 p-3 md:p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 px-2">
                {t('vehicles.vehicleForm', { fallback: 'Formulario de vehículo' })}
              </p>
              <nav className="flex md:flex-col gap-1 overflow-x-auto md:overflow-x-visible">
                {tabs.map((tab) => {
                  const Icon = TAB_ICONS[tab.id] || Car;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        'flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap w-full text-left',
                        isActive
                          ? 'bg-primary text-primary-foreground shadow-sm'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                      )}
                    >
                      <Icon className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 min-w-0">
              {/* Tab Title Bar */}
              <div className="border-b border-border px-4 md:px-6 py-4">
                <h2 className="text-xl font-bold">{currentTabLabel}</h2>
                <div className="h-1 w-16 bg-primary rounded-full mt-2" />
              </div>

              {/* Tab Content */}
              <div className="p-4 md:p-6 lg:p-8">
                {activeTab === 'basic' && (
                  <BasicDetails
                    formData={formData}
                    onChange={onChange}
                    onBrandChange={(brand: string) => {
                      onBrandChange(brand);
                    }}
                    availableModels={availableModels}
                  />
                )}

                {activeTab === 'identification' && (
                  <VehicleIdentification form={form} />
                )}

                {activeTab === 'transaction' && (
                  <TransactionDetails form={form} />
                )}

                {activeTab === 'specs' && (
                  <VehicleSpecs form={form} />
                )}

                {activeTab === 'equipment' && (
                  <EquipmentSelection form={form} />
                )}

                {activeTab === 'additional' && (
                  <AdditionalInfo form={form} />
                )}

                {activeTab === 'damages' && (
                  <DamagesSection form={form} />
                )}

                {activeTab === 'media' && (
                  <div className="space-y-4">
                    <FileUpload
                      form={form}
                      onImageChange={onImageChange}
                      previewUrl={previewUrl}
                    />
                  </div>
                )}

                {activeTab === 'published' && (
                  <div className="space-y-6">
                    {isVehiclePublished ? (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <CheckCircle className="h-16 w-16 text-primary mb-4" />
                        <h3 className="text-xl font-bold mb-2">{t('vehicles.vehiclePublished', { fallback: '¡Vehículo publicado!' })}</h3>
                        <p className="text-muted-foreground">{t('vehicles.vehiclePublishedDesc', { fallback: 'Tu vehículo está ahora visible en la plataforma.' })}</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12 text-center gap-4">
                        <p className="text-muted-foreground">{t('vehicles.readyToPublish', { fallback: 'Revisa los datos y publica tu vehículo.' })}</p>
                        <div className="flex gap-3">
                          {!isEditing && (
                            <Button
                              type="button"
                              variant="outline"
                              onClick={handleSaveDraft}
                              className="min-h-[48px] px-6 rounded-xl"
                            >
                              <FileEdit className="h-4 w-4 mr-2" />
                              {t('vehicles.saveDraft', { fallback: 'Guardar borrador' })}
                            </Button>
                          )}
                          <Button
                            type="button"
                            onClick={handleFormSubmit}
                            className="min-h-[48px] px-8 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
                          >
                            {isEditing ? (
                              <>
                                <Save className="h-4 w-4 mr-2" />
                                {t('vehicles.updateVehicle')}
                              </>
                            ) : (
                              <>
                                <Upload className="h-4 w-4 mr-2" />
                                {t('vehicles.publishVehicle')}
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Bottom Navigation (mobile-friendly) */}
              <div className="flex items-center justify-between px-4 md:px-6 py-4 border-t border-border">
                {currentTabIndex > 0 ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={goToPreviousTab}
                    className="min-h-[44px] px-4 rounded-xl"
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    {t('common.previous', { fallback: 'Anterior' })}
                  </Button>
                ) : (
                  <div />
                )}

                {currentTabIndex < tabs.length - 1 ? (
                  <Button
                    type="button"
                    onClick={goToNextTab}
                    className="min-h-[44px] px-4 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    {t('common.next', { fallback: 'Siguiente' })}
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                ) : (
                  <div />
                )}
              </div>
            </main>
          </div>

          <Button type="submit" className="hidden">Submit</Button>
        </form>
      </Form>
    </div>
  );
};
