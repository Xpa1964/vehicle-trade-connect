
import React from 'react';
import { Vehicle } from '@/types/vehicle';
import { useLanguage } from '@/contexts/LanguageContext';
import VehicleImageGallery from './VehicleImageGallery';
import VehicleTechnicalData from './VehicleTechnicalData';
import VehicleInformationCard from './VehicleInformationCard';
import VehicleEquipmentCard from './VehicleEquipmentCard';
import VehicleActionButtons from './VehicleActionButtons';
import SellerContactCard from './SellerContactCard';
import VehicleDescription from './VehicleDescription';
import CommissionCalculator from '@/components/commission/CommissionCalculator';
import DamageAccessCard from './DamageAccessCard';
import DocumentAccessCard from './DocumentAccessCard';
import VehicleDataSheet from '../VehicleDataSheet';

interface VehicleContentLayoutProps {
  vehicle: Vehicle;
  isOwner: boolean;
  onDelete: () => void;
}

const VehicleContentLayout: React.FC<VehicleContentLayoutProps> = ({
  vehicle,
  isOwner,
  onDelete
}) => {
  const { t } = useLanguage();
  

  console.log('VehicleContentLayout - Vehicle commission data:', {
    commissionSale: vehicle.commissionSale,
    publicSalePrice: vehicle.publicSalePrice,
    commissionAmount: vehicle.commissionAmount
  });

  return (
    <div className="space-y-8">
      {/* SECCIÓN SUPERIOR: Imagen Principal + Información Técnica */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Columna Izquierda (2/3): Imagen Principal + Carrusel + Botones */}
        <div className="lg:col-span-2 space-y-4">
          {/* 1, 2 - Imagen Principal + Carrusel */}
          <VehicleImageGallery vehicle={vehicle} />
          
          {/* 4, 5, 6, 7 - Botones de Acción horizontales debajo del carrusel */}
          <VehicleActionButtons
            vehicle={vehicle}
            isOwner={isOwner}
            onDelete={onDelete}
          />
        </div>

        {/* Columna Derecha (1/3): Información Técnica */}
        <div className="space-y-6">
          {/* 3 - Información Técnica con botones de contacto integrados */}
          <VehicleTechnicalData vehicle={vehicle} isOwner={isOwner} />
        </div>
      </div>

      {/* SECCIÓN MEDIA: Perfil del Vendedor + Descripción */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* 8 - Perfil del vendedor (pequeño) */}
        <div className="lg:col-span-1 flex flex-col">
          <SellerContactCard vehicle={vehicle} />
        </div>
        
        {/* 9 - Descripción del vehículo */}
        <div className="lg:col-span-3 flex flex-col">
          {vehicle.description && (
            <VehicleDescription description={vehicle.description} />
          )}
        </div>
      </div>

      {/* SECCIÓN INFERIOR: Grid de 3 columnas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 10 - Equipamiento */}
        <div>
          <VehicleEquipmentCard vehicleId={vehicle.id} />
        </div>

        {/* 11 - Información (movido desde la columna derecha) */}
        <div>
          <VehicleInformationCard vehicleId={vehicle.id} />
        </div>

        {/* 12, 13, 14, 15 - Calculadora + Ficha + Daños + Archivos */}
        <div className="space-y-6">
          {/* 12 - Calculadora de Comisiones */}
          <CommissionCalculator 
            initialPrice={vehicle.price}
            compact={true}
            showTitle={true}
          />
          
          {/* 13 - Ficha Técnica Descargable */}
          <VehicleDataSheet vehicle={vehicle} />
          
          {/* 14 - Acceso a Daños */}
          <DamageAccessCard vehicleId={vehicle.id} />
          
          {/* 15 - Acceso a Archivos */}
          <DocumentAccessCard vehicleId={vehicle.id} />
        </div>
      </div>
    </div>
  );
};

export default VehicleContentLayout;
