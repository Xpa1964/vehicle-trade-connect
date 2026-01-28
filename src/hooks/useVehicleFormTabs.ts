
import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export const useVehicleFormTabs = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("basic");
  const [isVehiclePublished, setIsVehiclePublished] = useState(false);

  // Define the tab order and labels - ahora con 7 tabs
  const tabs = [
    { id: 'basic', label: t('vehicles.basicDetails') },
    { id: 'identification', label: t('vehicles.identification') },
    { id: 'specs', label: t('vehicles.technicalDetails') },
    { id: 'additional', label: t('vehicles.additionalInfo') },
    { id: 'damages', label: t('vehicles.damages') },
    { id: 'media', label: 'Imágenes' },
    { id: 'published', label: 'Vehículo Publicado' }
  ];

  // Navigation functions for mobile
  const getCurrentTabIndex = () => tabs.findIndex(tab => tab.id === activeTab);
  
  const goToNextTab = () => {
    const currentIndex = getCurrentTabIndex();
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1].id);
      
      // Si llegamos al último tab, marcar como publicado
      if (currentIndex + 1 === tabs.length - 1) {
        setIsVehiclePublished(true);
      }
    }
  };
  
  const goToPreviousTab = () => {
    const currentIndex = getCurrentTabIndex();
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1].id);
    }
  };

  const markAsPublished = () => {
    setIsVehiclePublished(true);
    setActiveTab('published');
  };

  return {
    activeTab,
    setActiveTab,
    tabs,
    getCurrentTabIndex,
    goToNextTab,
    goToPreviousTab,
    isVehiclePublished,
    markAsPublished
  };
};
