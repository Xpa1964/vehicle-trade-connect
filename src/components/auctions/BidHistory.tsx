import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bid } from '@/types/auction';
import { formatPrice } from '@/utils/formatters';
import { useLanguage } from '@/contexts/LanguageContext';
import { Clock, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';
import { es, enUS, fr, de, it, pt, nl, da, pl } from 'date-fns/locale';

interface BidHistoryProps {
  bids: Bid[];
  currentUserId?: string;
}

export const BidHistory: React.FC<BidHistoryProps> = ({ bids, currentUserId }) => {
  const { t } = useLanguage();

  const locales: Record<string, any> = {
    es, en: enUS, fr, de, it, pt, nl, dk: da, pl
  };

  const locale = locales.es;

  // Ordenar pujas de más reciente a más antigua
  const sortedBids = [...bids].sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  if (sortedBids.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            {t('auctions.bidHistory', { fallback: 'Historial de Pujas' })}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500 py-4">
            {t('auctions.noBidsYet', { fallback: 'Aún no hay pujas en esta subasta' })}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          {t('auctions.bidHistory', { fallback: 'Historial de Pujas' })} ({sortedBids.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {sortedBids.map((bid, index) => {
            const isMyBid = currentUserId === bid.bidder_id;
            const isHighestBid = index === 0;

            return (
              <div
                key={bid.id}
                className={`p-4 rounded-lg border ${
                  isMyBid ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'
                } ${isHighestBid ? 'ring-2 ring-green-500' : ''}`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-lg text-blue-600">
                      {formatPrice(bid.amount)}
                    </p>
                    <p className="text-sm text-gray-600">
                      {bid.bidder?.company_name || bid.bidder?.full_name || t('auctions.anonymousBidder', { fallback: 'Pujador Anónimo' })}
                      {isMyBid && (
                        <span className="ml-2 text-blue-600 font-medium">
                          ({t('auctions.yourBid', { fallback: 'Tu puja' })})
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      {format(new Date(bid.created_at), 'PPp', { locale })}
                    </p>
                    {isHighestBid && (
                      <p className="text-xs font-semibold text-green-600 mt-1">
                        {t('auctions.highestBid', { fallback: 'Puja Más Alta' })}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
