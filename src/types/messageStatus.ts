
export interface OptimisticMessage {
  id: string;
  content: string;
  conversation_id: string;
  sender_id: string;
  created_at: string;
  status: 'sending' | 'sent' | 'failed';
  isOptimistic: true;
  original_language?: string;
  translated_content?: Record<string, string> | null;
}

export type MessageStatus = 'sending' | 'sent' | 'failed' | 'read';
