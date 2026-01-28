
export interface Message {
  id: string;
  content: string;
  conversation_id: string;
  sender_id: string;
  created_at: string;
  read_at?: string | null;
  original_language?: string;
  translated_content?: Record<string, string> | null;
}

export interface ExchangeProposal {
  id?: string;
  offeredVehicleId: string;
  requestedVehicleId: string;
  compensation?: number;
  status: 'pending' | 'accepted' | 'rejected' | 'counteroffered';
  conditions?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface Conversation {
  id: string;
  seller_id: string;
  buyer_id: string;
  vehicle_id?: string;
  source_id?: string;
  source_type?: string;
  source_title?: string;
  created_at: string;
  updated_at: string;
  unread_count?: number;
  is_pinned?: boolean;
  status: string;
  messages: Message[];
  vehicle_info?: {
    brand: string;
    model: string;
    year: string | number;
    id: string;
    thumbnailurl?: string;
  };
  exchange_proposal?: ExchangeProposal;
  is_admin_conversation?: boolean;
  admin_sender_name?: string;
}
