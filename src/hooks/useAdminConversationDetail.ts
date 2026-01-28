
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Message, Conversation } from '@/types/conversation';
import { Vehicle } from '@/types/vehicle';

export const useAdminConversationDetail = (conversationId: string | undefined) => {
  // Fetch detailed conversation data for admin (no user restrictions)
  const { data: conversation, isLoading: isLoadingConversation } = useQuery({
    queryKey: ['admin-conversation-detail', conversationId],
    queryFn: async () => {
      if (!conversationId) return null;
      
      console.log(`Admin fetching conversation details for: ${conversationId}`);
      
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          id,
          created_at,
          updated_at,
          status,
          seller_id,
          buyer_id,
          vehicle_id,
          source_type,
          source_id,
          source_title
        `)
        .eq('id', conversationId)
        .maybeSingle(); // Use maybeSingle to avoid errors when no data found
        
      if (error) {
        console.error('Error fetching admin conversation detail:', error);
        throw error;
      }
      
      if (!data) {
        console.warn(`No conversation found with id: ${conversationId}`);
        return null;
      }
      
      console.log('Successfully fetched conversation details for admin:', data);
      return data as Conversation;
    },
    enabled: !!conversationId
  });

  // Fetch messages for the conversation (admin can see all messages)
  const { data: messages, isLoading: isLoadingMessages } = useQuery({
    queryKey: ['admin-conversation-messages', conversationId],
    queryFn: async () => {
      if (!conversationId) return [];
      
      console.log(`Admin fetching messages for conversation: ${conversationId}`);
      
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });
        
      if (error) {
        console.error('Error fetching admin messages:', error);
        throw error;
      }
      
      console.log(`Successfully fetched ${data?.length || 0} messages for admin`);
      return data as Message[];
    },
    enabled: !!conversationId
  });
  
  // Fetch buyer profile
  const { data: buyerProfile, isLoading: isLoadingBuyer } = useQuery({
    queryKey: ['admin-buyer-profile', conversation?.buyer_id],
    queryFn: async () => {
      if (!conversation?.buyer_id) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', conversation.buyer_id)
        .maybeSingle();
        
      if (error) {
        console.error("Error fetching buyer profile for admin:", error);
        return null;
      }
      return data;
    },
    enabled: !!conversation?.buyer_id
  });
  
  // Fetch seller profile
  const { data: sellerProfile, isLoading: isLoadingSeller } = useQuery({
    queryKey: ['admin-seller-profile', conversation?.seller_id],
    queryFn: async () => {
      if (!conversation?.seller_id) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', conversation.seller_id)
        .maybeSingle();
        
      if (error) {
        console.error("Error fetching seller profile for admin:", error);
        return null;
      }
      return data;
    },
    enabled: !!conversation?.seller_id
  });
  
  // Fetch vehicle data if applicable
  const { data: vehicle, isLoading: isLoadingVehicle } = useQuery({
    queryKey: ['admin-vehicle', conversation?.vehicle_id],
    queryFn: async () => {
      if (!conversation?.vehicle_id) return null;
      
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .eq('id', conversation.vehicle_id)
        .maybeSingle();
        
      if (error) {
        console.error("Error fetching vehicle for admin:", error);
        return null;
      }
      
      if (!data) return null;
      
      // Map the database fields to match the Vehicle type
      const mappedVehicle: Vehicle = {
        ...data,
        countryCode: data.country_code || 'es',
        thumbnailUrl: data.thumbnailurl,
        userId: data.user_id
      };
      
      return mappedVehicle;
    },
    enabled: !!conversation?.vehicle_id
  });

  // Determine if the conversation might involve a transaction (contains price mentions)
  const hasPriceMentions = messages?.some(message => {
    const content = message.content.toLowerCase();
    return content.includes('€') || 
           content.includes('eur') || 
           content.includes('euro') || 
           content.includes('euros') || 
           content.includes('precio') || 
           content.includes('pago') || 
           content.includes('transferencia') ||
           content.includes('costar') ||
           content.includes('vale');
  });

  return {
    conversation,
    messages,
    buyerProfile,
    sellerProfile,
    vehicle,
    isLoadingConversation,
    isLoadingMessages,
    isLoadingBuyer,
    isLoadingSeller,
    isLoadingVehicle,
    hasPriceMentions
  };
};
