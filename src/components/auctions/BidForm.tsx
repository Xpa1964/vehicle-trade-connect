import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePlaceBid } from '@/hooks/auctions/usePlaceBid';
import { Auction } from '@/types/auction';
import { formatPrice } from '@/utils/formatters';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Gavel } from 'lucide-react';
import { toast } from 'sonner';

interface BidFormProps {
  auction: Auction;
}

export const BidForm: React.FC<BidFormProps> = ({ auction }) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const placeBid = usePlaceBid();
  
  const minimumBid = auction.current_price + auction.increment_minimum;
  const [bidAmount, setBidAmount] = useState(minimumBid.toString());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error(t('auctions.loginRequired', { fallback: 'Debes iniciar sesión para pujar' }));
      return;
    }

    const amount = parseFloat(bidAmount);

    if (isNaN(amount) || amount < minimumBid) {
      toast.error(
        t('auctions.minimumBidError', { 
          fallback: `La puja mínima es ${formatPrice(minimumBid)}` 
        })
      );
      return;
    }

    placeBid.mutate({
      auctionId: auction.id,
      amount,
    });
  };

  const canBid = auction.status === 'active' && user?.id !== auction.created_by;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gavel className="w-5 h-5" />
          {t('auctions.placeBid', { fallback: 'Realizar Puja' })}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!canBid ? (
          <div className="text-center py-4">
            {user?.id === auction.created_by ? (
              <p className="text-gray-600">
                {t('auctions.cannotBidOwnAuction', { 
                  fallback: 'No puedes pujar en tu propia subasta' 
                })}
              </p>
            ) : auction.status !== 'active' ? (
              <p className="text-gray-600">
                {t('auctions.auctionNotActive', { 
                  fallback: 'Esta subasta no está activa' 
                })}
              </p>
            ) : (
              <p className="text-gray-600">
                {t('auctions.loginToBid', { 
                  fallback: 'Inicia sesión para pujar' 
                })}
              </p>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">
                {t('auctions.currentBid', { fallback: 'Puja Actual' })}
              </label>
              <p className="text-2xl font-bold text-blue-600">
                {formatPrice(auction.current_price)}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                {t('auctions.yourBid', { fallback: 'Tu Puja' })}
              </label>
              <Input
                type="number"
                step="0.01"
                min={minimumBid}
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                className="mt-1"
                placeholder={formatPrice(minimumBid)}
              />
              <p className="text-xs text-gray-500 mt-1">
                {t('auctions.minimumBid', { fallback: 'Puja mínima' })}: {formatPrice(minimumBid)}
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
          </form>
        )}
      </CardContent>
    </Card>
  );
};
