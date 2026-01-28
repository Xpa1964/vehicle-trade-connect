import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import VehicleComparisonCard from './VehicleComparisonCard';
import { supabase } from '@/integrations/supabase/client';

interface ExchangeProposalMessageProps {
  proposal: {
    offeredVehicleId: string;
    requestedVehicleId: string;
    offeredVehicleDetails?: {
      brand: string;
      model: string;
      year: number;
      price?: number;
      thumbnailUrl?: string;
      mileage?: number;
      location?: string;
      condition?: string;
    };
    compensation: number;
    conditions?: string;
    status: 'pending' | 'accepted' | 'rejected' | 'counteroffered';
  };
  currentUserId: string;
  senderId: string;
  onAccept: () => void;
  onReject: () => void;
  onCounterOffer: () => void;
}

interface VehicleData {
  brand: string;
  model: string;
  year: number;
  price?: number;
  thumbnailUrl?: string;
  mileage?: number;
  location?: string;
  condition?: string;
}

export const ExchangeProposalMessage: React.FC<ExchangeProposalMessageProps> = ({
  proposal,
  currentUserId,
  senderId,
  onAccept,
  onReject,
  onCounterOffer
}) => {
  const { t } = useLanguage();
  const isSentByCurrentUser = currentUserId === senderId;
  
  const [offeredVehicleData, setOfferedVehicleData] = useState<VehicleData | null>(null);
  const [requestedVehicleData, setRequestedVehicleData] = useState<VehicleData | null>(null);
  const [isLoadingVehicles, setIsLoadingVehicles] = useState(true);
  
  // Determinar si se deben mostrar botones de acción
  const showActions = proposal.status === 'pending' && !isSentByCurrentUser;
  
  // Función para cargar datos de un vehículo
  const fetchVehicleData = async (vehicleId: string): Promise<VehicleData | null> => {
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .select('brand, model, year, price, thumbnailurl, mileage, location, condition')
        .eq('id', vehicleId)
        .single();
      
      if (error) {
        console.error('Error fetching vehicle data:', error);
        return null;
      }
      
      return {
        brand: data.brand,
        model: data.model,
        year: data.year,
        price: data.price,
        thumbnailUrl: data.thumbnailurl,
        mileage: data.mileage,
        location: data.location,
        condition: data.condition
      };
    } catch (error) {
      console.error('Error fetching vehicle data:', error);
      return null;
    }
  };

  // Cargar datos de vehículos al montar el componente
  useEffect(() => {
    const loadVehicleData = async () => {
      setIsLoadingVehicles(true);
      
      // Cargar datos del vehículo ofrecido
      if (proposal.offeredVehicleDetails) {
        // Si ya tenemos los datos, usarlos
        setOfferedVehicleData({
          brand: proposal.offeredVehicleDetails.brand,
          model: proposal.offeredVehicleDetails.model,
          year: proposal.offeredVehicleDetails.year,
          price: proposal.offeredVehicleDetails.price,
          thumbnailUrl: proposal.offeredVehicleDetails.thumbnailUrl,
          mileage: proposal.offeredVehicleDetails.mileage,
          location: proposal.offeredVehicleDetails.location,
          condition: proposal.offeredVehicleDetails.condition
        });
      } else {
        // Si no, cargar desde la base de datos
        const offeredData = await fetchVehicleData(proposal.offeredVehicleId);
        setOfferedVehicleData(offeredData);
      }
      
      // Cargar datos del vehículo solicitado
      const requestedData = await fetchVehicleData(proposal.requestedVehicleId);
      setRequestedVehicleData(requestedData);
      
      setIsLoadingVehicles(false);
    };

    loadVehicleData();
  }, [proposal.offeredVehicleId, proposal.requestedVehicleId, proposal.offeredVehicleDetails]);

  // Datos por defecto si no se pueden cargar
  const defaultOfferedVehicle = offeredVehicleData || {
    brand: 'Vehículo',
    model: 'Ofrecido',
    year: new Date().getFullYear(),
    price: 0,
    thumbnailUrl: '',
    mileage: 0,
    location: 'Ubicación no disponible',
    condition: 'Estado no disponible'
  };

  const defaultRequestedVehicle = requestedVehicleData || {
    brand: 'Vehículo',
    model: 'Solicitado',
    year: new Date().getFullYear(),
    price: 0,
    thumbnailUrl: '',
    mileage: 0,
    location: 'Ubicación no disponible',
    condition: 'Estado no disponible'
  };

  if (isLoadingVehicles) {
    return (
      <Card className="border shadow-sm mb-4">
        <CardContent className="pt-4">
          <div className="flex items-center justify-center p-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-sm text-gray-600">Cargando datos de vehículos...</span>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="border shadow-sm mb-4">
      <CardContent className="pt-4">
        <VehicleComparisonCard 
          offeredVehicle={{
            id: proposal.offeredVehicleId,
            brand: defaultOfferedVehicle.brand,
            model: defaultOfferedVehicle.model,
            year: defaultOfferedVehicle.year,
            price: defaultOfferedVehicle.price,
            thumbnailUrl: defaultOfferedVehicle.thumbnailUrl,
            mileage: defaultOfferedVehicle.mileage,
            location: defaultOfferedVehicle.location,
            condition: defaultOfferedVehicle.condition,
            currency: 'EUR',
            mileageUnit: 'km'
          }}
          requestedVehicle={{ 
            id: proposal.requestedVehicleId,
            brand: defaultRequestedVehicle.brand,
            model: defaultRequestedVehicle.model,
            year: defaultRequestedVehicle.year,
            price: defaultRequestedVehicle.price,
            thumbnailUrl: defaultRequestedVehicle.thumbnailUrl,
            mileage: defaultRequestedVehicle.mileage,
            location: defaultRequestedVehicle.location,
            condition: defaultRequestedVehicle.condition,
            currency: 'EUR',
            mileageUnit: 'km'
          }}
          compensation={proposal.compensation}
          conditions={proposal.conditions}
          status={proposal.status}
          showActions={showActions}
          onViewDetails={() => {}}
          onAccept={onAccept}
          onReject={onReject}
          onCounterOffer={onCounterOffer}
        />
      </CardContent>
    </Card>
  );
};
