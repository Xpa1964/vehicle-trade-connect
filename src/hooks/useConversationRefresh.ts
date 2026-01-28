
import { useEffect } from 'react';

type UseConversationRefreshProps = {
  user: { id: string } | null;
  refetch: () => void;
  selectedConversation: string | null;
  getConversationDetails: (conversationId: string) => Promise<any>;
  setActiveConversation: React.Dispatch<React.SetStateAction<any>>;
  fetchExchangeVehicles: (proposal: any) => Promise<void>;
};

export function useConversationRefresh({
  user,
  refetch,
  selectedConversation,
  getConversationDetails,
  setActiveConversation,
  fetchExchangeVehicles
}: UseConversationRefreshProps) {
  // Auto-refresh messages every 30 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (user) {
        refetch();
        
        if (selectedConversation) {
          getConversationDetails(selectedConversation).then(details => {
            if (details) {
              setActiveConversation(details);
              
              // Check if this conversation has an exchange proposal
              if (details.exchange_proposal) {
                fetchExchangeVehicles(details.exchange_proposal);
              }
            }
          });
        }
      }
    }, 30000);

    return () => clearInterval(intervalId);
  }, [user, refetch, selectedConversation, getConversationDetails, setActiveConversation, fetchExchangeVehicles]);

  return null; // This hook doesn't need to return anything as it's just for side effects
}
