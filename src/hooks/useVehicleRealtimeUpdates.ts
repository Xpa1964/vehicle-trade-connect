
import { useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface VehicleUpdatePayload {
  id: string;
  status?: string;
  country?: string;
  country_code?: string;
  price?: number;
  [key: string]: any;
}

export const useVehicleRealtimeUpdates = () => {
  const queryClient = useQueryClient();

  const handleVehicleUpdate = useCallback((payload: any) => {
    console.log('🔄 [useVehicleRealtimeUpdates] Processing vehicle update:', payload);
    
    const { eventType, new: newData, old: oldData } = payload;
    
    switch (eventType) {
      case 'INSERT':
        console.log('➕ [useVehicleRealtimeUpdates] New vehicle added:', newData?.id);
        queryClient.invalidateQueries({ queryKey: ['vehicles'] });
        toast.success('Nuevo vehículo añadido', { duration: 3000 });
        break;
        
      case 'UPDATE':
        console.log('📝 [useVehicleRealtimeUpdates] Vehicle updated:', newData?.id);
        
        // Actualización optimista específica
        if (newData?.id) {
          queryClient.setQueryData(['vehicles'], (oldVehicles: any[] | undefined) => {
            if (!oldVehicles) return oldVehicles;
            
            return oldVehicles.map(vehicle => 
              vehicle.id === newData.id 
                ? { 
                    ...vehicle, 
                    status: newData.status || vehicle.status,
                    country: newData.country || vehicle.country,
                    countryCode: newData.country_code || vehicle.countryCode,
                    price: newData.price || vehicle.price,
                    updated_at: new Date().toISOString()
                  }
                : vehicle
            );
          });
          
          // También invalidar después para consistencia
          setTimeout(() => {
            queryClient.invalidateQueries({ queryKey: ['vehicles'] });
          }, 500);
        }
        
        // Notificar cambios importantes
        if (oldData?.status !== newData?.status) {
          toast.success(`Estado del vehículo actualizado: ${newData.status}`, { duration: 3000 });
        }
        break;
        
      case 'DELETE':
        console.log('🗑️ [useVehicleRealtimeUpdates] Vehicle deleted:', oldData?.id);
        queryClient.invalidateQueries({ queryKey: ['vehicles'] });
        toast.info('Vehículo eliminado', { duration: 3000 });
        break;
        
      default:
        console.log('❓ [useVehicleRealtimeUpdates] Unknown event type:', eventType);
    }
  }, [queryClient]);

  useEffect(() => {
    console.log('🔴 [useVehicleRealtimeUpdates] Setting up dedicated realtime updates');
    
    const channel = supabase
      .channel('vehicle-updates-dedicated')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'vehicles'
        },
        handleVehicleUpdate
      )
      .subscribe((status) => {
        console.log('📡 [useVehicleRealtimeUpdates] Subscription status:', status);
        
        if (status === 'SUBSCRIBED') {
          console.log('✅ [useVehicleRealtimeUpdates] Successfully subscribed to vehicle updates');
        } else if (status === 'CHANNEL_ERROR') {
          console.error('❌ [useVehicleRealtimeUpdates] Channel error occurred');
          toast.error('Error en actualizaciones en tiempo real', { duration: 5000 });
        }
      });

    return () => {
      console.log('🔴 [useVehicleRealtimeUpdates] Cleaning up dedicated realtime subscription');
      supabase.removeChannel(channel);
    };
  }, [handleVehicleUpdate]);

  return {
    // Función manual para forzar actualización
    forceRefresh: () => {
      console.log('🔄 [useVehicleRealtimeUpdates] Force refresh triggered');
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    }
  };
};
