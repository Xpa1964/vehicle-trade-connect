
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRightLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ExchangeWithVehicleButtonProps {
  vehicleId: string;
  sellerId?: string;
  onExchange?: (vehicleId: string) => void;
  className?: string;
}

const ExchangeWithVehicleButton: React.FC<ExchangeWithVehicleButtonProps> = ({
  vehicleId,
  sellerId,
  onExchange,
  className = ""
}) => {
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Navigate to exchange proposal page with correct parameters
    const params = new URLSearchParams({
      targetVehicleId: vehicleId
    });
    
    if (sellerId) {
      params.append('sellerId', sellerId);
    }
    
    navigate(`/exchange-proposal?${params.toString()}`);
    
    // Call onExchange callback if provided for backward compatibility
    if (onExchange) {
      onExchange(vehicleId);
    }
  };

  return (
    <Button
      onClick={handleClick}
      variant="outline"
      size="sm"
      className={`
        flex items-center gap-2 
        text-base font-medium 
        px-4 py-2 
        border-2 border-gray-300 
        bg-white hover:bg-gray-50
        text-gray-700 hover:text-gray-900
        hover:border-gray-400
        shadow-sm hover:shadow-md
        transition-all duration-300
        ${className}
      `}
    >
      <ArrowRightLeft className="w-4 h-4" />
      <span>Intercambiar</span>
    </Button>
  );
};

export default ExchangeWithVehicleButton;
