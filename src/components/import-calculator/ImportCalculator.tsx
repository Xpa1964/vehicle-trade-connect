
import React, { memo, useEffect, useState } from 'react';
import { Calculator, Printer, RotateCcw } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import CalculatorForm from './CalculatorForm';
import CalculatorResults from './CalculatorResults';
import { useImportCalculator } from './useImportCalculator';
import InfoCard from './InfoCard';
import { LOGO_IMAGES } from '@/constants/imageAssets';
import PrintableCalculation from './PrintableCalculation';
import { toast } from 'sonner';

const ImportCalculator: React.FC = memo(() => {
  const { t } = useLanguage();
  const [showResetDialog, setShowResetDialog] = useState(false);
  
  const { 
    results, vehicleType, isNew, originCountry, price, includesVAT, 
    co2Emissions, useAgency, includeTransport, ivtmTax,
    setVehicleType, setIsNew, setOriginCountry, setPrice, 
    setIncludesVAT, setCo2Emissions, setUseAgency, 
    setIncludeTransport, setIvtmTax, resetCalculator, printCalculation 
  } = useImportCalculator();

  // Mostrar diálogo de recordatorio al entrar (solo una vez por sesión)
  useEffect(() => {
    const hasSeenReminder = sessionStorage.getItem('calculator-reminder-seen');
    if (!hasSeenReminder) {
      const timer = setTimeout(() => {
        setShowResetDialog(true);
        sessionStorage.setItem('calculator-reminder-seen', 'true');
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleReset = () => {
    resetCalculator();
    toast.success(t('calculator.info.resetSuccess', { fallback: 'Calculations reset successfully' }), {
      description: t('calculator.info.resetDescription', { fallback: 'All values have been reset to their default values' }),
      duration: 2000,
    });
  };

  const handleResetFromDialog = () => {
    handleReset();
    setShowResetDialog(false);
  };

  return (
    <>
      <div className="w-full max-w-7xl mx-auto py-4 sm:py-6 lg:py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4 sm:mb-6 gap-4">
          <div className="flex items-start gap-3 sm:gap-4">
            <Calculator className="h-6 w-6 sm:h-8 sm:w-8 text-primary flex-shrink-0 mt-1" />
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight text-foreground">
                {t('calculator.title', { fallback: 'Import Cost Calculator' })}
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground mt-1">
                {t('calculator.subtitle', { fallback: 'For professionals (B2B) - Vehicle import to Spain' })}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button 
              onClick={handleReset}
              variant="outline"
              size="sm"
              className="flex items-center gap-2 h-10 px-4 text-foreground hover:text-foreground hover:bg-primary/10 border-border hover:border-primary/30 font-medium shadow-sm transition-all duration-200"
            >
              <RotateCcw className="h-4 w-4" />
              <span className="whitespace-nowrap">{t('calculator.buttons.reset', { fallback: 'Reset Calculations' })}</span>
            </Button>
            
            <img 
              src={LOGO_IMAGES.primary} 
              alt="KONECT VO Logo" 
              className="h-12 sm:h-14 lg:h-16 w-auto object-contain" 
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2 order-2 lg:order-1 space-y-6">
            <CalculatorForm 
              vehicleType={vehicleType}
              isNew={isNew}
              originCountry={originCountry}
              price={price}
              includesVAT={includesVAT}
              co2Emissions={co2Emissions}
              useAgency={useAgency}
              includeTransport={includeTransport}
              ivtmTax={ivtmTax}
              setVehicleType={setVehicleType}
              setIsNew={setIsNew}
              setOriginCountry={setOriginCountry}
              setPrice={setPrice}
              setIncludesVAT={setIncludesVAT}
              setCo2Emissions={setCo2Emissions}
              setUseAgency={setUseAgency}
              setIncludeTransport={setIncludeTransport}
              setIvtmTax={setIvtmTax}
            />
            
            <InfoCard />
          </div>

          <div className="space-y-4 sm:space-y-6 order-1 lg:order-2">
            <CalculatorResults results={results} useAgency={useAgency} includeTransport={includeTransport} />
            
            <Button 
              onClick={printCalculation} 
              className="w-full flex items-center justify-center gap-2 h-11 sm:h-10 touch-manipulation"
            >
              <Printer className="h-4 w-4" />
              {t('calculator.buttons.printCalculation', { fallback: 'Print calculation' })}
            </Button>
          </div>
        </div>
        
        <div id="printable-calculation" className="print:block hidden">
          <PrintableCalculation 
            results={results} 
            vehicleType={vehicleType}
            isNew={isNew}
            originCountry={originCountry}
            co2Emissions={co2Emissions}
            useAgency={useAgency} 
            includeTransport={includeTransport} 
          />
        </div>
      </div>

      {/* Diálogo de recordatorio */}
      <AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <AlertDialogContent className="max-w-md bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-foreground">
              <RotateCcw className="h-5 w-5 text-muted-foreground" />
              {t('calculator.title', { fallback: 'Import Calculator' })}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-left text-muted-foreground">
              {t('calculator.info.resetQuestion', { fallback: 'Do you want to reset all calculations to start fresh with default values?' })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel onClick={() => setShowResetDialog(false)} className="border-border text-foreground hover:bg-secondary">
              {t('common.continue', { fallback: 'Continue' })}
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleResetFromDialog} className="bg-primary text-primary-foreground hover:bg-primary/90">
              {t('calculator.buttons.confirmReset', { fallback: 'Yes, reset' })}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
});

ImportCalculator.displayName = 'ImportCalculator';

export default ImportCalculator;
