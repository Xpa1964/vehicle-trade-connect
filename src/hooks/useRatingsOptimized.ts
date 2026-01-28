import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface RatingData {
  rating: number;
  comment: string;
  transactionType: string;
}

interface CreateRatingParams {
  toUserId: string;
  ratingData: RatingData;
}

interface RatingWithProfile {
  id: string;
  from_user_id: string;
  to_user_id: string;
  rating: number;
  comment: string;
  created_at: string;
  verified: boolean;
  transaction_type: string;
  from_user_profile: {
    full_name: string | null;
    company_name: string | null;
  } | null;
}

interface RatingSummary {
  average_rating: number;
  total_ratings: number;
  verified_ratings: number;
}

export const useRatingsOptimized = (userId?: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Optimized ratings query - only fetch essential data first
  const { data: ratingSummary, isLoading: summaryLoading } = useQuery({
    queryKey: ['rating-summary-fast', userId],
    queryFn: async (): Promise<RatingSummary> => {
      if (!userId) return { average_rating: 0, total_ratings: 0, verified_ratings: 0 };
      
      console.log('🚀 Fast rating summary for userId:', userId);
      
      const { data: ratingsData, error } = await supabase
        .from('ratings')
        .select('rating, verified')
        .eq('to_user_id', userId);
        
      if (error) {
        console.error('❌ Fast ratings query error:', error);
        return { average_rating: 0, total_ratings: 0, verified_ratings: 0 };
      }

      if (!ratingsData || ratingsData.length === 0) {
        return { average_rating: 0, total_ratings: 0, verified_ratings: 0 };
      }

      const totalRatings = ratingsData.length;
      const sumRatings = ratingsData.reduce((sum, r) => sum + r.rating, 0);
      const averageRating = sumRatings / totalRatings;
      const verifiedRatings = ratingsData.filter(r => r.verified).length;

      const result = {
        average_rating: Number(averageRating.toFixed(1)),
        total_ratings: totalRatings,
        verified_ratings: verifiedRatings
      };

      console.log('🚀 Fast summary result:', result);
      return result;
    },
    enabled: !!userId,
    staleTime: 30000, // Cache for 30 seconds
    gcTime: 5 * 60 * 1000 // Keep in cache for 5 minutes
  });

  // Detailed ratings query - lazy loaded
  const { data: ratings, isLoading: ratingsLoading } = useQuery({
    queryKey: ['ratings-detailed', userId],
    queryFn: async (): Promise<RatingWithProfile[]> => {
      if (!userId) return [];
      
      console.log('🔍 Fetching detailed ratings for userId:', userId);
      
      const { data: ratingsData, error: ratingsError } = await supabase
        .from('ratings')
        .select('*')
        .eq('to_user_id', userId)
        .order('created_at', { ascending: false })
        .limit(10); // Limit to latest 10 ratings for performance
        
      if (ratingsError) {
        console.error('Error fetching detailed ratings:', ratingsError);
        return [];
      }

      if (!ratingsData || ratingsData.length === 0) {
        return [];
      }

      const userIds = [...new Set(ratingsData.map(rating => rating.from_user_id))];
      
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, company_name')
        .in('id', userIds);
        
      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
      }

      const ratingsWithProfiles: RatingWithProfile[] = ratingsData.map(rating => ({
        ...rating,
        from_user_profile: profilesData?.find(profile => profile.id === rating.from_user_id) || null
      }));

      return ratingsWithProfiles;
    },
    enabled: !!userId && !!ratingSummary && ratingSummary.total_ratings > 0,
    staleTime: 60000, // Cache detailed ratings for 1 minute
    gcTime: 10 * 60 * 1000
  });

  // Create rating mutation
  const createRating = useMutation({
    mutationFn: async ({ toUserId, ratingData }: CreateRatingParams) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('ratings')
        .insert({
          from_user_id: user.id,
          to_user_id: toUserId,
          rating: ratingData.rating,
          comment: ratingData.comment,
          transaction_type: ratingData.transactionType,
          verified: false
        })
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Valoración enviada",
        description: "Tu valoración ha sido guardada correctamente",
      });
      
      // Refresh all rating data
      queryClient.invalidateQueries({ queryKey: ['rating-summary-fast', userId] });
      queryClient.invalidateQueries({ queryKey: ['ratings-detailed', userId] });
    },
    onError: (error: any) => {
      console.error('Error creating rating:', error);
      toast({
        title: "Error",
        description: "No se pudo guardar la valoración",
        variant: "destructive"
      });
    }
  });

  return {
    ratings: ratings || [],
    ratingSummary: ratingSummary || { average_rating: 0, total_ratings: 0, verified_ratings: 0 },
    ratingsLoading: summaryLoading || ratingsLoading,
    createRating: createRating.mutate,
    isCreatingRating: createRating.isPending
  };
};