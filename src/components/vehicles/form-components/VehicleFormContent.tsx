
import React from 'react';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { UseFormReturn } from 'react-hook-form';
import { VehicleFormData } from '@/types/vehicle';
import { useLanguage } from '@/contexts/LanguageContext';
import { useVehicleFormScroll } from '@/hooks/useVehicleFormScroll';
import { VehicleFormScrollSections } from '../form-scroll/VehicleFormScrollSections';
import { SidebarNavigation } from '../form-scroll/SidebarNavigation';
import { MobileFormActions } from '../form-navigation/MobileFormActions';

interface VehicleFormContentProps {
  form: UseFormReturn<VehicleFormData>;
  isEditing: boolean;
  onSubmit: (data: VehicleFormData) => Promise<void>;
  onChange: (field: string, value: string | number) => void;
  onBrandChange: (brand: string) => void;
  availableModels: string[];
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  previewUrl: string | null;
}

export const VehicleFormContent: React.FC<VehicleFormContentProps> = ({
  form,
  isEditing,
  onSubmit,
  onChange,
  onBrandChange,
  availableModels,
  onImageChange,
  previewUrl
}) => {
  const { t } = useLanguage();
  const {
    activeSection,
    completedSections,
    handleSectionChange,
    markSectionCompleted,
    goToSection
  } = useVehicleFormScroll();

  const formData = form.getValues();

  const handleFormSubmit = async () => {
    const allFormValues = form.getValues();
    await onSubmit(allFormValues);
    markSectionCompleted('published');
    goToSection('published');
  };

  const onValidationError = (errors: any) => {
    console.error('❌ [VehicleForm] Validation errors preventing submit:', JSON.stringify(errors, null, 2));
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

  // Prevent browser from navigating to dropped files (causes full page reload + data loss)
  const preventDragNavigation = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div 
      className="relative bg-background"
      onDragOver={preventDragNavigation}
      onDrop={preventDragNavigation}
    >
      <Form {...form}>
        <form onSubmit={(e) => { e.preventDefault(); form.handleSubmit(onSubmit, onValidationError)(e); }} className="relative">
          {/* Layout: Sidebar siempre visible en desktop */}
          <div className="flex flex-col lg:flex-row gap-6 xl:gap-8">
            
            {/* Sidebar Navigation - Siempre visible en desktop */}
            <aside className="w-64 xl:w-72 flex-shrink-0">
              <SidebarNavigation
                activeSection={activeSection}
                onSectionClick={goToSection}
                completedSections={completedSections}
              />
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-0 lg:pr-6 xl:pr-8">
              <div className="max-w-4xl">
                <VehicleFormScrollSections
                  form={form}
                  formData={formData}
                  onChange={onChange}
                  onBrandChange={onBrandChange}
                  availableModels={availableModels}
                  onImageChange={onImageChange}
                  previewUrl={previewUrl}
                  isVehiclePublished={completedSections.includes('published')}
                  activeSection={activeSection}
                  onSectionChange={handleSectionChange}
                />

                {/* Desktop Submit Button */}
                <div className="hidden lg:flex mt-12 justify-center pb-8">
                  <Button 
                    type="button" 
                    onClick={handleFormSubmit}
                    size="lg"
                    className="min-h-[48px] px-8 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-xl transition-all duration-200"
                  >
                    {isEditing ? t('vehicles.updateVehicle') : t('vehicles.publishVehicle')}
                  </Button>
                </div>
              </div>
            </main>
          </div>

          {/* Mobile Form Actions - Integradas */}
          <div className="lg:hidden">
            <MobileFormActions
              tabs={[
                { id: 'basic', label: 'Básicos' },
                { id: 'identification', label: 'Identificación' },
                { id: 'transaction', label: 'Transacción' },
                { id: 'specs', label: 'Especificaciones' },
                { id: 'equipment', label: 'Equipamiento' },
                { id: 'additional', label: 'Adicional' },
                { id: 'damages', label: 'Daños' },
                { id: 'media', label: 'Imágenes' },
                { id: 'published', label: 'Publicar' }
              ]}
              activeTab={activeSection}
              onPrevious={() => {
                const sections = ['basic', 'identification', 'transaction', 'specs', 'equipment', 'additional', 'damages', 'media', 'published'];
                const currentIndex = sections.indexOf(activeSection);
                if (currentIndex > 0) {
                  const prevSection = sections[currentIndex - 1];
                  handleSectionChange(prevSection);
                  const element = document.getElementById(prevSection);
                  element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
              onNext={() => {
                const sections = ['basic', 'identification', 'transaction', 'specs', 'equipment', 'additional', 'damages', 'media', 'published'];
                const currentIndex = sections.indexOf(activeSection);
                if (currentIndex < sections.length - 1) {
                  const nextSection = sections[currentIndex + 1];
                  handleSectionChange(nextSection);
                  const element = document.getElementById(nextSection);
                  element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
              isEditing={isEditing}
              t={t}
              isLoading={false}
            />
          </div>

          {/* Hidden submit button for form validation */}
          <Button type="submit" className="hidden">
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
};
