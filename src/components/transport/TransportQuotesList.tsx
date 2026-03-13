import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Eye, Truck, Calendar, MapPin, User, Phone, Mail, CheckCircle, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface TransportQuote {
  id: string;
  quote_number: string;
  status: string;
  brand: string;
  model: string;
  color: string;
  license_plate: string;
  origin_city: string;
  origin_country: string;
  destination_city: string;
  destination_country: string;
  origin_contact: string;
  origin_phone: string;
  origin_email: string;
  destination_contact: string;
  destination_phone: string;
  destination_email: string;
  transport_date: string;
  created_at: string;
}

interface QuoteResponse {
  id: string;
  quoted_price: number;
  estimated_pickup_date: string;
  estimated_delivery_date: string;
  terms_and_conditions: string;
  admin_notes: string;
  response_status: string;
  created_at: string;
}

const TransportQuotesList: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [quotes, setQuotes] = useState<TransportQuote[]>([]);
  const [responses, setResponses] = useState<Record<string, QuoteResponse>>({});
  const [loading, setLoading] = useState(true);
  const [selectedQuote, setSelectedQuote] = useState<TransportQuote | null>(null);

  useEffect(() => {
    loadUserQuotes();
  }, []);

  const loadUserQuotes = async () => {
    try {
      setLoading(true);
      const { data: user } = await supabase.auth.getUser();
      
      if (!user.user) {
        toast.error(t('toast.loginRequired'));
        return;
      }

      const { data: quotesData, error: quotesError } = await supabase
        .from('transport_quotes')
        .select('*')
        .eq('user_id', user.user.id)
        .order('created_at', { ascending: false });

      if (quotesError) {
        console.error('Error loading quotes:', quotesError);
        toast.error(t('toast.quoteError'));
        return;
      }

      setQuotes(quotesData || []);

      if (quotesData && quotesData.length > 0) {
        const quoteIds = quotesData.map(quote => quote.id);
        const { data: responsesData, error: responsesError } = await supabase
          .from('transport_quote_responses')
          .select('*')
          .in('transport_quote_id', quoteIds);

        if (responsesError) {
          console.error('Error loading responses:', responsesError);
        } else {
          const responsesMap = (responsesData || []).reduce((acc, response) => {
            acc[response.transport_quote_id] = response;
            return acc;
          }, {} as Record<string, QuoteResponse>);
          setResponses(responsesMap);
        }
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(t('toast.quoteError'));
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", label: string }> = {
      pending: { variant: "outline", label: t('transportQuotes.status.pending') },
      quoted: { variant: "secondary", label: t('transportQuotes.status.quoted') },
      accepted: { variant: "default", label: t('transportQuotes.status.accepted') },
      rejected: { variant: "destructive", label: t('transportQuotes.status.rejected') },
      completed: { variant: "default", label: t('transportQuotes.status.completed') }
    };
    
    const config = variants[status] || variants.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const handleAcceptQuote = async (quoteId: string) => {
    try {
      const { error } = await supabase
        .from('transport_quotes')
        .update({ status: 'accepted' })
        .eq('id', quoteId);

      if (error) {
        console.error('Error accepting quote:', error);
        toast.error(t('toast.quoteError'));
        return;
      }

      toast.success(t('toast.quoteAccepted'));
      loadUserQuotes();
    } catch (error) {
      console.error('Error:', error);
      toast.error(t('toast.quoteError'));
    }
  };

  const handleRejectQuote = async (quoteId: string) => {
    try {
      const { error } = await supabase
        .from('transport_quotes')
        .update({ status: 'rejected' })
        .eq('id', quoteId);

      if (error) {
        console.error('Error rejecting quote:', error);
        toast.error(t('toast.quoteError'));
        return;
      }

      toast.success(t('toast.quoteRejected'));
      loadUserQuotes();
    } catch (error) {
      console.error('Error:', error);
      toast.error(t('toast.quoteError'));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">{t('transportQuotes.loadingQuotes')}</p>
        </div>
      </div>
    );
  }

  if (quotes.length === 0) {
    return (
      <div className="text-center py-8">
        <Truck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground mb-4">{t('transportQuotes.noQuotes')}</p>
        <Button onClick={() => window.open('https://preview--mover-pro-flow.lovable.app', '_blank')}>
          {t('transportQuotes.requestQuote')}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{quotes.length}</div>
              <div className="text-sm text-muted-foreground">{t('transportQuotes.totalRequests')}</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {quotes.filter(q => q.status === 'pending').length}
              </div>
              <div className="text-sm text-muted-foreground">{t('transportQuotes.pendingLabel')}</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {quotes.filter(q => q.status === 'quoted').length}
              </div>
              <div className="text-sm text-muted-foreground">{t('transportQuotes.quotedLabel')}</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {quotes.filter(q => q.status === 'accepted').length}
              </div>
              <div className="text-sm text-muted-foreground">{t('transportQuotes.acceptedLabel')}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quotes Table */}
      <Card>
        <CardHeader>
          <CardTitle>{t('transportQuotes.myRequests')}</CardTitle>
          <CardDescription>
            {t('transportQuotes.myRequestsDesc')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('transportQuotes.tableNumber')}</TableHead>
                  <TableHead>{t('transportQuotes.tableVehicle')}</TableHead>
                  <TableHead>{t('transportQuotes.tableRoute')}</TableHead>
                  <TableHead>{t('transportQuotes.tableRequestDate')}</TableHead>
                  <TableHead>{t('transportQuotes.status')}</TableHead>
                  <TableHead>{t('transportQuotes.tablePrice')}</TableHead>
                  <TableHead>{t('transportQuotes.tableActions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {quotes.map((quote) => {
                  const response = responses[quote.id];
                  
                  return (
                    <TableRow key={quote.id}>
                      <TableCell className="font-medium">{quote.quote_number}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{quote.brand} {quote.model}</div>
                          <div className="text-sm text-muted-foreground">{quote.color} - {quote.license_plate}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="text-sm">{quote.origin_city}, {quote.origin_country}</div>
                          <div className="text-xs text-muted-foreground">↓</div>
                          <div className="text-sm">{quote.destination_city}, {quote.destination_country}</div>
                        </div>
                      </TableCell>
                      <TableCell>{new Date(quote.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>{getStatusBadge(quote.status)}</TableCell>
                      <TableCell>
                        {response ? (
                          <div className="text-sm">
                            <div className="font-medium">€{response.quoted_price}</div>
                            <div className="text-muted-foreground">{t('transportQuotes.quoted')}</div>
                          </div>
                        ) : (
                          <div className="text-sm text-muted-foreground">{t('transportQuotes.pending')}</div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedQuote(quote)}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                {t('transportQuotes.view')}
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>{t('transportQuotes.detailTitle')} - {quote.quote_number}</DialogTitle>
                                <DialogDescription>
                                  {t('transportQuotes.detailDesc')}
                                </DialogDescription>
                              </DialogHeader>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Card>
                                  <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                      <Truck className="h-5 w-5" />
                                      {t('transportQuotes.vehicleInfo')}
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent className="space-y-2">
                                    <div><strong>{t('transportQuotes.brand')}:</strong> {quote.brand}</div>
                                    <div><strong>{t('transportQuotes.model')}:</strong> {quote.model}</div>
                                    <div><strong>{t('transportQuotes.color')}:</strong> {quote.color}</div>
                                    <div><strong>{t('transportQuotes.plate')}:</strong> {quote.license_plate}</div>
                                  </CardContent>
                                </Card>

                                <Card>
                                  <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                      <MapPin className="h-5 w-5" />
                                      {t('transportQuotes.transportDetails')}
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent className="space-y-2">
                                    <div><strong>{t('transportQuotes.origin')}:</strong> {quote.origin_city}, {quote.origin_country}</div>
                                    <div><strong>{t('transportQuotes.destination')}:</strong> {quote.destination_city}, {quote.destination_country}</div>
                                    <div><strong>{t('transportQuotes.date')}:</strong> {new Date(quote.transport_date).toLocaleDateString()}</div>
                                    <div><strong>{t('transportQuotes.statusLabel')}:</strong> {getStatusBadge(quote.status)}</div>
                                  </CardContent>
                                </Card>

                                <Card>
                                  <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                      <User className="h-5 w-5" />
                                      {t('transportQuotes.originContact')}
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent className="space-y-2">
                                    <div className="flex items-center gap-2">
                                      <User className="h-4 w-4" />
                                      {quote.origin_contact}
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Phone className="h-4 w-4" />
                                      {quote.origin_phone}
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Mail className="h-4 w-4" />
                                      {quote.origin_email}
                                    </div>
                                  </CardContent>
                                </Card>

                                <Card>
                                  <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                      <User className="h-5 w-5" />
                                      {t('transportQuotes.destinationContact')}
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent className="space-y-2">
                                    <div className="flex items-center gap-2">
                                      <User className="h-4 w-4" />
                                      {quote.destination_contact}
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Phone className="h-4 w-4" />
                                      {quote.destination_phone}
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Mail className="h-4 w-4" />
                                      {quote.destination_email}
                                    </div>
                                  </CardContent>
                                </Card>
                              </div>

                              {response && (
                                <Card className="mt-6">
                                  <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                      <Calendar className="h-5 w-5" />
                                      {t('transportQuotes.quoteReceived')}
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                      <div>
                                        <strong>{t('transportQuotes.quotedPrice')}:</strong>
                                        <div className="text-2xl font-bold text-primary">€{response.quoted_price}</div>
                                      </div>
                                      <div>
                                        <strong>{t('transportQuotes.pickupDate')}:</strong>
                                        <div>{new Date(response.estimated_pickup_date).toLocaleDateString()}</div>
                                      </div>
                                      <div>
                                        <strong>{t('transportQuotes.deliveryDate')}:</strong>
                                        <div>{new Date(response.estimated_delivery_date).toLocaleDateString()}</div>
                                      </div>
                                    </div>
                                    
                                    {response.terms_and_conditions && (
                                      <div>
                                        <strong>{t('transportQuotes.termsConditions')}:</strong>
                                        <p className="text-sm mt-1 p-3 bg-muted rounded">{response.terms_and_conditions}</p>
                                      </div>
                                    )}

                                    {quote.status === 'quoted' && (
                                      <div className="flex gap-2 pt-4">
                                        <Button
                                          onClick={() => handleAcceptQuote(quote.id)}
                                          className="flex items-center gap-2"
                                        >
                                          <CheckCircle className="h-4 w-4" />
                                          {t('transportQuotes.acceptQuote')}
                                        </Button>
                                        <Button
                                          variant="outline"
                                          onClick={() => handleRejectQuote(quote.id)}
                                          className="flex items-center gap-2"
                                        >
                                          <XCircle className="h-4 w-4" />
                                          {t('transportQuotes.rejectQuote')}
                                        </Button>
                                      </div>
                                    )}
                                  </CardContent>
                                </Card>
                              )}
                            </DialogContent>
                          </Dialog>
                          
                          {response && quote.status === 'quoted' && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => handleAcceptQuote(quote.id)}
                                className="flex items-center gap-1"
                              >
                                <CheckCircle className="h-4 w-4" />
                                {t('transportQuotes.accept')}
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleRejectQuote(quote.id)}
                                className="flex items-center gap-1"
                              >
                                <XCircle className="h-4 w-4" />
                                {t('transportQuotes.reject')}
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransportQuotesList;
