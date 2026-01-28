
import { useAdminConversationDetail } from '@/hooks/useAdminConversationDetail';

export const useConversationDetail = (conversationId: string | undefined) => {
  // Use the admin-specific hook for conversation details
  return useAdminConversationDetail(conversationId);
};
