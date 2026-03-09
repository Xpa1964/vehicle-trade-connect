import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle2, XCircle, Calendar, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { es, enUS, fr, de, it, nl, pt, pl, da } from 'date-fns/locale';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

interface BudgetItem {
  id: string;
  concept: string;
  amount: number;
}

interface BudgetReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  requestId: string;
  budgetAmount: number;
  budgetBreakdown: BudgetItem[];
  budgetNotes?: string;
  estimatedDeliveryDate?: string;
  onBudgetResponse: () => void;
}

const localeMap: Record<string, Locale> = { es, en: enUS, fr, de, it, nl, pt, pl, dk: da };

const BudgetReviewDialog: React.FC<BudgetReviewDialogProps> = ({
  open,
  onOpenChange,
  requestId,
  budgetAmount,
  budgetBreakdown,
  budgetNotes,
  estimatedDeliveryDate,
  onBudgetResponse,
}) => {
  const { toast } = useToast();
  const { t, currentLanguage } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleResponse = async (accepted: boolean) => {
    setIsSubmitting(true);

    try {
      const newStatus = accepted ? 'budget_accepted' : 'budget_rejected';
      const timestamp = new Date().toISOString();

      const { error: updateError } = await supabase
        .from('vehicle_report_requests')
        .update({
          status: newStatus,
          [accepted ? 'budget_accepted_at' : 'budget_rejected_at']: timestamp,
          updated_at: timestamp,
        })
        .eq('id', requestId);

      if (updateError) throw updateError;

      const { error: notificationError } = await supabase.rpc('create_system_notification', {
        p_user_id: (await supabase.auth.getUser()).data.user?.id || '',
        p_title: accepted ? t('reports.budget.accepted') : t('reports.budget.rejected'),
        p_subject: accepted ? t('reports.budget.accepted') : t('reports.budget.rejected'),
        p_content: `${accepted ? t('reports.budget.acceptedNotification') : t('reports.budget.rejectedNotification')} €${budgetAmount.toFixed(2)}`,
        p_type: 'info',
      });

      if (notificationError) console.error('Error sending admin notification:', notificationError);

      toast({
        title: accepted ? t('reports.budget.accepted') : t('reports.budget.rejected'),
        description: accepted 
          ? t('reports.budget.acceptedDesc')
          : t('reports.budget.rejectedDesc'),
      });

      onBudgetResponse();
      onOpenChange(false);
    } catch (error) {
      console.error('Error al responder presupuesto:', error);
      toast({
        title: t('common.error'),
        description: t('reports.budget.responseError'),
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {t('reports.budget.title')}
          </DialogTitle>
          <DialogDescription>
            {t('reports.budget.description')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-3">
            <h4 className="font-semibold text-sm">{t('reports.budget.costBreakdown')}</h4>
            {budgetBreakdown && budgetBreakdown.length > 0 ? (
              <div className="space-y-2">
                {budgetBreakdown.map((item) => (
                  <div key={item.id} className="flex justify-between items-center py-2 border-b last:border-0">
                    <span className="text-sm">{item.concept}</span>
                    <span className="font-medium">€{item.amount.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">{t('reports.budget.noBreakdown')}</p>
            )}
          </div>

          <Separator />

          <div className="flex justify-between items-center py-2 bg-muted/50 px-4 rounded-lg">
            <span className="font-semibold">{t('common.total')}:</span>
            <span className="text-2xl font-bold">€{budgetAmount.toFixed(2)}</span>
          </div>

          {estimatedDeliveryDate && (
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">{t('reports.budget.estimatedDelivery')}:</span>
              <Badge variant="outline">
                {format(new Date(estimatedDeliveryDate), "PPP", { locale: localeMap[currentLanguage] || enUS })}
              </Badge>
            </div>
          )}

          {budgetNotes && (
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">{t('reports.budget.additionalNotes')}</h4>
              <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                {budgetNotes}
              </p>
            </div>
          )}

          <Separator />

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => handleResponse(false)}
              disabled={isSubmitting}
            >
              <XCircle className="h-4 w-4 mr-2" />
              {t('reports.budget.reject')}
            </Button>
            <Button
              className="flex-1"
              onClick={() => handleResponse(true)}
              disabled={isSubmitting}
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              {isSubmitting ? t('common.loading') : t('reports.budget.accept')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BudgetReviewDialog;
