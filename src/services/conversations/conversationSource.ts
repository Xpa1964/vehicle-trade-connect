
import { supabase } from '@/integrations/supabase/client';
import { Conversation } from '@/types/conversation';

// Get source information for a conversation
export async function getConversationSource(conversation: Conversation) {
  if (!conversation) return null;
  
  try {
    // If it's a vehicle conversation
    if (conversation.vehicle_id) {
      // If vehicle info is already in the conversation object
      if (conversation.vehicle_info) {
        const { brand, model, year } = conversation.vehicle_info;
        return {
          type: 'vehicle' as const,
          title: `${brand} ${model} ${year}`,
          id: conversation.vehicle_id
        };
      }
      
      // Otherwise, fetch vehicle info from the database
      const { data } = await supabase
        .from('vehicles')
        .select('brand, model, year')
        .eq('id', conversation.vehicle_id)
        .single();
        
      if (data) {
        return {
          type: 'vehicle' as const,
          title: `${data.brand} ${data.model} ${data.year}`,
          id: conversation.vehicle_id
        };
      }
    }
    
    // If it has source information
    if (conversation.source_type && conversation.source_id) {
      // If we already have the title, use it
      if (conversation.source_title) {
        return {
          type: conversation.source_type as 'announcement' | 'exchange' | string,
          title: conversation.source_title,
          id: conversation.source_id
        };
      }
      
      // For announcements
      if (conversation.source_type === 'announcement') {
        const { data } = await supabase
          .from('announcements')
          .select('title')
          .eq('id', conversation.source_id)
          .single();
          
        if (data) {
          return {
            type: 'announcement' as const,
            title: data.title,
            id: conversation.source_id
          };
        }
      }
      
      // For exchanges - now use the new structure
      if (conversation.source_type === 'exchange' || conversation.source_type === 'exchange_proposal') {
        // Try to get exchange details with offered vehicle info
        const { data: exchangeData } = await supabase
          .from('exchanges')
          .select(`
            id,
            offered_vehicle_id,
            requested_vehicle_id
          `)
          .eq('id', conversation.source_id)
          .single();
          
        if (exchangeData && exchangeData.offered_vehicle_id) {
          // Get vehicle details for the offered vehicle
          const { data: vehicleData } = await supabase
            .from('vehicles')
            .select('brand, model, year')
            .eq('id', exchangeData.offered_vehicle_id)
            .single();
            
          if (vehicleData) {
            return {
              type: 'exchange' as const,
              title: `Intercambio: ${vehicleData.brand} ${vehicleData.model} ${vehicleData.year}`,
              id: conversation.source_id
            };
          }
        }
        
        // Return exchange with generic title if vehicle data is not available
        return {
          type: 'exchange' as const,
          title: 'Propuesta de Intercambio',
          id: conversation.source_id
        };
      }
    }
    
    // Return null if we couldn't find any source information
    return null;
  } catch (error) {
    console.error('Error getting conversation source:', error);
    return null;
  }
}
