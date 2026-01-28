import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface RecommendationResponse {
  success: boolean;
  recommendations: string[];
  reasoning: string[];
  confidence_score: number;
  cached: boolean;
  generated_at: string;
}

interface VehicleData {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  image_url?: string;
  status: string;
  description?: string;
}

export const useVehicleRecommendations = () => {
  const { user, isAuthenticated } = useAuth();
  const [recommendedVehicles, setRecommendedVehicles] = useState<VehicleData[]>([]);

  // Track vehicle visit
  const trackVehicleVisit = useCallback(async (
    vehicleId: string, 
    interactionType: 'view' | 'click' | 'search' | 'filter' = 'view',
    sourcePage: string = 'gallery'
  ) => {
    if (!isAuthenticated || !user) return;

    try {
      await supabase
        .from('user_vehicle_visits')
        .insert({
          user_id: user.id,
          vehicle_id: vehicleId,
          interaction_type: interactionType,
          source_page: sourcePage,
          visit_duration: 0
        });
    } catch (error) {
      console.error('Error tracking vehicle visit:', error);
    }
  }, [user, isAuthenticated]);

  // Get recommendations from Edge Function
  const {
    data: recommendationsData,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['vehicle-recommendations', user?.id],
    queryFn: async (): Promise<RecommendationResponse> => {
      if (!isAuthenticated || !user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase.functions.invoke<RecommendationResponse>(
        'vehicle-recommendations',
        {
          body: { user_id: user.id }
        }
      );

      if (error) throw error;
      return data;
    },
    enabled: isAuthenticated && !!user,
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
    retry: 1,
    refetchOnWindowFocus: false
  });

  // Fetch vehicle details for recommendations
  useEffect(() => {
    const fetchRecommendedVehicles = async () => {
      if (!recommendationsData?.recommendations?.length) {
        setRecommendedVehicles([]);
        return;
      }

      try {
        const { data: vehicles, error } = await supabase
          .from('vehicles')
          .select(`
            id,
            brand,
            model,
            year,
            price,
            status,
            description,
            vehicle_images!left (
              image_url,
              is_primary
            )
          `)
          .in('id', recommendationsData.recommendations)
          .eq('status', 'available');

        if (error) throw error;

        // Map vehicles with primary image
        const vehiclesWithImages: VehicleData[] = (vehicles || []).map(vehicle => ({
          id: vehicle.id,
          brand: vehicle.brand,
          model: vehicle.model,
          year: vehicle.year,
          price: vehicle.price,
          status: vehicle.status,
          description: vehicle.description,
          image_url: vehicle.vehicle_images?.find((img: any) => img.is_primary)?.image_url ||
                    vehicle.vehicle_images?.[0]?.image_url ||
                    '/placeholder.svg'
        }));

        // Maintain recommendation order
        const orderedVehicles = recommendationsData.recommendations
          .map(id => vehiclesWithImages.find(v => v.id === id))
          .filter(Boolean) as VehicleData[];

        setRecommendedVehicles(orderedVehicles);
      } catch (error) {
        console.error('Error fetching recommended vehicles:', error);
        setRecommendedVehicles([]);
      }
    };

    fetchRecommendedVehicles();
  }, [recommendationsData]);

  return {
    recommendedVehicles,
    reasoning: recommendationsData?.reasoning || [],
    confidenceScore: recommendationsData?.confidence_score || 0,
    isLoading,
    error,
    isAuthenticated,
    trackVehicleVisit,
    refetchRecommendations: refetch,
    cached: recommendationsData?.cached || false
  };
};