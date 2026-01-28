
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Save, Upload } from 'lucide-react';

interface Tab {
  id: string;
  label: string;
}

interface MobileFormActionsProps {
  tabs: Tab[];
  activeTab: string;
  onPrevious: () => void;
  onNext: () => void;
  isEditing: boolean;
  t: (key: string) => string;
  isLoading?: boolean;
}

export const MobileFormActions: React.FC<MobileFormActionsProps> = ({
  tabs,
  activeTab,
  onPrevious,
  onNext,
  isEditing,
  t,
  isLoading = false
}) => {
  const getCurrentTabIndex = () => tabs.findIndex(tab => tab.id === activeTab);
  const currentTabIndex = getCurrentTabIndex();
  const isLastTab = currentTabIndex === tabs.length - 1;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-md border-t border-border/20 shadow-2xl z-40 safe-area-padding-bottom">
      <div className="p-4 space-y-4">
        {/* Progress indicator mejorado */}
        <div className="text-center">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground font-medium">
              Paso {currentTabIndex + 1} de {tabs.length}
            </span>
            <span className="text-xs text-muted-foreground">
              {tabs[currentTabIndex]?.label}
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${((currentTabIndex + 1) / tabs.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Action buttons con espaciado responsivo */}
        <div className="flex gap-3">
          {currentTabIndex > 0 && (
            <Button
              type="button"
              variant="outline"
              onClick={onPrevious}
              disabled={isLoading}
              className="flex-1 touch-manipulation min-h-[52px] rounded-xl border-border/40 hover:bg-muted/50 transition-all duration-200"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              <span className="font-medium">Anterior</span>
            </Button>
          )}
          
          {!isLastTab ? (
            <Button
              type="button"
              onClick={onNext}
              disabled={isLoading}
              className="flex-1 touch-manipulation min-h-[52px] rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-all duration-200"
            >
              <span>Siguiente</span>
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button 
              type="submit" 
              disabled={isLoading}
              className="flex-1 touch-manipulation min-h-[52px] rounded-xl bg-success hover:bg-success/90 text-success-foreground font-medium transition-all duration-200"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                  <span>Guardando...</span>
                </>
              ) : (
                <>
                  {isEditing ? <Save className="h-4 w-4 mr-2" /> : <Upload className="h-4 w-4 mr-2" />}
                  <span>{isEditing ? t('vehicles.updateVehicle') : t('vehicles.publishVehicle')}</span>
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
