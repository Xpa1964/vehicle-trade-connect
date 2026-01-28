
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Tab {
  id: string;
  label: string;
}

interface MobileTabNavigationProps {
  tabs: Tab[];
  activeTab: string;
  onPrevious: () => void;
  onNext: () => void;
}

export const MobileTabNavigation: React.FC<MobileTabNavigationProps> = ({
  tabs,
  activeTab,
  onPrevious,
  onNext
}) => {
  const getCurrentTabIndex = () => tabs.findIndex(tab => tab.id === activeTab);
  const currentTabIndex = getCurrentTabIndex();

  return (
    <div className="md:hidden mb-4 sm:mb-6">
      <div className="flex items-center justify-between mb-3 sm:mb-4 gap-2 sm:gap-3">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onPrevious}
          disabled={currentTabIndex === 0}
          className="flex items-center gap-1 sm:gap-2 touch-manipulation min-h-[44px] px-3 sm:px-4 rounded-xl"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden xs:inline">Anterior</span>
        </Button>
        
        <div className="text-center flex-1 min-w-0 px-2">
          <span className="text-sm font-medium block truncate">
            {tabs[currentTabIndex]?.label}
          </span>
          <div className="text-xs text-gray-500 mt-1">
            {currentTabIndex + 1} de {tabs.length}
          </div>
        </div>
        
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onNext}
          disabled={currentTabIndex === tabs.length - 1}
          className="flex items-center gap-1 sm:gap-2 touch-manipulation min-h-[44px] px-3 sm:px-4 rounded-xl"
        >
          <span className="hidden xs:inline">Siguiente</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3 overflow-hidden">
        <div 
          className="bg-blue-500 h-2 sm:h-3 rounded-full transition-all duration-300 relative overflow-hidden"
          style={{ width: `${((currentTabIndex + 1) / tabs.length) * 100}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};
