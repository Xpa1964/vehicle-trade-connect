
import { useState, useCallback, useEffect, useRef } from 'react';

const sections = [
  { id: 'basic' },
  { id: 'identification' },
  { id: 'transaction' },
  { id: 'specs' },
  { id: 'equipment' },
  { id: 'additional' },
  { id: 'damages' },
  { id: 'media' },
  { id: 'published' }
];

export const useVehicleFormScroll = () => {
  const [activeSection, setActiveSection] = useState('basic');
  const [completedSections, setCompletedSections] = useState<string[]>([]);
  const isScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleSectionChange = useCallback((sectionId: string) => {
    setActiveSection(sectionId);
  }, []);

  const markSectionCompleted = useCallback((sectionId: string) => {
    setCompletedSections(prev => 
      prev.includes(sectionId) ? prev : [...prev, sectionId]
    );
  }, []);

  const goToSection = useCallback((sectionId: string) => {
    // Limpiar timeout anterior
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    
    // Bloquear detección automática durante scroll programático
    isScrollingRef.current = true;
    
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
      setActiveSection(sectionId);
    }
    
    // Reactivar detección después de 1000ms (tiempo suficiente para smooth scroll)
    scrollTimeoutRef.current = setTimeout(() => {
      isScrollingRef.current = false;
    }, 1000);
  }, []);

  // IntersectionObserver para detectar automáticamente la sección visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // No actualizar durante scroll programático
        if (isScrollingRef.current) return;
        
        // Encontrar la entrada más visible
        let mostVisibleEntry = entries[0];
        let maxRatio = 0;
        
        entries.forEach((entry) => {
          if (entry.intersectionRatio > maxRatio) {
            maxRatio = entry.intersectionRatio;
            mostVisibleEntry = entry;
          }
        });
        
        // Actualizar solo si está suficientemente visible (más del 20%)
        if (mostVisibleEntry && mostVisibleEntry.intersectionRatio > 0.2) {
          const sectionId = mostVisibleEntry.target.id;
          if (sectionId) {
            setActiveSection(sectionId);
          }
        }
      },
      {
        root: null,
        rootMargin: '-80px 0px -50% 0px',
        threshold: [0, 0.1, 0.3, 0.5, 0.7, 1.0]
      }
    );

    // Observar todas las secciones
    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return {
    activeSection,
    completedSections,
    handleSectionChange,
    markSectionCompleted,
    goToSection
  };
};
