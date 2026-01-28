
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
  const sections = [
    { id: 'basic', title: 'Detalles Básicos', component: 'basic' },
    { id: 'identification', title: 'Identificación', component: 'identification' },
    { id: 'transaction', title: 'Transacción', component: 'transaction' },
    { id: 'specs', title: 'Especificaciones', component: 'specs' },
    { id: 'equipment', title: 'Equipamiento', component: 'equipment' },
    { id: 'additional', title: 'Información Adicional', component: 'additional' },
    { id: 'damages', title: 'Daños', component: 'damages' },
    { id: 'media', title: 'Imágenes', component: 'media' },
    { id: 'published', title: 'Publicación', component: 'published' }
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
                    <CheckCircle className="h-20 w-20 text-green-500" />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-green-600">¡Vehículo Publicado Exitosamente!</h2>
                    <p className="text-gray-600">Tu vehículo ya está disponible en la plataforma</p>
                  </div>
                  
                  <div className="bg-green-50 p-6 rounded-lg space-y-4">
                    <div className="flex items-center gap-3">
                      <Car className="h-5 w-5 text-green-600" />
                      <span className="font-medium">{formData.brand} {formData.model} ({formData.year})</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-green-600" />
                      <span>{formData.location}, {formData.country}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-green-600" />
                      <span>Publicado: {new Date().toLocaleDateString('es-ES')}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-6">
                  <div className="space-y-2">
                    <h2 className="text-xl font-bold text-gray-600">Completar Publicación</h2>
                    <p className="text-gray-500">Completa todas las secciones anteriores para publicar tu vehículo</p>
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
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {section.title}
            </h2>
            <div className="w-full h-1 bg-gray-200 rounded-full">
              <div 
                className={`h-1 rounded-full transition-all duration-300 ${
                  activeSection === section.id ? 'bg-blue-500' : 'bg-gray-300'
                }`}
                style={{ width: activeSection === section.id ? '100%' : '20%' }}
              />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border p-6">
            {renderSection(section)}
          </div>
        </section>
      ))}
    </div>
  );
};
