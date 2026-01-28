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
import { es } from 'date-fns/locale';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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

      // Notify admin about the response (optional but helpful)
      const { error: notificationError } = await supabase.rpc('create_system_notification', {
        p_user_id: (await supabase.auth.getUser()).data.user?.id,
        p_subject: accepted ? 'Presupuesto Aceptado' : 'Presupuesto Rechazado',
        p_content: `El usuario ha ${accepted ? 'aceptado' : 'rechazado'} el presupuesto de €${budgetAmount.toFixed(2)} para el informe premium.`,
        p_type: 'info',
      });

      if (notificationError) console.error('Error sending admin notification:', notificationError);

      toast({
        title: accepted ? 'Presupuesto aceptado' : 'Presupuesto rechazado',
        description: accepted 
          ? 'Comenzaremos a procesar tu informe premium'
          : 'El presupuesto ha sido rechazado',
      });

      onBudgetResponse();
      onOpenChange(false);
    } catch (error) {
      console.error('Error al responder presupuesto:', error);
      toast({
        title: 'Error',
        description: 'No se pudo procesar tu respuesta. Intenta nuevamente.',
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
            Presupuesto para Informe Premium
          </DialogTitle>
          <DialogDescription>
            Revisa los detalles y decide si deseas continuar
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Budget Breakdown */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sm">Desglose de Costos</h4>
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
              <p className="text-sm text-muted-foreground">No hay desglose disponible</p>
            )}
          </div>

          <Separator />

          {/* Total */}
          <div className="flex justify-between items-center py-2 bg-muted/50 px-4 rounded-lg">
            <span className="font-semibold">Total:</span>
            <span className="text-2xl font-bold">€{budgetAmount.toFixed(2)}</span>
          </div>

          {/* Estimated Delivery Date */}
          {estimatedDeliveryDate && (
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Entrega estimada:</span>
              <Badge variant="outline">
                {format(new Date(estimatedDeliveryDate), "PPP", { locale: es })}
              </Badge>
            </div>
          )}

          {/* Notes */}
          {budgetNotes && (
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Notas Adicionales</h4>
              <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                {budgetNotes}
              </p>
            </div>
          )}

          <Separator />

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => handleResponse(false)}
              disabled={isSubmitting}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Rechazar
            </Button>
            <Button
              className="flex-1"
              onClick={() => handleResponse(true)}
              disabled={isSubmitting}
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              {isSubmitting ? 'Procesando...' : 'Aceptar Presupuesto'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BudgetReviewDialog;
