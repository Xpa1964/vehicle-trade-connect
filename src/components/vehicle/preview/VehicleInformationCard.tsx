
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Info, Car, FileText, Wrench } from 'lucide-react';
import { Vehicle } from '@/types/vehicle';
import { useLanguage } from '@/contexts/LanguageContext';
import { mapDatabaseToFormData } from '@/services/vehicleDataMapper';

interface VehicleInformationCardProps {
  vehicleId: string;
}

const VehicleInformationCard: React.FC<VehicleInformationCardProps> = ({
  vehicleId
}) => {
  const { t } = useLanguage();

  // Query para obtener los datos del vehículo con mapeo correcto
  const { data: vehicle } = useQuery({
    queryKey: ['vehicle-complete-data', vehicleId],
    queryFn: async () => {
      
      
      // Obtener datos principales del vehículo
      const { data: vehicleData, error: vehicleError } = await supabase
        .from('vehicles')
        .select('*')
        .eq('id', vehicleId)
        .single();
      
      if (vehicleError) {
        console.error('❌ [VehicleInformationCard] Error fetching vehicle for display:', vehicleError);
        return null;
      }
      
      console.log('✅ [VehicleInformationCard] Raw vehicle data for display:', vehicleData);
      
      // Obtener metadata
      const { data: metadataData, error: metadataError } = await supabase
        .from('vehicle_metadata')
        .select('*')
        .eq('vehicle_id', vehicleId)
        .maybeSingle();
      
      if (metadataError) {
        console.error('⚠️ [VehicleInformationCard] Error fetching metadata for display:', metadataError);
      } else {
        console.log('✅ [VehicleInformationCard] Metadata for display:', metadataData);
      }
      
      // Usar el mapeo correcto del servicio
      const mappedVehicle = mapDatabaseToFormData(vehicleData);
      
      // Añadir metadata si está disponible
      if (metadataData) {
        mappedVehicle.mileageUnit = (metadataData.mileage_unit as 'km' | 'mi') || 'km';
        mappedVehicle.units = metadataData.units || 1;
        mappedVehicle.ivaStatus = (metadataData.iva_status as 'included' | 'notIncluded' | 'deductible' | 'rebu') || 'included';
        mappedVehicle.cocStatus = metadataData.coc_status || false;
      }
      
      // Convertir a formato Vehicle para compatibilidad
      const finalVehicle: Vehicle = {
        id: vehicleData.id,
        brand: mappedVehicle.brand || '',
        model: mappedVehicle.model || '',
        year: mappedVehicle.year || new Date().getFullYear(),
        price: mappedVehicle.price || 0,
        mileage: mappedVehicle.mileage || 0,
        fuel: mappedVehicle.fuel || '',
        transmission: mappedVehicle.transmission || '',
        location: mappedVehicle.location || '',
        country: mappedVehicle.country || '',
        countryCode: mappedVehicle.countryCode || 'es',
        description: mappedVehicle.description || '',
        status: mappedVehicle.status || 'available',
        userId: vehicleData.user_id,
        
        // Campos de identificación - usando el mapeo correcto
        vin: mappedVehicle.vin || '',
        licensePlate: mappedVehicle.licensePlate || '',
        registrationDate: mappedVehicle.registrationDate,
        vehicleType: mappedVehicle.vehicleType || '',
        transactionType: mappedVehicle.transactionType || 'national',
        acceptsExchange: mappedVehicle.acceptsExchange || false,
        
        // Detalles técnicos - usando el mapeo correcto
        engineSize: mappedVehicle.engineSize,
        enginePower: mappedVehicle.enginePower,
        color: mappedVehicle.color || '',
        doors: mappedVehicle.doors,
        
        // Metadata
        mileageUnit: mappedVehicle.mileageUnit,
        units: mappedVehicle.units,
        ivaStatus: mappedVehicle.ivaStatus,
        cocStatus: mappedVehicle.cocStatus
      };
      
      return finalVehicle;
    }
  });

  // Query para obtener información adicional
  const { data: vehicleInfo } = useQuery({
    queryKey: ['vehicle-information', vehicleId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vehicle_information')
        .select('*')
        .eq('vehicle_id', vehicleId)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching vehicle information:', error);
        return null;
      }
      
      return data;
    }
  });

  const formatValue = (value: any): string => {
    if (value === null || value === undefined || value === '') return t('vehicles.notSpecified');
    if (typeof value === 'boolean') return value ? t('vehicles.yes') : t('vehicles.no');
    if (typeof value === 'number') return value.toString();
    return value.toString();
  };

  const hasValidValue = (value: any): boolean => {
    return value !== null && value !== undefined && value !== '';
  };

  const renderInfoSection = (title: string, icon: React.ReactNode, items: Array<{ label: string; value: any }>) => {
    const validItems = items.filter(item => hasValidValue(item.value));
    
    if (validItems.length === 0) {
      return null;
    }

    return (
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          {icon}
          <h4 className="font-medium text-sm text-muted-foreground">{title}</h4>
        </div>
        <div className="grid grid-cols-1 gap-2 ml-6">
          {validItems.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#0EA5E9] rounded-full"></div>
              <span className="text-sm text-foreground">
                <strong>{item.label}:</strong> {formatValue(item.value)}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Info className="h-5 w-5 text-muted-foreground" />
          {t('vehicles.information')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {vehicle || vehicleInfo ? (
          <div>
            {/* Identificación del Vehículo */}
            {vehicle && renderInfoSection(
              t('vehicles.vehicleIdentification'),
              <Car className="h-4 w-4 text-blue-500" />,
              [
                { label: t('vehicles.vinChassisNumber'), value: vehicle.vin },
                { label: t('vehicles.licensePlateLabel'), value: vehicle.licensePlate },
                { label: t('vehicles.registrationDateLabel'), value: vehicle.registrationDate ? new Date(vehicle.registrationDate).toLocaleDateString('es-ES') : null },
                { label: t('vehicles.vehicleTypeLabel'), value: vehicle.vehicleType },
                { label: t('vehicles.transactionTypeLabel'), value: vehicle.transactionType === 'national' ? t('vehicles.transactionNational') : vehicle.transactionType === 'import' ? t('vehicles.transactionImport') : vehicle.transactionType === 'export' ? t('vehicles.transactionExport') : vehicle.transactionType },
                { label: t('vehicles.acceptsExchangeLabel'), value: vehicle.acceptsExchange }
              ]
            )}

            {/* Detalles Técnicos del Vehículo */}
            {vehicle && renderInfoSection(
              t('vehicles.technicalDetails'),
              <Wrench className="h-4 w-4 text-green-500" />,
              [
                { label: t('vehicles.enginePowerLabel'), value: vehicle.enginePower ? `${vehicle.enginePower} CV` : null },
                { label: t('vehicles.engineSizeLabel'), value: vehicle.engineSize ? `${vehicle.engineSize} cc` : null },
                { label: t('vehicles.colorLabel'), value: vehicle.color },
                { label: t('vehicles.doorsLabel'), value: vehicle.doors },
                { label: t('vehicles.fuelLabel'), value: vehicle.fuel },
                { label: t('vehicles.transmissionLabel'), value: vehicle.transmission },
                { label: t('vehicles.mileageLabel'), value: vehicle.mileage ? `${vehicle.mileage} ${vehicle.mileageUnit || 'km'}` : null }
              ]
            )}

            {/* Información Adicional */}
            {vehicle && renderInfoSection(
              t('vehicles.additionalInfo'),
              <FileText className="h-4 w-4 text-purple-500" />,
              [
                { label: t('vehicles.vehicleStatusLabel'), value: vehicle.status === 'available' ? t('vehicles.statusAvailable') : vehicle.status === 'reserved' ? t('vehicles.statusReserved') : vehicle.status === 'sold' ? t('vehicles.statusSold') : vehicle.status === 'draft' ? t('vehicles.statusDraft', { fallback: 'Borrador' }) : vehicle.status },
                { label: t('vehicles.ivaStatusLabel'), value: vehicle.ivaStatus === 'included' ? t('vehicles.ivaIncluded') : vehicle.ivaStatus === 'notIncluded' ? t('vehicles.ivaNotIncluded') : vehicle.ivaStatus === 'deductible' ? t('vehicles.ivaDeductible') : vehicle.ivaStatus === 'rebu' ? t('vehicles.ivaRebu') : vehicle.ivaStatus },
                { label: t('vehicles.descriptionLabel'), value: vehicle.description }
              ]
            )}

            {/* Especificaciones Técnicas Adicionales */}
            {vehicleInfo?.technical_specs && Object.keys(vehicleInfo.technical_specs).length > 0 && renderInfoSection(
              t('vehicles.additionalSpecifications'),
              <FileText className="h-4 w-4 text-orange-500" />,
              Object.entries(vehicleInfo.technical_specs).map(([key, value]) => ({
                label: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
                value: value
              }))
            )}

            {/* Notas Adicionales */}
            {vehicleInfo?.additional_notes && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="h-4 w-4 text-primary" />
                  <h4 className="font-medium text-sm text-muted-foreground">{t('vehicles.additionalNotesTitle')}</h4>
                </div>
                <div className="ml-6">
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <span className="text-sm text-foreground">{vehicleInfo.additional_notes}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Historial de Mantenimiento */}
            {vehicleInfo?.maintenance_history && Object.keys(vehicleInfo.maintenance_history).length > 0 && renderInfoSection(
              t('vehicles.maintenanceHistoryTitle'),
              <Wrench className="h-4 w-4 text-red-500" />,
              Object.entries(vehicleInfo.maintenance_history).map(([key, value]) => ({
                label: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
                value: value
              }))
            )}
          </div>
        ) : (
          <p className="text-muted-foreground italic">
            {t('vehicles.informationNotAvailable')}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default VehicleInformationCard;
