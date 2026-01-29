import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Plus, X, Send } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface BudgetItem {
  id: string;
  concept: string;
  amount: number;
}

interface BudgetFormCardProps {
  requestId: string;
  onBudgetSent: () => void;
}

const BudgetFormCard: React.FC<BudgetFormCardProps> = ({ requestId, onBudgetSent }) => {
  const { toast } = useToast();
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([
    { id: '1', concept: 'Inspección técnica', amount: 0 },
  ]);
  const [budgetNotes, setBudgetNotes] = useState('');
  const [estimatedDate, setEstimatedDate] = useState<Date>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addBudgetItem = () => {
    const newId = (budgetItems.length + 1).toString();
    setBudgetItems([...budgetItems, { id: newId, concept: '', amount: 0 }]);
  };

  const removeBudgetItem = (id: string) => {
    if (budgetItems.length > 1) {
      setBudgetItems(budgetItems.filter(item => item.id !== id));
    }
  };

  const updateBudgetItem = (id: string, field: 'concept' | 'amount', value: string | number) => {
    setBudgetItems(budgetItems.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const totalAmount = budgetItems.reduce((sum, item) => sum + Number(item.amount), 0);

  const handleSubmit = async () => {
    if (!estimatedDate) {
      toast({
        title: 'Error',
        description: 'Debes seleccionar una fecha estimada de entrega',
        variant: 'destructive',
      });
      return;
    }

    if (totalAmount === 0) {
      toast({
        title: 'Error',
        description: 'El monto total debe ser mayor a cero',
        variant: 'destructive',
      });
      return;
    }

    const hasEmptyConcept = budgetItems.some(item => !item.concept.trim());
    if (hasEmptyConcept) {
      toast({
        title: 'Error',
        description: 'Todos los conceptos deben tener descripción',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Get request details to get user_id
      const { data: request, error: requestError } = await supabase
        .from('vehicle_report_requests')
        .select('user_id')
        .eq('id', requestId)
        .single();

      if (requestError) throw requestError;

      // Update the report request with budget information
      const { error: updateError } = await supabase
        .from('vehicle_report_requests')
        .update({
          budget_amount: totalAmount,
          budget_breakdown: budgetItems as any,
          budget_notes: budgetNotes,
          estimated_delivery_date: estimatedDate.toISOString(),
          budget_sent_at: new Date().toISOString(),
          status: 'budgeted' as any,
          updated_at: new Date().toISOString(),
        })
        .eq('id', requestId);

      if (updateError) throw updateError;

      // Create admin conversation
      const { data: conversation, error: conversationError } = await supabase
        .from('conversations')
        .insert({
          seller_id: null,
          buyer_id: request.user_id,
          is_admin_conversation: true,
          admin_sender_name: 'Sistema KONTACT',
          source_type: 'system_notification',
          source_title: 'Presupuesto de Informe Premium Disponible',
          status: 'active',
        })
        .select('id')
        .single();

      if (conversationError) {
        console.error('Error creating conversation:', conversationError);
        throw conversationError;
      }

      // Create message in conversation
      const messageContent = `Hemos preparado el presupuesto para tu solicitud de informe premium. El monto total es de €${totalAmount.toFixed(2)}. Por favor, revisa los detalles y acepta el presupuesto para continuar con el proceso.`;
      
      const { error: messageError } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversation.id,
          sender_id: null, // System message
          content: messageContent,
          original_language: 'es',
        });

      if (messageError) {
        console.error('Error creating message:', messageError);
        throw messageError;
      }

      // Create user notification
      const { error: notificationError } = await (supabase as any)
        .from('user_notifications')
        .insert({
          user_id: request.user_id,
          title: 'Presupuesto de Informe Premium Disponible',
          subject: 'Presupuesto de Informe Premium Disponible',
          content: messageContent,
          type: 'info',
          is_read: false,
        });

      if (notificationError) {
        console.error('Error creating user notification:', notificationError);
        throw notificationError;
      }

      toast({
        title: 'Presupuesto enviado',
        description: 'El presupuesto ha sido enviado al usuario exitosamente',
      });

      onBudgetSent();
    } catch (error) {
      console.error('Error al enviar presupuesto:', error);
      toast({
        title: 'Error',
        description: 'No se pudo enviar el presupuesto. Intenta nuevamente.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Send className="h-5 w-5" />
          Crear Presupuesto Premium
        </CardTitle>
        <CardDescription>
          Define los conceptos y montos para enviar al usuario
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Conceptos del Presupuesto</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addBudgetItem}
            >
              <Plus className="h-4 w-4 mr-1" />
              Agregar
            </Button>
          </div>

          {budgetItems.map((item) => (
            <div key={item.id} className="flex gap-2">
              <Input
                placeholder="Concepto"
                value={item.concept}
                onChange={(e) => updateBudgetItem(item.id, 'concept', e.target.value)}
                className="flex-1"
              />
              <Input
                type="number"
                placeholder="€0.00"
                value={item.amount || ''}
                onChange={(e) => updateBudgetItem(item.id, 'amount', parseFloat(e.target.value) || 0)}
                className="w-32"
                min="0"
                step="0.01"
              />
              {budgetItems.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeBudgetItem(item.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}

          <div className="flex justify-between items-center pt-2 border-t">
            <span className="font-semibold">Total:</span>
            <span className="text-lg font-bold">€{totalAmount.toFixed(2)}</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Fecha Estimada de Entrega</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !estimatedDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {estimatedDate ? format(estimatedDate, "PPP", { locale: es }) : "Seleccionar fecha"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={estimatedDate}
                onSelect={setEstimatedDate}
                locale={es}
                disabled={(date) => date < new Date()}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label>Notas Adicionales (Opcional)</Label>
          <Textarea
            placeholder="Información adicional sobre el presupuesto..."
            value={budgetNotes}
            onChange={(e) => setBudgetNotes(e.target.value)}
            rows={3}
          />
        </div>

        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full"
        >
          <Send className="h-4 w-4 mr-2" />
          {isSubmitting ? 'Enviando...' : 'Enviar Presupuesto al Usuario'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default BudgetFormCard;
