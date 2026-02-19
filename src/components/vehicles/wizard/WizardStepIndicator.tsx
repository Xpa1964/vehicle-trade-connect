import React from 'react';
import { cn } from '@/lib/utils';
import { Check, Search, Settings, Camera } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface WizardStep {
  id: number;
  titleKey: string;
  icon: React.ElementType;
}

interface WizardStepIndicatorProps {
  currentStep: number;
  completedSteps: number[];
}

const STEPS: WizardStep[] = [
  { id: 1, titleKey: 'vehicles.wizardStep1', icon: Search },
  { id: 2, titleKey: 'vehicles.wizardStep2', icon: Settings },
  { id: 3, titleKey: 'vehicles.wizardStep3', icon: Camera },
];

const STEP_FALLBACKS: Record<string, string> = {
  'vehicles.wizardStep1': 'Identificación',
  'vehicles.wizardStep2': 'Datos Técnicos',
  'vehicles.wizardStep3': 'Multimedia y Precio',
};

export const WizardStepIndicator: React.FC<WizardStepIndicatorProps> = ({
  currentStep,
  completedSteps,
}) => {
  const { t } = useLanguage();

  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between">
        {STEPS.map((step, index) => {
          const Icon = step.icon;
          const isActive = currentStep === step.id;
          const isCompleted = completedSteps.includes(step.id);
          const isLast = index === STEPS.length - 1;
          const label = t(step.titleKey, { fallback: STEP_FALLBACKS[step.titleKey] });

          return (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center gap-2 min-w-0 flex-shrink-0">
                <div
                  className={cn(
                    'w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300',
                    isCompleted && 'bg-primary border-primary text-primary-foreground',
                    isActive && !isCompleted && 'border-primary bg-primary/10 text-primary',
                    !isActive && !isCompleted && 'border-muted-foreground/30 text-muted-foreground'
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <Icon className="h-5 w-5" />
                  )}
                </div>
                <span
                  className={cn(
                    'text-xs font-medium text-center max-w-[100px] truncate',
                    isActive && 'text-primary',
                    isCompleted && 'text-primary',
                    !isActive && !isCompleted && 'text-muted-foreground'
                  )}
                >
                  {label}
                </span>
              </div>

              {!isLast && (
                <div className="flex-1 mx-2 mt-[-24px]">
                  <div className="h-0.5 w-full bg-muted rounded-full">
                    <div
                      className={cn(
                        'h-0.5 rounded-full transition-all duration-500',
                        isCompleted ? 'w-full bg-primary' : 'w-0 bg-primary'
                      )}
                    />
                  </div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
