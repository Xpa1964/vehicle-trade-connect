
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Save, Upload } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface Tab {
  id: string;
  label: string;
}

interface BottomNavigationProps {
  tabs: Tab[];
  activeTab: string;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit?: () => void;
  isEditing?: boolean;
  isLoading?: boolean;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  tabs,
  activeTab,
  onPrevious,
  onNext,
  onSubmit,
  isEditing = false,
  isLoading = false
}) => {
  const { t } = useLanguage();
  const getCurrentTabIndex = () => tabs.findIndex(tab => tab.id === activeTab);
  const currentTabIndex = getCurrentTabIndex();
  const isFirstTab = currentTabIndex === 0;
  const isLastTab = currentTabIndex === tabs.length - 1;

  return (
    <div className="border-t border-gray-200 bg-white p-4 mt-8">
      <div className="max-w-4xl mx-auto">
        {/* Progress indicator */}
        <div className="flex justify-center mb-4">
          <div className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
            Paso {currentTabIndex + 1} de {tabs.length}: {tabs[currentTabIndex]?.label}
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-between items-center">
          {/* Previous button */}
          <div className="flex-1">
            {!isFirstTab && (
              <Button
                type="button"
                variant="outline"
                onClick={onPrevious}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Página Anterior</span>
              </Button>
            )}
          </div>

          {/* Center progress dots */}
          <div className="flex gap-2 mx-4">
            {tabs.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentTabIndex
                    ? 'bg-blue-500'
                    : index < currentTabIndex
                    ? 'bg-green-500'
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          {/* Next/Submit button */}
          <div className="flex-1 flex justify-end">
            {!isLastTab ? (
              <Button
                type="button"
                onClick={onNext}
                disabled={isLoading}
                className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600"
              >
                <span>Siguiente Página</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                type="button"
                onClick={onSubmit}
                disabled={isLoading}
                className="flex items-center gap-2 bg-green-500 hover:bg-green-600"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Publicando...</span>
                  </>
                ) : (
                  <>
                    {isEditing ? <Save className="h-4 w-4" /> : <Upload className="h-4 w-4" />}
                    <span>{isEditing ? 'Actualizar Vehículo' : 'Publicar Vehículo'}</span>
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
