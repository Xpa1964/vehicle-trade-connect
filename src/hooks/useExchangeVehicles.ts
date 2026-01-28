
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ExchangeProposal } from '@/types/conversation';
import { Vehicle } from '@/types/vehicle';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

export function useExchangeVehicles() {
  const { user } = useAuth();
  const [exchangeVehicles, setExchangeVehicles] = useState<{
    offered: Partial<Vehicle> | null,
    requested: Partial<Vehicle> | null
  }>({ offered: null, requested: null });
  
  const [userVehicles, setUserVehicles] = useState<Vehicle[]>([]);
  const [allExchangeVehicles, setAllExchangeVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch user's vehicles for exchange selection
  const fetchUserVehicles = async (userId: string) => {
    if (!userId) return [];
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'available');
        
      if (error) throw error;
      
      const vehicles = data.map(vehicle => {
        console.log('Mapping user vehicle:', { id: vehicle.id, thumbnailurl: vehicle.thumbnailurl });
        return {
          ...vehicle,
          fuel: vehicle.fuel || vehicle.type || 'unknown',
          transmission: vehicle.transmission || (vehicle.description?.includes('automatic') ? 'automatic' : 'manual'),
          countryCode: vehicle.country_code || 'es',
          thumbnailUrl: vehicle.thumbnailurl || '',
          mileageUnit: 'km' as 'km' | 'mi',
          acceptsExchange: Boolean(vehicle.accepts_exchange),
          currency: 'EUR',
          userId: vehicle.user_id
        };
      });
      
      setUserVehicles(vehicles);
      return vehicles;
    } catch (error) {
      console.error('Error fetching user vehicles:', error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch ALL vehicles that accept exchange, excluding user's own vehicles
  const fetchAllExchangeVehicles = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('vehicles')
        .select('*')
        .eq('accepts_exchange', true)
        .eq('status', 'available')
        .order('created_at', { ascending: false });
      
      // Exclude user's own vehicles if user is authenticated
      if (user?.id) {
        query = query.neq('user_id', user.id);
      }
      
      const { data, error } = await query;
        
      if (error) throw error;
      
      const vehicles = data.map(vehicle => {
        console.log('Mapping exchange vehicle:', { id: vehicle.id, thumbnailurl: vehicle.thumbnailurl });
        return {
          ...vehicle,
          fuel: vehicle.fuel || vehicle.type || 'unknown',
          transmission: vehicle.transmission || (vehicle.description?.includes('automatic') ? 'automatic' : 'manual'),
          countryCode: vehicle.country_code || 'es',
          thumbnailUrl: vehicle.thumbnailurl || '',
          mileageUnit: 'km' as 'km' | 'mi',
          acceptsExchange: Boolean(vehicle.accepts_exchange),
          currency: 'EUR',
          userId: vehicle.user_id
        };
      });
      
      setAllExchangeVehicles(vehicles);
      return vehicles;
    } catch (error) {
      console.error('Error fetching exchange vehicles:', error);
      toast.error('Error fetching exchange vehicles');
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchUserVehicles(user.id);
    }
    // Always fetch all exchange vehicles regardless of user
    fetchAllExchangeVehicles();
  }, [user?.id]);

  const fetchExchangeVehicles = async (proposal: ExchangeProposal) => {
    if (!proposal.offeredVehicleId && !proposal.requestedVehicleId) return;
    
    setIsLoading(true);
    try {
      let offeredVehicle = null;
      let requestedVehicle = null;
      
      if (proposal.offeredVehicleId) {
        const { data } = await supabase
          .from('vehicles')
          .select('*')
          .eq('id', proposal.offeredVehicleId)
          .single();
          
        if (data) offeredVehicle = {
          ...data,
          fuel: data.type || 'unknown',
          transmission: data.description?.includes('automatic') ? 'automatic' : 'manual',
          countryCode: data.country_code || 'es',
          thumbnailUrl: data.thumbnailurl || '',
          mileageUnit: 'km' as 'km' | 'mi',
          acceptsExchange: true,
          currency: 'EUR'
        };
      }
      
      if (proposal.requestedVehicleId) {
        const { data } = await supabase
          .from('vehicles')
          .select('*')
          .eq('id', proposal.requestedVehicleId)
          .single();
          
        if (data) requestedVehicle = {
          ...data,
          fuel: data.type || 'unknown',
          transmission: data.description?.includes('automatic') ? 'automatic' : 'manual',
          countryCode: data.country_code || 'es',
          thumbnailUrl: data.thumbnailurl || '',
          mileageUnit: 'km' as 'km' | 'mi',
          acceptsExchange: true,
          currency: 'EUR'
        };
      }
      
      setExchangeVehicles({
        offered: offeredVehicle,
        requested: requestedVehicle
      });
    } catch (error) {
      console.error('Error fetching exchange vehicles:', error);
      toast.error('Error fetching vehicle details');
    } finally {
      setIsLoading(false);
    }
  };
  
  const createExchangeProposal = async (
    conversationId: string, 
    offeredVehicleId: string, 
    requestedVehicleId: string, 
    compensation: number = 0,
    conditions: string[] = []
  ) => {
    try {
      // This would typically save to a database table, but for now we're just
      // sending a structured message to the conversation
      const proposalData = {
        type: 'exchange_proposal',
        offeredVehicleId,
        requestedVehicleId,
        compensation,
        conditions,
        status: 'pending',
        created_at: new Date().toISOString()
      };
      
      if (!user?.id) {
        throw new Error('User not authenticated');
      }
      
      // Create a message containing the proposal
      const { data, error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: user.id,
          content: JSON.stringify(proposalData)
        })
        .select();
        
      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error('Error creating exchange proposal:', error);
      throw error;
    }
  };

  return {
    exchangeVehicles,
    userVehicles,
    allExchangeVehicles, // New: all vehicles accepting exchange
    isLoading,
    fetchExchangeVehicles,
    fetchUserVehicles,
    fetchAllExchangeVehicles, // New function
    createExchangeProposal
  };
}
