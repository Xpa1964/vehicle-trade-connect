
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, Building2, Phone, Briefcase, FileText, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export type FormStep = {
  id: string;
  label: string;
  component: React.ReactNode;
  optional?: boolean;
  fieldsToValidate?: string[];
}

interface MultiStepFormProps {
  steps: FormStep[];
  onComplete: () => void;
  onSaveProgress?: () => void;
  isSubmitting: boolean;
  formInstance?: any;
}

const MultiStepForm: React.FC<MultiStepFormProps> = ({ 
  steps, 
  onComplete, 
  onSaveProgress,
  isSubmitting,
  formInstance
}) => {
  const { t } = useLanguage();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});
  
  const currentStep = steps[currentStepIndex];
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === steps.length - 1;
  const progressPercentage = ((currentStepIndex + 1) / steps.length) * 100;
  
  const phaseIcons = [Building2, Phone, Briefcase, FileText, CheckCircle2];
  
  const validateCurrentStep = async (): Promise<boolean> => {
    if (!formInstance || !currentStep.fieldsToValidate || currentStep.fieldsToValidate.length === 0) {
      return true;
    }
    
    const result = await formInstance.trigger(currentStep.fieldsToValidate);
    return result;
  };
  
  const handleNext = async () => {
    if (isLastStep) {
      console.log('Submitting registration form...');
      onComplete();
    } else {
      const isValid = await validateCurrentStep();
      if (isValid) {
        setCompletedSteps({...completedSteps, [currentStep.id]: true});
        setCurrentStepIndex(currentStepIndex + 1);
      }
    }
  };
  
  const handleBack = () => {
    if (!isFirstStep) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };
  
  const handleStepClick = (index: number) => {
    if (
      index < currentStepIndex || 
      completedSteps[steps[index].id] || 
      index === currentStepIndex + 1
    ) {
      setCurrentStepIndex(index);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h3 className="text-center text-lg font-bold text-primary mb-6">
          {t('auth.register.multiStepTitle')}
        </h3>
        
        <div className="flex justify-between items-center gap-2 mb-4">
          {steps.map((step, index) => {
            const PhaseIcon = phaseIcons[index] || Building2;
            const isCompleted = completedSteps[step.id];
            const isCurrent = index === currentStepIndex;
            const isPending = index > currentStepIndex && !isCompleted;
            
            return (
              <React.Fragment key={step.id}>
                <button
                  onClick={() => handleStepClick(index)}
                  disabled={!(index < currentStepIndex || completedSteps[step.id] || index === currentStepIndex || index === currentStepIndex + 1)}
                  className={`
                    flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all
                    ${isCurrent ? 'bg-primary/10 border-primary shadow-lg scale-105' : ''}
                    ${isCompleted ? 'bg-success/10 border-[#22C55E]' : ''}
                    ${isPending ? 'bg-secondary border-border opacity-60' : ''}
                    ${(index <= currentStepIndex || completedSteps[step.id]) ? 'cursor-pointer hover:shadow-md' : 'cursor-not-allowed'}
                    flex-1 min-w-0
                  `}
                >
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center mb-2 font-bold text-lg
                    ${isCurrent ? 'bg-primary text-primary-foreground' : ''}
                    ${isCompleted ? 'bg-[#22C55E] text-white' : ''}
                    ${isPending ? 'bg-secondary text-muted-foreground' : ''}
                  `}>
                    {isCompleted ? '✓' : index + 1}
                  </div>
                  
                  <PhaseIcon className={`
                    h-5 w-5 mb-1
                    ${isCurrent ? 'text-primary' : ''}
                    ${isCompleted ? 'text-[#22C55E]' : ''}
                    ${isPending ? 'text-muted-foreground' : ''}
                  `} />
                  
                  <span className={`
                    text-xs font-medium text-center line-clamp-2
                    ${isCurrent ? 'text-primary' : ''}
                    ${isCompleted ? 'text-[#22C55E]' : ''}
                    ${isPending ? 'text-muted-foreground' : ''}
                  `}>
                    {step.label}
                  </span>
                  
                  {isCurrent && (
                    <span className="text-[10px] font-bold text-primary mt-1 uppercase">
                      {t('auth.register.current')}
                    </span>
                  )}
                  
                  {isCompleted && !isCurrent && (
                    <span className="text-[10px] font-medium text-[#22C55E] mt-1 uppercase">
                      {t('auth.register.completed')}
                    </span>
                  )}
                </button>
                
                {index < steps.length - 1 && (
                  <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>
        
        <Progress value={progressPercentage} className="h-3 mb-2" />
        
        <div className="flex justify-between text-sm text-muted-foreground">
          <span className="font-medium">
            {t('auth.register.phase')} {currentStepIndex + 1} {t('auth.register.of')} {steps.length}
          </span>
          <span className="font-bold">{progressPercentage.toFixed(0)}%</span>
        </div>
      </div>
      
      <div className="py-4">
        {currentStep.component}
      </div>
      
      <div className="flex justify-between pt-4 border-t border-border">
        <Button
          type="button"
          variant="outline"
          onClick={handleBack}
          disabled={isFirstStep || isSubmitting}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('auth.register.back')}
        </Button>
        
        {onSaveProgress && (
          <Button
            type="button"
            variant="secondary"
            onClick={onSaveProgress}
            disabled={isSubmitting}
          >
            {t('auth.register.saveProgress')}
          </Button>
        )}
        
        <Button
          type="button"
          onClick={handleNext}
          disabled={isSubmitting}
        >
          {isLastStep ? t('auth.register.submit') : t('auth.register.next')}
          {!isLastStep && <ArrowRight className="ml-2 h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
};

export default MultiStepForm;
