
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

export const useRatings = (userId?: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get ratings for a specific user
  const { data: ratings, isLoading: ratingsLoading } = useQuery({
    queryKey: ['ratings', userId],
    queryFn: async (): Promise<RatingWithProfile[]> => {
      if (!userId) return [];
      
      console.log('🔍 useRatings - Fetching ratings for userId:', userId);
      
      // First, get the ratings
      const { data: ratingsData, error: ratingsError } = await supabase
        .from('ratings')
        .select('*')
        .eq('to_user_id', userId)
        .order('created_at', { ascending: false });
        
      if (ratingsError) {
        console.error('Error fetching ratings:', ratingsError);
        return [];
      }

      console.log('🔍 useRatings - Raw ratings data:', ratingsData);

      if (!ratingsData || ratingsData.length === 0) {
        return [];
      }

      // Get unique user IDs from ratings
      const userIds = [...new Set(ratingsData.map(rating => rating.from_user_id))];
      
      // Get profiles for those users
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, company_name')
        .in('id', userIds);
        
      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        // Continue without profile data instead of failing completely
      }

      // Combine ratings with profile data
      const ratingsWithProfiles: RatingWithProfile[] = ratingsData.map(rating => ({
        ...rating,
        from_user_profile: profilesData?.find(profile => profile.id === rating.from_user_id) || null
      }));

      console.log('🔍 useRatings - Final ratings with profiles:', ratingsWithProfiles);
      return ratingsWithProfiles;
    },
    enabled: !!userId
  });

  // NUEVA ESTRATEGIA: Query directo a ratings como fallback principal
  const { data: directRatingSummary } = useQuery({
    queryKey: ['rating-summary-direct', userId],
    queryFn: async (): Promise<RatingSummary> => {
      if (!userId) return { average_rating: 0, total_ratings: 0, verified_ratings: 0 };
      
      console.log('🔍 useRatings - Direct query for rating summary, userId:', userId);
      
      const { data: ratingsData, error } = await supabase
        .from('ratings')
        .select('rating, verified')
        .eq('to_user_id', userId);
        
      if (error) {
        console.error('❌ Direct ratings query error:', error);
        return { average_rating: 0, total_ratings: 0, verified_ratings: 0 };
      }

      console.log('✅ Direct ratings data:', ratingsData);

      if (!ratingsData || ratingsData.length === 0) {
        console.log('📊 No ratings found for user');
        return { average_rating: 0, total_ratings: 0, verified_ratings: 0 };
      }

      // Calcular manualmente
      const totalRatings = ratingsData.length;
      const sumRatings = ratingsData.reduce((sum, r) => sum + r.rating, 0);
      const averageRating = sumRatings / totalRatings;
      const verifiedRatings = ratingsData.filter(r => r.verified).length;

      const result = {
        average_rating: Number(averageRating.toFixed(1)),
        total_ratings: totalRatings,
        verified_ratings: verifiedRatings
      };

      console.log('📊 Direct calculation result:', result);
      return result;
    },
    enabled: !!userId
  });

  // Query RPC como backup (secundario)
  const { data: rpcRatingSummary } = useQuery({
    queryKey: ['rating-summary-rpc', userId],
    queryFn: async (): Promise<RatingSummary | null> => {
      if (!userId) return null;
      
      console.log('🔍 useRatings - RPC query for rating summary, userId:', userId);
      
      const { data, error } = await supabase
        .rpc('get_user_rating_summary', { p_user_id: userId });
        
      if (error) {
        console.error('❌ RPC query error:', error);
        return null;
      }

      console.log('📡 RPC response data:', data);

      // The RPC returns a jsonb object directly, not an array
      if (data && typeof data === 'object') {
        const summaryData = data as Record<string, unknown>;
        console.log('📡 RPC summary object:', summaryData);
        
        const result: RatingSummary = {
          average_rating: Number(summaryData.average_rating) || 0,
          total_ratings: Number(summaryData.total_ratings) || 0,
          verified_ratings: 0
        };
        
        console.log('📡 RPC final result:', result);
        return result;
      }
      
      return null;
    },
    enabled: !!userId
  });

  // ESTRATEGIA: Usar directRatingSummary como principal, rpcRatingSummary como backup
  const ratingSummary = directRatingSummary || rpcRatingSummary || { average_rating: 0, total_ratings: 0, verified_ratings: 0 };

  console.log('🎯 Final ratingSummary being returned:', {
    directRatingSummary,
    rpcRatingSummary,
    finalRatingSummary: ratingSummary
  });

  // Create a new rating
  const createRating = useMutation({
    mutationFn: async ({ toUserId, ratingData }: CreateRatingParams) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('ratings')
        .insert({
          rater_id: user.id,
          rated_id: toUserId,
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
      
      // Refresh ratings data
      queryClient.invalidateQueries({ queryKey: ['ratings', userId] });
      queryClient.invalidateQueries({ queryKey: ['rating-summary-direct', userId] });
      queryClient.invalidateQueries({ queryKey: ['rating-summary-rpc', userId] });
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
    ratings,
    ratingSummary,
    ratingsLoading,
    createRating: createRating.mutate,
    createRatingAsync: createRating.mutateAsync,
    isCreatingRating: createRating.isPending
  };
};
