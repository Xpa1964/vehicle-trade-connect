
import { supabase } from '@/integrations/supabase/client';

// Start a new conversation
export async function createConversation(
  sellerId: string,
  buyerId: string,
  vehicleId: string | null,
  sourceType?: 'vehicle' | 'announcement' | 'exchange' | null,
  sourceId?: string | null,
  sourceTitle?: string | null
) {
  console.log(`Starting conversation: seller=${sellerId}, buyer=${buyerId}, vehicle=${vehicleId || 'none'}, source=${sourceType || 'none'}`);
  
  // Check if a conversation already exists for this source
  let existingConvoQuery = supabase
    .from('conversations')
    .select('*')
    .eq('seller_id', sellerId)
    .eq('buyer_id', buyerId);
    
  if (vehicleId) {
    existingConvoQuery = existingConvoQuery.eq('vehicle_id', vehicleId);
  } else if (sourceType && sourceId) {
    existingConvoQuery = existingConvoQuery
      .eq('source_type', sourceType)
      .eq('source_id', sourceId);
  }
  
  const { data: existingConvo, error: existingConvoError } = await existingConvoQuery.maybeSingle();
  
  if (existingConvoError) {
    console.error('Error checking existing conversation:', existingConvoError);
  }
    
  if (existingConvo) {
    console.log('Conversation already exists:', existingConvo);
    return existingConvo;
  }
  
  // Create a new conversation
  const newConversation = {
    seller_id: sellerId,
    buyer_id: buyerId,
    vehicle_id: vehicleId,
    source_type: sourceType || null,
    source_id: sourceId || null,
    source_title: sourceTitle || null
  };
  
  const { data, error } = await supabase
    .from('conversations')
    .insert(newConversation)
    .select()
    .single();
    
  if (error) {
    console.error('Error starting conversation:', error);
    throw error;
  }
  
  console.log('New conversation created:', data);
  return data;
}
