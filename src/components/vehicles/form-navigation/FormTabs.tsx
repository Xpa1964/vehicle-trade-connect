
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { UseFormReturn } from 'react-hook-form';
import { VehicleFormData } from '@/types/vehicle';
import { CheckCircle, Car, Calendar, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import BasicDetails from '../form-sections/BasicDetails';
import { VehicleSpecs } from '../form-sections/VehicleSpecs';
import { AdditionalInfo } from '../form-sections/AdditionalInfo';
import { FileUpload } from '../form-sections/FileUpload';
import { EquipmentSelection } from '../form-sections/EquipmentSelection';
import { VehicleIdentification } from '../form-sections/VehicleIdentification';
import { TransactionDetails } from '../form-sections/TransactionDetails';
import { DamagesSection } from '../form-sections/DamagesSection';

interface FormTabsProps {
  form: UseFormReturn<VehicleFormData>;
  formData: any;
  onChange: (field: string, value: string | number) => void;
  onBrandChange: (value: string) => void;
  availableModels: string[];
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  previewUrl: string | null;
  isVehiclePublished?: boolean;
}

export const FormTabs: React.FC<FormTabsProps> = ({
  form,
  formData,
  onChange,
  onBrandChange,
  availableModels,
  onImageChange,
  previewUrl,
  isVehiclePublished = false
}) => {
  return (
    <>
      <TabsContent value="basic" className="space-y-6">
        <BasicDetails 
          formData={formData}
          onChange={onChange}
          onBrandChange={onBrandChange}
          availableModels={availableModels}
        />
        <TransactionDetails form={form} />
      </TabsContent>
      
      <TabsContent value="identification" className="space-y-6">
        <VehicleIdentification form={form} />
      </TabsContent>
      
      <TabsContent value="specs" className="space-y-6">
        <VehicleSpecs form={form} />
        <EquipmentSelection form={form} />
      </TabsContent>
      
      <TabsContent value="additional" className="space-y-6">
        <AdditionalInfo form={form} />
      </TabsContent>
      
      <TabsContent value="damages" className="space-y-6">
        <DamagesSection form={form} />
      </TabsContent>
      
      <TabsContent value="media" className="space-y-6">
        <FileUpload 
          form={form}
          onImageChange={onImageChange}
          previewUrl={previewUrl}
        />
      </TabsContent>

      <TabsContent value="published" className="space-y-6">
        <Card className="w-full">
          <CardContent className="pt-6">
        {isVehiclePublished ? (
              <div className="text-center space-y-6">
                <div className="flex justify-center">
                  <CheckCircle className="h-20 w-20 text-success" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-success">¡Vehículo Publicado Exitosamente!</h2>
                  <p className="text-muted-foreground">Tu vehículo ya está disponible en la plataforma</p>
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
                    <span className="text-foreground">Publicado: {new Date().toLocaleDateString('es-ES')}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Tu vehículo aparecerá en los resultados de búsqueda y será visible para compradores potenciales.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Recibirás notificaciones cuando haya consultas o ofertas.
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-6">
                <div className="space-y-2">
                  <h2 className="text-xl font-bold text-muted-foreground">Completar Publicación</h2>
                  <p className="text-muted-foreground">Completa todas las secciones anteriores para publicar tu vehículo</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </>
  );
};
