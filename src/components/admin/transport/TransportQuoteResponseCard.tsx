import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { FileText } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface TransportQuote {
  id: string;
  quote_number: string;
  user_id: string;
  brand: string;
  model: string;
  origin_city: string;
  origin_country: string;
  destination_city: string;
  destination_country: string;
}

interface QuoteResponse {
  quoted_price: number;
  estimated_pickup_date: string;
  estimated_delivery_date: string;
  terms_and_conditions: string;
  admin_notes: string;
}

interface TransportQuoteResponseCardProps {
  quote: TransportQuote;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function TransportQuoteResponseCard({ 
  quote, 
  onSuccess, 
  onCancel 
}: TransportQuoteResponseCardProps) {
  const { t } = useLanguage();
  const [responseData, setResponseData] = useState<QuoteResponse>({
    quoted_price: 0,
    estimated_pickup_date: '',
    estimated_delivery_date: '',
    terms_and_conditions: '',
    admin_notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitResponse = async () => {
    if (!quote) return;

    // Validate required fields
    if (!responseData.quoted_price || responseData.quoted_price <= 0) {
      toast.error(t('transportQuotes.validation.errorPriceRequired'));
      return;
    }

    if (!responseData.estimated_pickup_date || !responseData.estimated_delivery_date) {
      toast.error(t('transportQuotes.validation.errorDatesRequired'));
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Get admin user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');

      // 2. Insert quote response
      const { error: responseError } = await supabase
        .from('transport_quote_responses')
        .insert({
          transport_quote_id: quote.id,
          admin_user_id: user.id,
          quoted_price: responseData.quoted_price,
          estimated_pickup_date: responseData.estimated_pickup_date,
          estimated_delivery_date: responseData.estimated_delivery_date,
          terms_and_conditions: responseData.terms_and_conditions,
          admin_notes: responseData.admin_notes,
          response_status: 'quoted'
        });

      if (responseError) {
        console.error('Error creating response:', responseError);
        throw responseError;
      }

      // 3. Update quote status
      const { error: updateError } = await supabase
        .from('transport_quotes')
        .update({ status: 'quoted' })
        .eq('id', quote.id);

      if (updateError) {
        console.error('Error updating quote status:', updateError);
        throw updateError;
      }

      // 4. Create admin conversation (INSERT directo)
      const { data: conversation, error: conversationError } = await supabase
        .from('conversations')
        .insert({
          seller_id: null,
          buyer_id: quote.user_id,
          is_admin_conversation: true,
          admin_sender_name: t('transportQuotes.system.adminSenderName'),
          source_type: 'transport_quote',
          source_title: t('transportQuotes.system.sourceTitle', { quoteNumber: quote.quote_number }),
          status: 'active',
        })
        .select('id')
        .single();

      if (conversationError) {
        console.error('Error creating conversation:', conversationError);
        throw conversationError;
      }

      // 5. Create message in conversation (sender_id = null para mensajes del sistema)
      const route = `${quote.origin_city}, ${quote.origin_country} → ${quote.destination_city}, ${quote.destination_country}`;
      const vehicle = `${quote.brand} ${quote.model}`;
      const price = responseData.quoted_price.toFixed(2);
      const pickupDate = new Date(responseData.estimated_pickup_date).toLocaleDateString();
      const deliveryDate = new Date(responseData.estimated_delivery_date).toLocaleDateString();
      const terms = responseData.terms_and_conditions 
        ? `${t('transportQuotes.system.termsPrefix')}${responseData.terms_and_conditions}` 
        : '';
      
      const messageContent = t('transportQuotes.admin.messageTemplate', {
        quoteNumber: quote.quote_number,
        route,
        vehicle,
        price,
        pickupDate,
        deliveryDate,
        terms
      });
      
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

      // 6. Create user notification
      const { error: notificationError } = await supabase
        .from('user_notifications')
        .insert({
          user_id: quote.user_id,
          subject: t('transportQuotes.system.notificationSubject', { quoteNumber: quote.quote_number }),
          content: messageContent,
          type: 'info',
          is_read: false,
        });

      if (notificationError) {
        console.error('Error creating user notification:', notificationError);
        throw notificationError;
      }

      console.log('✅ Transport quote response sent successfully:', {
        quoteId: quote.id,
        conversationId: conversation.id,
        userId: quote.user_id
      });

      toast.success(t('transportQuotes.admin.quoteSentSuccess'));
      onSuccess();

    } catch (error) {
      console.error('Error submitting transport quote response:', error);
      toast.error(t('transportQuotes.admin.errorSending'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          {t('transportQuotes.admin.respondToQuote')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="quoted_price">{t('transportQuotes.admin.quotedPriceLabel')}</Label>
            <Input
              id="quoted_price"
              type="number"
              min="0"
              step="0.01"
              value={responseData.quoted_price || ''}
              onChange={(e) => setResponseData({
                ...responseData,
                quoted_price: parseFloat(e.target.value) || 0
              })}
              placeholder={t('transportQuotes.admin.quotedPricePlaceholder')}
            />
          </div>
          <div>
            <Label htmlFor="pickup_date">{t('transportQuotes.admin.estimatedPickupLabel')}</Label>
            <Input
              id="pickup_date"
              type="date"
              value={responseData.estimated_pickup_date}
              onChange={(e) => setResponseData({
                ...responseData,
                estimated_pickup_date: e.target.value
              })}
            />
          </div>
          <div>
            <Label htmlFor="delivery_date">{t('transportQuotes.admin.estimatedDeliveryLabel')}</Label>
            <Input
              id="delivery_date"
              type="date"
              value={responseData.estimated_delivery_date}
              onChange={(e) => setResponseData({
                ...responseData,
                estimated_delivery_date: e.target.value
              })}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="terms">{t('transportQuotes.admin.termsLabel')}</Label>
          <Textarea
            id="terms"
            value={responseData.terms_and_conditions}
            onChange={(e) => setResponseData({
              ...responseData,
              terms_and_conditions: e.target.value
            })}
            placeholder={t('transportQuotes.admin.termsPlaceholder')}
            rows={4}
          />
        </div>

        <div>
          <Label htmlFor="admin_notes">{t('transportQuotes.admin.adminNotesLabel')}</Label>
          <Textarea
            id="admin_notes"
            value={responseData.admin_notes}
            onChange={(e) => setResponseData({
              ...responseData,
              admin_notes: e.target.value
            })}
            placeholder={t('transportQuotes.admin.adminNotesPlaceholder')}
            rows={3}
          />
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            {t('transportQuotes.admin.cancel')}
          </Button>
          <Button
            onClick={handleSubmitResponse}
            disabled={isSubmitting}
          >
            {isSubmitting ? t('transportQuotes.admin.sending') : t('transportQuotes.admin.sendQuote')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
