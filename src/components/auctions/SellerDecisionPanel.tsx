/**
 * SellerDecisionPanel - Componente para decisión del vendedor
 */

import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useAcceptAuctionResult, useRejectAuctionResult } from '@/hooks/auctions/useSellerDecision';
import { Auction } from '@/types/auction';
import { formatPrice } from '@/utils/formatters';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from '@/components/ui/alert-dialog';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  User, 
  Trophy,
  Ban
} from 'lucide-react';

interface SellerDecisionPanelProps {
  auction: Auction;
}

export const SellerDecisionPanel: React.FC<SellerDecisionPanelProps> = ({ auction }) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [rejectReason, setRejectReason] = useState('');
  
  const acceptMutation = useAcceptAuctionResult();
  const rejectMutation = useRejectAuctionResult();

  const isSeller = user?.id === auction.created_by;
  const isPendingDecision = auction.status === 'ended_pending_acceptance';
  const hasWinner = !!auction.winner_id;

  if (!isSeller || !isPendingDecision) {
    return null;
  }

  const isLoading = acceptMutation.isPending || rejectMutation.isPending;

  const handleAccept = () => {
    acceptMutation.mutate(auction.id);
  };

  const handleReject = () => {
    rejectMutation.mutate({ 
      auctionId: auction.id, 
      reason: rejectReason.trim() || undefined 
    });
  };

  return (
    <Card className="border-2 border-amber-400 bg-amber-50 dark:bg-amber-950/30">
      <CardHeader>
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-600" />
          <CardTitle className="text-amber-800 dark:text-amber-200">
            {t('auctions.result.title')}
          </CardTitle>
        </div>
        <CardDescription className="text-amber-700 dark:text-amber-300">
          {t('auctions.result.decision')}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-background rounded-lg border">
          <div>
            <p className="text-sm text-muted-foreground">{t('auctions.result.finalPrice')}</p>
            <p className="text-2xl font-bold text-primary">
              {formatPrice(auction.current_price)}
            </p>
          </div>
          
          {auction.reserve_price && (
            <div>
              <p className="text-sm text-muted-foreground">{t('auctions.result.reservePrice')}</p>
              <div className="flex items-center gap-2">
                <p className="text-lg font-semibold">{formatPrice(auction.reserve_price)}</p>
                <Badge variant={auction.current_price >= auction.reserve_price ? 'default' : 'destructive'}>
                  {auction.current_price >= auction.reserve_price 
                    ? t('auctions.result.reserveMet')
                    : t('auctions.result.reserveNotMet')
                  }
                </Badge>
              </div>
            </div>
          )}
        </div>

        {hasWinner && auction.winner && (
          <div className="p-4 bg-accent/50 rounded-lg border border-accent">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="h-5 w-5 text-primary" />
              <span className="font-semibold text-foreground">
                {t('auctions.result.winner')}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">
                {auction.winner.company_name || auction.winner.full_name || t('common.unknown')}
              </span>
            </div>
          </div>
        )}

        {!hasWinner && (
          <div className="p-4 bg-muted rounded-lg border">
            <div className="flex items-center gap-2">
              <Ban className="h-5 w-5 text-muted-foreground" />
              <span className="text-muted-foreground">
                {t('auctions.result.noWinner')}
              </span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="default" 
                size="lg" 
                className="w-full"
                disabled={isLoading}
              >
                <CheckCircle className="h-5 w-5 mr-2" />
                {t('auctions.result.accept')}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  {t('auctions.result.accept')}
                </AlertDialogTitle>
                <AlertDialogDescription className="text-left space-y-2">
                  <p className="font-medium">{t('auctions.result.acceptDescription')}</p>
                  <ul className="list-none space-y-1 text-sm">
                    {hasWinner ? (
                      <>
                        <li>{t('auctions.result.acceptWithWinner')}</li>
                        <li>{t('auctions.result.acceptNotifyBuyer')}</li>
                      </>
                    ) : (
                      <>
                        <li>{t('auctions.result.acceptWithoutWinner')}</li>
                        <li>{t('auctions.result.acceptComplete')}</li>
                      </>
                    )}
                  </ul>
                  <p className="text-amber-600 font-medium mt-4">
                    ⚠️ {t('auctions.result.irreversibleAction')}
                  </p>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleAccept}
                  disabled={isLoading}
                >
                  {acceptMutation.isPending ? t('common.loading') : t('auctions.result.confirmAccept')}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="destructive" 
                size="lg" 
                className="w-full"
                disabled={isLoading}
              >
                <XCircle className="h-5 w-5 mr-2" />
                {t('auctions.result.reject')}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-destructive" />
                  {t('auctions.result.reject')}
                </AlertDialogTitle>
                <AlertDialogDescription className="text-left space-y-2">
                  <p className="font-medium">{t('auctions.result.rejectDescription')}</p>
                  <ul className="list-none space-y-1 text-sm">
                    <li>{t('auctions.result.rejectDelete')}</li>
                    <li>{t('auctions.result.rejectNotify')}</li>
                    <li>{t('auctions.result.rejectAvailable')}</li>
                    <li>{t('auctions.result.rejectFinal')}</li>
                  </ul>
                </AlertDialogDescription>
              </AlertDialogHeader>
              
              <div className="py-4">
                <Label htmlFor="reject-reason" className="text-sm font-medium">
                  {t('auctions.result.rejectReasonLabel')}
                </Label>
                <Textarea
                  id="reject-reason"
                  placeholder={t('auctions.result.rejectReasonPlaceholder')}
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="mt-2"
                  rows={3}
                />
              </div>
              
              <AlertDialogFooter>
                <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleReject}
                  className="bg-destructive hover:bg-destructive/90"
                  disabled={isLoading}
                >
                  {rejectMutation.isPending ? t('common.loading') : t('auctions.result.confirmReject')}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        <p className="text-xs text-muted-foreground text-center pt-2 border-t">
          {t('auctions.result.disclaimer')}
        </p>
      </CardContent>
    </Card>
  );
};
