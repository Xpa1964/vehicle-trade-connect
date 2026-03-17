
import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export const useVehicleFormTabs = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("identification");
  const [isVehiclePublished, setIsVehiclePublished] = useState(false);

  // Define the tab order and labels - Identificación primero
  const tabs = [
    { id: 'identification', label: t('vehicles.identification', { fallback: 'Identificación' }) },
    { id: 'basic', label: t('vehicles.basicDetails', { fallback: 'Detalles Básicos' }) },
    { id: 'transaction', label: t('vehicles.transactionDetails', { fallback: 'Transacción' }) },
    { id: 'specs', label: t('vehicles.technicalDetails', { fallback: 'Especificaciones' }) },
    { id: 'equipment', label: t('vehicles.equipment', { fallback: 'Equipamiento' }) },
    { id: 'additional', label: t('vehicles.additionalInfo', { fallback: 'Info Adicional' }) },
    { id: 'damages', label: t('vehicles.damages', { fallback: 'Daños' }) },
    { id: 'media', label: t('vehicles.images', { fallback: 'Imágenes' }) },
    { id: 'published', label: t('vehicles.publish', { fallback: 'Publicar' }) }
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
