
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface BackButtonProps {
  to?: string;
  label?: string;
  variant?: 'default' | 'outline' | 'ghost' | 'link' | 'destructive' | 'secondary';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  auctionId?: string;
}

const BackButton: React.FC<BackButtonProps> = ({
  to,
  label = 'Volver',
  variant = 'outline',
  size = 'sm',
  className = '',
  auctionId
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    console.log('BackButton - handleBack called with:', { to, auctionId, location });

    // 1. Si se especifica auctionId directamente, ir a la subasta
    if (auctionId) {
      console.log('BackButton - Navigating to auction:', auctionId);
      navigate(`/auctions/${auctionId}`);
      return;
    }

    // 2. Si se especifica una ruta específica
    if (to) {
      console.log('BackButton - Navigating to specified route:', to);
      navigate(to);
      return;
    }

    // 3. Verificar parámetros URL para from_auction
    const searchParams = new URLSearchParams(location.search);
    const fromAuction = searchParams.get('from_auction');
    if (fromAuction) {
      console.log('BackButton - Found from_auction param:', fromAuction);
      navigate(`/auctions/${fromAuction}`);
      return;
    }

    // 4. Verificar si el pathname contiene información de subasta
    const pathMatch = location.pathname.match(/\/vehicles\/[^\/]+/);
    if (pathMatch && location.search.includes('from_auction')) {
      console.log('BackButton - Vehicle page with auction context detected');
      // Ya manejado arriba con searchParams
      return;
    }

    // 5. Comportamiento por defecto - siempre ir al home
    console.log('BackButton - Using default navigation to home');
    navigate('/');
  };

  return (
    <Button 
      variant={variant}
      size={size}
      onClick={handleBack}
      className={`flex items-center gap-2 ${className}`}
    >
      <ArrowLeft className="h-4 w-4" />
      {label}
    </Button>
  );
};

export default BackButton;
