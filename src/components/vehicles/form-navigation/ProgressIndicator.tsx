
import React from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle } from 'lucide-react';

interface Tab {
  id: string;
  label: string;
}

interface ProgressIndicatorProps {
  tabs: Tab[];
  activeTab: string;
  completedTabs?: string[];
  isVehiclePublished?: boolean;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  tabs,
  activeTab,
  completedTabs = [],
  isVehiclePublished = false
}) => {
  const getCurrentTabIndex = () => tabs.findIndex(tab => tab.id === activeTab);
  const currentIndex = getCurrentTabIndex();

  return (
    <div className="hidden md:flex justify-center mb-8 overflow-x-auto">
      <div className="flex items-center relative min-w-max px-4">
        {tabs.map((tab, index) => {
          const isActive = activeTab === tab.id;
          const isCompleted = completedTabs.includes(tab.id);
          const isPast = index < currentIndex;
          const isPublishedTab = tab.id === 'published';
          const showAsCompleted = isPublishedTab && isVehiclePublished;

          return (
            <div key={tab.id} className="flex flex-col items-center relative">
              {/* Círculo con número */}
              <div
                className={cn(
                  "w-12 h-12 rounded-full border-2 flex items-center justify-center text-sm font-bold transition-all duration-200 bg-card shadow-lg",
                  isActive && "bg-primary text-primary-foreground border-primary scale-110 shadow-xl",
                  (isCompleted || showAsCompleted) && !isActive && "bg-[#22C55E] text-white border-[#22C55E] shadow-success/20",
                  isPast && !isCompleted && !showAsCompleted && "bg-secondary text-muted-foreground border-border",
                  !isActive && !isCompleted && !isPast && !showAsCompleted && "bg-card text-muted-foreground border-border"
                )}
              >
                {showAsCompleted ? (
                  <CheckCircle className="h-6 w-6" />
                ) : (
                  <span className="text-sm font-bold">{index + 1}</span>
                )}
              </div>
              
              {/* Nombre de la sección */}
              <div
                className={cn(
                  "mt-3 text-xs font-medium text-center max-w-24 leading-tight px-1",
                  isActive && "text-primary font-bold",
                  (isCompleted || showAsCompleted) && "text-[#22C55E] font-semibold",
                  isPast && !isCompleted && !showAsCompleted && "text-muted-foreground",
                  !isActive && !isCompleted && !isPast && !showAsCompleted && "text-muted-foreground"
                )}
              >
                {tab.label}
              </div>

              {/* Línea conectora */}
              {index < tabs.length - 1 && (
                <div className="absolute top-6 left-12 w-16 flex justify-center">
                  <div
                    className={cn(
                      "w-12 h-0.5 transition-colors duration-200",
                      (isPast || isCompleted || showAsCompleted) ? "bg-primary" : "bg-border"
                    )}
                  />
                </div>
              )}
              
              {/* Espaciado entre elementos */}
              {index < tabs.length - 1 && <div className="w-16" />}
            </div>
          );
        })}
      </div>
    </div>
  );
};
