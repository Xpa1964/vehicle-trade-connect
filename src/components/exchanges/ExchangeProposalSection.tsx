
import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { ExchangeProposal } from '@/types/conversation';
import { Vehicle } from '@/types/vehicle';
import VehicleComparisonCard from './VehicleComparisonCard';
import CounterOfferDialog from './CounterOfferDialog';

interface ExchangeProposalSectionProps {
  selectedConversation: string | null;
  exchangeProposal: ExchangeProposal;
  exchangeVehicles: {
    offered: Partial<Vehicle> | null;
    requested: Partial<Vehicle> | null;
  };
  onViewDetails: (vehicleId: string) => void;
  onRespondToExchange: (conversationId: string, status: 'accepted' | 'rejected' | 'counteroffered', counterOffer?: any) => Promise<any>;
}

const ExchangeProposalSection: React.FC<ExchangeProposalSectionProps> = ({
  selectedConversation,
  exchangeProposal,
  exchangeVehicles,
  onViewDetails,
  onRespondToExchange
}) => {
  const { t } = useLanguage();
  const [showCounterOfferDialog, setShowCounterOfferDialog] = useState(false);
  const [isResponding, setIsResponding] = useState(false);

  const handleCounterOfferClick = () => {
    setShowCounterOfferDialog(true);
  };

  const handleRespondToExchange = async (status: 'accepted' | 'rejected') => {
    if (!selectedConversation) return;
    
    setIsResponding(true);
    try {
      await onRespondToExchange(selectedConversation, status);
    } catch (error) {
      console.error('Error responding to exchange proposal:', error);
    } finally {
      setIsResponding(false);
    }
  };

  const handleCounterOfferSubmit = async (counterOffer: { compensation: number; conditions: string }) => {
    if (!selectedConversation) return;
    
    try {
      await onRespondToExchange(selectedConversation, 'counteroffered', counterOffer);
    } catch (error) {
      console.error('Error submitting counter offer:', error);
      throw error;
    }
  };

  if (
    !exchangeProposal ||
    !exchangeVehicles.offered ||
    !exchangeVehicles.requested
  ) {
    return null;
  }

  return (
    <>
      <div className="mb-4 border-b pb-4">
        <VehicleComparisonCard
          offeredVehicle={exchangeVehicles.offered}
          requestedVehicle={exchangeVehicles.requested}
          compensation={exchangeProposal.compensation}
          conditions={exchangeProposal.conditions?.[0]}
          status={exchangeProposal.status}
          showActions={exchangeProposal.status === 'pending'}
          onViewDetails={onViewDetails}
          onAccept={() => handleRespondToExchange('accepted')}
          onReject={() => handleRespondToExchange('rejected')}
          onCounterOffer={handleCounterOfferClick}
          isLoading={isResponding}
        />
      </div>
      
      <CounterOfferDialog
        open={showCounterOfferDialog}
        onOpenChange={setShowCounterOfferDialog}
        onSubmit={handleCounterOfferSubmit}
        originalCompensation={exchangeProposal.compensation}
        originalConditions={exchangeProposal.conditions?.[0]}
      />
    </>
  );
};

export default ExchangeProposalSection;
