
// Helper functions for conversation data processing

// Helper to convert any JSON or string to Record<string, string>
export const parseTranslatedContent = (content: any): Record<string, string> => {
  if (!content) return {};
  if (typeof content === 'object') return content;
  if (typeof content === 'string') {
    try {
      return JSON.parse(content);
    } catch (e) {
      return {};
    }
  }
  return {};
};

// Function to get time ago string for messages
export const getTimeAgo = (dateString: string, language: string = 'es'): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffMinutes < 1) {
    return language === 'en' ? 'Just now' : 'Ahora';
  } else if (diffMinutes < 60) {
    return language === 'en' ? `${diffMinutes}m ago` : `${diffMinutes}m`;
  } else if (diffHours < 24) {
    return language === 'en' ? `${diffHours}h ago` : `${diffHours}h`;
  } else if (diffDays < 7) {
    return language === 'en' ? `${diffDays}d ago` : `${diffDays}d`;
  } else if (diffWeeks < 4) {
    return language === 'en' ? `${diffWeeks}w ago` : `${diffWeeks}sem`;
  } else if (diffMonths < 12) {
    return language === 'en' ? `${diffMonths}mo ago` : `${diffMonths}mes`;
  } else {
    return language === 'en' ? `${diffYears}y ago` : `${diffYears}a`;
  }
};

// Debounce utility for optimizing function calls
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Function to validate conversation data
export const validateConversationData = (conversation: any): boolean => {
  return conversation && 
         conversation.id && 
         conversation.seller_id && 
         conversation.buyer_id;
};

// Function to format conversation title safely
export const formatConversationTitle = (conversation: any, fallback = 'Conversación'): string => {
  if (conversation.vehicle_info) {
    const { brand, model, year } = conversation.vehicle_info;
    return `${brand || ''} ${model || ''} ${year || ''}`.trim() || fallback;
  }
  
  return conversation.source_title || 
         conversation.source_type || 
         fallback;
};
