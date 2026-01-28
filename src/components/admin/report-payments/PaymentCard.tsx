import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, ExternalLink, DollarSign, Calendar, User, FileText, CreditCard } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface PaymentCardProps {
  payment: any;
  onUpdate: () => void;
}

const PaymentCard: React.FC<PaymentCardProps> = ({ payment, onUpdate }) => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [adminNotes, setAdminNotes] = useState(payment.admin_notes || '');

  const handleApprove = async () => {
    setIsProcessing(true);
    try {
      // Update payment status
      const { error: paymentError } = await (supabase as any)
        .from('report_payments')
        .update({
          status: 'approved',
          admin_notes: adminNotes,
          verified_at: new Date().toISOString(),
        })
        .eq('id', payment.id);

      if (paymentError) throw paymentError;

      // Update report request status to 'paid'
      const { error: requestError } = await (supabase as any)
        .from('report_requests')
        .update({
          status: 'paid',
          updated_at: new Date().toISOString(),
        })
        .eq('id', payment.request_id);

      if (requestError) throw requestError;

      // Create notification for user
      await (supabase as any).rpc('create_system_notification', {
        p_user_id: payment.user_id,
        p_subject: 'Pago Aprobado',
        p_content: `Tu pago de €${payment.amount} para el informe ${payment.report_requests?.report_type} ha sido aprobado. Procesaremos tu solicitud en breve.`,
        p_type: 'success',
      });

      toast({
        title: 'Pago aprobado',
        description: 'El pago ha sido aprobado exitosamente',
      });

      onUpdate();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!adminNotes.trim()) {
      toast({
        title: 'Notas requeridas',
        description: 'Debes proporcionar una razón para rechazar el pago',
        variant: 'destructive',
      });
      return;
    }

    setIsProcessing(true);
    try {
      const { error: paymentError } = await (supabase as any)
        .from('report_payments')
        .update({
          status: 'rejected',
          admin_notes: adminNotes,
          verified_at: new Date().toISOString(),
        })
        .eq('id', payment.id);

      if (paymentError) throw paymentError;

      // Create notification for user
      await (supabase as any).rpc('create_system_notification', {
        p_user_id: payment.user_id,
        p_subject: 'Pago Rechazado',
        p_content: `Tu pago de €${payment.amount} ha sido rechazado. Razón: ${adminNotes}. Por favor, contacta con soporte para más información.`,
        p_type: 'warning',
      });

      toast({
        title: 'Pago rechazado',
        description: 'El pago ha sido rechazado',
      });

      onUpdate();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'Pendiente', variant: 'secondary' as const },
      approved: { label: 'Aprobado', variant: 'default' as const },
      rejected: { label: 'Rechazado', variant: 'destructive' as const },
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getPaymentMethodLabel = (method: string) => {
    const methods: Record<string, string> = {
      stripe: 'Stripe',
      bank_transfer: 'Transferencia Bancaria',
    };
    return methods[method] || method;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-lg">
                {payment.profiles?.company_name || payment.profiles?.full_name}
              </h3>
              {getStatusBadge(payment.status)}
            </div>
            <p className="text-sm text-muted-foreground">{payment.profiles?.email}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-primary">€{payment.amount}</p>
            <p className="text-xs text-muted-foreground">
              {format(new Date(payment.created_at), "d 'de' MMMM, yyyy", { locale: es })}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-muted-foreground">Método</p>
              <p className="font-medium">{getPaymentMethodLabel(payment.payment_method)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-muted-foreground">Tipo de Informe</p>
              <p className="font-medium capitalize">
                {payment.report_requests?.report_type || 'N/A'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-muted-foreground">ID Vehículo</p>
              <p className="font-medium">{payment.report_requests?.vehicle_id || 'N/A'}</p>
            </div>
          </div>
          {payment.stripe_payment_intent_id && (
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-muted-foreground">Stripe ID</p>
                <p className="font-medium text-xs truncate">
                  {payment.stripe_payment_intent_id.substring(0, 15)}...
                </p>
              </div>
            </div>
          )}
        </div>

        {payment.payment_method === 'bank_transfer' && payment.bank_transfer_proof && (
          <div className="border rounded-lg p-4 bg-muted/30">
            <p className="text-sm font-medium mb-2">Comprobante de Transferencia:</p>
            <a
              href={payment.bank_transfer_proof}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
            >
              Ver comprobante <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        )}

        {payment.status === 'pending' && (
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Notas del Administrador {payment.status === 'pending' && '(opcional)'}
              </label>
              <Textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Añade notas sobre este pago..."
                className="min-h-[80px]"
              />
            </div>
            <div className="flex gap-3">
              <Button
                onClick={handleApprove}
                disabled={isProcessing}
                className="flex-1"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Aprobar Pago
              </Button>
              <Button
                onClick={handleReject}
                disabled={isProcessing}
                variant="destructive"
                className="flex-1"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Rechazar Pago
              </Button>
            </div>
          </div>
        )}

        {payment.status !== 'pending' && payment.admin_notes && (
          <div className="border-t pt-4">
            <p className="text-sm font-medium mb-1">Notas del Administrador:</p>
            <p className="text-sm text-muted-foreground">{payment.admin_notes}</p>
            {payment.verified_at && (
              <p className="text-xs text-muted-foreground mt-2">
                Verificado el {format(new Date(payment.verified_at), "d 'de' MMMM, yyyy 'a las' HH:mm", { locale: es })}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PaymentCard;
