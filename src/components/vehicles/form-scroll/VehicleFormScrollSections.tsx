import React, { useEffect, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { VehicleFormData } from '@/types/vehicle';
import BasicDetails from '../form-sections/BasicDetails';
import { VehicleSpecs } from '../form-sections/VehicleSpecs';
import { AdditionalInfo } from '../form-sections/AdditionalInfo';
import { FileUpload } from '../form-sections/FileUpload';
import { EquipmentSelection } from '../form-sections/EquipmentSelection';
import { VehicleIdentification } from '../form-sections/VehicleIdentification';
import { TransactionDetails } from '../form-sections/TransactionDetails';
import { DamagesSection } from '../form-sections/DamagesSection';
import { CheckCircle, Car, Calendar, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

interface VehicleFormScrollSectionsProps {
  form: UseFormReturn<VehicleFormData>;
  formData: any;
  onChange: (field: string, value: string | number) => void;
  onBrandChange: (value: string) => void;
  availableModels: string[];
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  previewUrl: string | null;
  isVehiclePublished?: boolean;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export const VehicleFormScrollSections: React.FC<VehicleFormScrollSectionsProps> = ({
  form,
  formData,
  onChange,
  onBrandChange,
  availableModels,
  onImageChange,
  previewUrl,
  isVehiclePublished = false,
  activeSection,
  onSectionChange
}) => {
  const { t } = useLanguage();

  const sections = [
    { id: 'basic', title: t('vehicleForm.basicDetails'), component: 'basic' },
    { id: 'identification', title: t('vehicleForm.identification'), component: 'identification' },
    { id: 'transaction', title: t('vehicleForm.transaction'), component: 'transaction' },
    { id: 'specs', title: t('vehicleForm.specifications'), component: 'specs' },
    { id: 'equipment', title: t('vehicleForm.equipment'), component: 'equipment' },
    { id: 'additional', title: t('vehicleForm.additionalInfo'), component: 'additional' },
    { id: 'damages', title: t('vehicleForm.damages'), component: 'damages' },
    { id: 'media', title: t('vehicleForm.images'), component: 'media' },
    { id: 'published', title: t('vehicleForm.publication'), component: 'published' }
  ];

  // Scroll spy effect - Mejorado para evitar conflictos con navegación manual
  useEffect(() => {
    let isManualScroll = false;
    let manualScrollTimer: NodeJS.Timeout;

    const observer = new IntersectionObserver(
      (entries) => {
        // Solo actualizar si no es un scroll manual
        if (isManualScroll) return;

        // Encontrar la sección más visible
        let mostVisibleEntry = entries.find(entry => entry.isIntersecting);
        if (mostVisibleEntry && mostVisibleEntry.intersectionRatio > 0.3) {
          onSectionChange(mostVisibleEntry.target.id);
        }
      },
      {
        threshold: [0.1, 0.3, 0.5, 0.7],
        rootMargin: '-80px 0px -50% 0px'
      }
    );

    // Detectar scroll manual y pausar observer temporalmente
    const handleScroll = () => {
      isManualScroll = true;
      clearTimeout(manualScrollTimer);
      manualScrollTimer = setTimeout(() => {
        isManualScroll = false;
      }, 1000); // Pausa de 1 segundo después del scroll manual
    };

    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) {
        observer.observe(element);
      }
    });

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(manualScrollTimer);
    };
  }, [onSectionChange]);

  const renderSection = (section: any) => {
    switch (section.component) {
      case 'basic':
        return (
          <BasicDetails 
            formData={formData}
            onChange={onChange}
            onBrandChange={onBrandChange}
            availableModels={availableModels}
          />
        );
      case 'identification':
        return <VehicleIdentification form={form} />;
      case 'transaction':
        return <TransactionDetails form={form} />;
      case 'specs':
        return <VehicleSpecs form={form} />;
      case 'equipment':
        return <EquipmentSelection form={form} />;
      case 'additional':
        return <AdditionalInfo form={form} />;
      case 'damages':
        return <DamagesSection form={form} />;
      case 'media':
        return (
          <FileUpload 
            form={form}
            onImageChange={onImageChange}
            previewUrl={previewUrl}
          />
        );
      case 'published':
        return (
          <Card className="w-full">
            <CardContent className="pt-6">
              {isVehiclePublished ? (
                <div className="text-center space-y-6">
                  <div className="flex justify-center">
                    <CheckCircle className="h-20 w-20 text-success" />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-success">{t('vehicleForm.publishedSuccess')}</h2>
                    <p className="text-muted-foreground">{t('vehicleForm.publishedDesc')}</p>
                  </div>
                  
                  <div className="bg-success/10 p-6 rounded-lg space-y-4">
                    <div className="flex items-center gap-3">
                      <Car className="h-5 w-5 text-success" />
                      <span className="font-medium text-foreground">{formData.brand} {formData.model} ({formData.year})</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-success" />
                      <span className="text-foreground">{formData.location}, {formData.country}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-success" />
                      <span className="text-foreground">{t('vehicleForm.publishedDate')}: {new Date().toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-6">
                  <div className="space-y-2">
                    <h2 className="text-xl font-bold text-muted-foreground">{t('vehicleForm.completePublication')}</h2>
                    <p className="text-muted-foreground">{t('vehicleForm.completePublicationDesc')}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      {sections.map((section) => (
        <section
          key={section.id}
          id={section.id}
          className="scroll-mt-24"
        >
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              {section.title}
            </h2>
            <div className="w-full h-1 bg-muted rounded-full">
              <div 
                className={`h-1 rounded-full transition-all duration-300 ${
                  activeSection === section.id ? 'bg-primary' : 'bg-border'
                }`}
                style={{ width: activeSection === section.id ? '100%' : '20%' }}
              />
            </div>
          </div>
          
          <div className="bg-card rounded-lg shadow-sm border border-border p-6">
            {renderSection(section)}
          </div>
        </section>
      ))}
    </div>
  );
};
