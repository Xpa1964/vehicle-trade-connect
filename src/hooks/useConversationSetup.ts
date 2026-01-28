
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

type UseConversationSetupProps = {
  setSelectedConversation: (id: string) => void;
  getConversationDetails: (conversationId: string) => Promise<any>;
  setActiveConversation: React.Dispatch<React.SetStateAction<any>>;
  selectedConversation: string | null;
  user: { id: string } | null;
  markAsRead: (conversationId: string) => void;
  fetchExchangeVehicles: (proposal: any) => Promise<void>;
  setCurrentActiveConversation: React.Dispatch<React.SetStateAction<string | null>>;
};

export function useConversationSetup({
  setSelectedConversation,
  getConversationDetails,
  setActiveConversation,
  selectedConversation,
  user,
  markAsRead,
  fetchExchangeVehicles,
  setCurrentActiveConversation
}: UseConversationSetupProps) {
  const location = useLocation();

  // Check if we have a conversation ID in the URL
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const conversationId = searchParams.get('conversation');
    if (conversationId) {
      setSelectedConversation(conversationId);
    }
  }, [location.search, setSelectedConversation]);

  // Effect to fetch detailed conversation data when a conversation is selected
  useEffect(() => {
    if (selectedConversation) {
      const loadConversation = async () => {
        try {
          const details = await getConversationDetails(selectedConversation);
          if (details) {
            setActiveConversation(details);
            if (user?.id) {
              markAsRead(selectedConversation);
            }
            
            // Check if this conversation has an exchange proposal
            if (details.exchange_proposal) {
              fetchExchangeVehicles(details.exchange_proposal);
            }
          }
        } catch (error) {
          console.error("Error loading conversation details:", error);
        }
      };
      
      loadConversation();
      setCurrentActiveConversation(selectedConversation);
    } else {
      setActiveConversation(null);
    }
  }, [selectedConversation, getConversationDetails, user?.id, markAsRead, fetchExchangeVehicles, setActiveConversation, setCurrentActiveConversation]);
}
