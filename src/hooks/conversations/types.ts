
// Types for conversation hooks

export interface ConversationSource {
  type: string;
  title: string;
  id: string;
}

export interface ConversationCacheEntry {
  data: any;
  timestamp: number;
  ttl: number;
}

export interface ConversationFilters {
  status?: string;
  type?: string;
  unreadOnly?: boolean;
  pinnedOnly?: boolean;
}

export interface ConversationSortOptions {
  field: 'updated_at' | 'created_at' | 'unread_count';
  direction: 'asc' | 'desc';
}

export interface ConversationOptions {
  sourceType?: string;
  sourceId?: string;
  sourceTitle?: string;
}
