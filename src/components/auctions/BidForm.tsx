/**
 * FORMULARIO DE PUJAS - KONTACT VO
 * Documento Capa 2: Gestión de Pujas
 * 
 * Este componente es SOLO para UX.
 * TODA la validación crítica ocurre en backend (función place_bid).
 * 
 * El frontend solo:
 * - Muestra información al usuario
 * - Previene envíos obvios (campo vacío)
 * - NO valida reglas de negocio
 */

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePlaceBid } from '@/hooks/auctions/usePlaceBid';
import { Auction } from '@/types/auction';
import { formatPrice } from '@/utils/formatters';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Gavel, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface BidFormProps {
  auction: Auction;
}

export const BidForm: React.FC<BidFormProps> = ({ auction }) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const placeBid = usePlaceBid();
  
  // Sugerencia de puja mínima (solo UX, no validación)
  const suggestedMinimum = auction.current_price + auction.increment_minimum;
  const [bidAmount, setBidAmount] = useState(suggestedMinimum.toString());

  // Actualizar sugerencia cuando cambie el precio actual
  useEffect(() => {
    const newMinimum = auction.current_price + auction.increment_minimum;
    setBidAmount(newMinimum.toString());
  }, [auction.current_price, auction.increment_minimum]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const amount = parseFloat(bidAmount);

    // Validación mínima de UX (campo no vacío, número válido)
    // La validación REAL ocurre en backend
    if (isNaN(amount) || amount <= 0) {
      return;
    }

    placeBid.mutate({
      auctionId: auction.id,
      amount,
    });
  };

  // Verificaciones de UI (no son validaciones de negocio)
  const isLoggedIn = !!user;
  const isOwnAuction = user?.id === auction.created_by;
  const isActive = auction.status === 'active';

  // Mostrar mensajes informativos según el estado
  const renderStatusMessage = () => {
    if (!isLoggedIn) {
      return (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {t('auctions.loginToBid', { fallback: 'Inicia sesión para pujar' })}
          </AlertDescription>
        </Alert>
      );
    }

    if (isOwnAuction) {
      return (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {t('auctions.cannotBidOwnAuction', { 
              fallback: 'No puedes pujar en tu propia subasta' 
            })}
          </AlertDescription>
        </Alert>
      );
    }

    if (!isActive) {
      return (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {t('auctions.auctionNotActive', { 
              fallback: 'Esta subasta no está activa' 
            })}
          </AlertDescription>
        </Alert>
      );
    }

    return null;
  };

  const canShowForm = isLoggedIn && !isOwnAuction && isActive;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gavel className="w-5 h-5" />
          {t('auctions.placeBid', { fallback: 'Realizar Puja' })}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {renderStatusMessage()}
        
        {canShowForm && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                {t('auctions.currentBid', { fallback: 'Puja Actual' })}
              </label>
              <p className="text-2xl font-bold text-primary">
                {formatPrice(auction.current_price)}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">
                {t('auctions.yourBid', { fallback: 'Tu Puja' })}
              </label>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                className="mt-1"
                placeholder={formatPrice(suggestedMinimum)}
                disabled={placeBid.isPending}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {t('auctions.suggestedMinimum', { fallback: 'Puja sugerida mínima' })}: {formatPrice(suggestedMinimum)}
              </p>
            </div>

            <Button 
              type="submit" 
              className="w-full"
              disabled={placeBid.isPending}
            >
              {placeBid.isPending 
                ? t('auctions.placingBid', { fallback: 'Realizando puja...' })
                : t('auctions.placeBid', { fallback: 'Realizar Puja' })
              }
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              {t('auctions.bidDisclaimer', { 
                fallback: 'Al pujar, aceptas las condiciones de la subasta. La validación final se realiza en el servidor.' 
              })}
            </p>
          </form>
        )}
      </CardContent>
    </Card>
  );
};
