
import React from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronRight, Check, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Tab {
  id: string;
  label: string;
}

interface TabNavigationProps {
  tabs: Tab[];
  activeTab?: string;
  completedTabs?: string[];
  isVehiclePublished?: boolean;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({ 
  tabs, 
  activeTab = '', 
  completedTabs = [],
  isVehiclePublished = false
}) => {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-background border-b shadow-sm min-h-20">
      <TabsList className="hidden md:grid md:grid-cols-7 py-4 w-full max-w-7xl mx-auto min-h-16">
        {tabs.map((tab, index) => {
          const isActive = activeTab === tab.id;
          const isCompleted = completedTabs.includes(tab.id);
          const isPublishedTab = tab.id === 'published';
          const showAsCompleted = isPublishedTab && isVehiclePublished;
          
          return (
            <div key={tab.id} className="flex items-center flex-1 min-w-0">
              <TabsTrigger 
                value={tab.id} 
                className={cn(
                  "flex-1 text-xs lg:text-sm relative flex items-center gap-1 px-1 lg:px-3 py-3 min-h-[3.5rem] whitespace-normal border-0",
                  isActive && "bg-primary text-primary-foreground",
                  (isCompleted || showAsCompleted) && "bg-green-100 text-green-800",
                  showAsCompleted && "bg-green-500 text-white"
                )}
              >
                {(isCompleted || showAsCompleted) && !isPublishedTab && <Check className="h-3 w-3 flex-shrink-0" />}
                {showAsCompleted && <CheckCircle className="h-4 w-4 flex-shrink-0" />}
                <span className="text-center leading-tight hyphens-auto break-words">{tab.label}</span>
              </TabsTrigger>
              {index < tabs.length - 1 && (
                <ChevronRight className={cn(
                  "h-3 w-3 lg:h-4 lg:w-4 mx-1 transition-colors flex-shrink-0",
                  isActive ? "text-primary" : "text-gray-400"
                )} />
              )}
            </div>
          );
        })}
      </TabsList>
    </div>
  );
};
