
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Conversation } from '@/types/conversation';

export const useAdminConversations = () => {
  return useQuery({
    queryKey: ['admin-conversations'],
    queryFn: async (): Promise<Conversation[]> => {
      console.log('Fetching all conversations for admin panel...');
      
      // First fetch conversations
      const { data: conversations, error } = await supabase
        .from('conversations')
        .select(`
          id,
          seller_id,
          buyer_id,
          vehicle_id,
          source_type,
          source_id,
          source_title,
          status,
          created_at,
          updated_at,
          unread_count,
          is_pinned,
          messages (
            count
          ),
          vehicles (
            brand,
            model,
            year,
            id,
            thumbnailurl
          )
        `)
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Error fetching admin conversations:', error);
        throw error;
      }

      // Get unique user IDs
      const userIds = new Set<string>();
      conversations?.forEach(conv => {
        if (conv.seller_id) userIds.add(conv.seller_id);
        if (conv.buyer_id) userIds.add(conv.buyer_id);
      });

      // Fetch profiles for all users
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, company_name, full_name')
        .in('id', Array.from(userIds));

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
      }

      // Create a map for quick profile lookup
      const profilesMap = new Map();
      profiles?.forEach(profile => {
        profilesMap.set(profile.id, profile);
      });

      console.log(`Successfully fetched ${conversations?.length || 0} conversations for admin`);

      // Transform data to match expected format
      const transformedConversations: Conversation[] = (conversations || []).map(conv => ({
        ...conv,
        messages: [], // Will be populated with actual messages when needed
        vehicle_info: conv.vehicles ? {
          brand: conv.vehicles.brand,
          model: conv.vehicles.model,
          year: conv.vehicles.year,
          id: conv.vehicles.id,
          thumbnailurl: conv.vehicles.thumbnailurl
        } : undefined,
        seller_profile: conv.seller_id ? profilesMap.get(conv.seller_id) : undefined,
        buyer_profile: conv.buyer_id ? profilesMap.get(conv.buyer_id) : undefined
      }));

      return transformedConversations;
    },
    refetchInterval: 30000, // Refresh every 30 seconds for real-time updates
  });
};
