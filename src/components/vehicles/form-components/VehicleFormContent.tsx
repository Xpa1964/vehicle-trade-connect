
import React, { useState } from 'react';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { UseFormReturn } from 'react-hook-form';
import { VehicleFormData } from '@/types/vehicle';
import { useLanguage } from '@/contexts/LanguageContext';
import { WizardStepIndicator } from '../wizard/WizardStepIndicator';
import { Step1VinIdentification } from '../wizard/Step1VinIdentification';
import { Step2TechnicalDetails } from '../wizard/Step2TechnicalDetails';
import { Step3MediaPrice } from '../wizard/Step3MediaPrice';
import { ChevronLeft, ChevronRight, Upload, Save, FileEdit } from 'lucide-react';

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
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const markStepCompleted = (step: number) => {
    setCompletedSteps(prev => prev.includes(step) ? prev : [...prev, step]);
  };

  const goToStep = (step: number) => {
    // Mark current step as completed when moving forward
    if (step > currentStep) {
      markStepCompleted(currentStep);
    }
    setCurrentStep(step);
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFormSubmit = async () => {
    const allFormValues = form.getValues();
    try {
      // Ensure status is 'available' when publishing
      allFormValues.status = 'available';
      await onSubmit(allFormValues);
      markStepCompleted(3);
    } catch (error) {
      console.error('❌ [VehicleForm] Submit error:', error);
    }
  };

  const handleSaveDraft = async () => {
    const allFormValues = form.getValues();
    try {
      allFormValues.status = 'draft';
      await onSubmit(allFormValues);
      markStepCompleted(3);
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

  // Prevent browser from navigating to dropped files
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
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit(onSubmit, onValidationError)(e);
          }}
          className="relative"
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Wizard Step Indicator */}
            <WizardStepIndicator
              currentStep={currentStep}
              completedSteps={completedSteps}
            />

            {/* Step Content */}
            <div className="min-h-[500px]">
              {currentStep === 1 && (
                <Step1VinIdentification
                  form={form}
                  onChange={onChange}
                  onBrandChange={onBrandChange}
                />
              )}

              {currentStep === 2 && (
                <Step2TechnicalDetails form={form} />
              )}

              {currentStep === 3 && (
                <Step3MediaPrice
                  form={form}
                  onChange={onChange}
                  onImageChange={onImageChange}
                  previewUrl={previewUrl}
                />
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
              {currentStep > 1 ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => goToStep(currentStep - 1)}
                  className="min-h-[48px] px-6 rounded-xl"
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  {t('common.previous', { fallback: 'Anterior' })}
                </Button>
              ) : (
                <div />
              )}

              {currentStep < 3 ? (
                <Button
                  type="button"
                  onClick={() => goToStep(currentStep + 1)}
                  className="min-h-[48px] px-6 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {t('common.next', { fallback: 'Siguiente' })}
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
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
              )}
            </div>
          </div>

          {/* Hidden submit for form validation */}
          <Button type="submit" className="hidden">Submit</Button>
        </form>
      </Form>
    </div>
  );
};
