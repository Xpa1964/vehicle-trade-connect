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
        toast.error('Usuario no autenticado');
        return;
      }

      // Load user's quotes
      const { data: quotesData, error: quotesError } = await supabase
        .from('transport_quotes')
        .select('*')
        .eq('user_id', user.user.id)
        .order('created_at', { ascending: false });

      if (quotesError) {
        console.error('Error loading quotes:', quotesError);
        toast.error('Error al cargar las cotizaciones');
        return;
      }

      setQuotes(quotesData || []);

      // Load responses for user's quotes
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
      toast.error('Error al cargar las cotizaciones');
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
        toast.error('Error al aceptar la cotización');
        return;
      }

      toast.success('Cotización aceptada correctamente');
      loadUserQuotes();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al aceptar la cotización');
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
        toast.error('Error al rechazar la cotización');
        return;
      }

      toast.success('Cotización rechazada');
      loadUserQuotes();
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al rechazar la cotización');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Cargando cotizaciones...</p>
        </div>
      </div>
    );
  }

  if (quotes.length === 0) {
    return (
      <div className="text-center py-8">
        <Truck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground mb-4">{t('transportQuotes.noQuotes')}</p>
        <Button onClick={() => navigate('/transport')}>
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
              <div className="text-sm text-muted-foreground">Total Solicitudes</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {quotes.filter(q => q.status === 'pending').length}
              </div>
              <div className="text-sm text-muted-foreground">Pendientes</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {quotes.filter(q => q.status === 'quoted').length}
              </div>
              <div className="text-sm text-muted-foreground">Cotizadas</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {quotes.filter(q => q.status === 'accepted').length}
              </div>
              <div className="text-sm text-muted-foreground">Aceptadas</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quotes Table */}
      <Card>
        <CardHeader>
          <CardTitle>Mis Solicitudes de Transporte</CardTitle>
          <CardDescription>
            Gestiona tus solicitudes de transporte y revisa las cotizaciones recibidas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Número</TableHead>
                  <TableHead>Vehículo</TableHead>
                  <TableHead>Ruta</TableHead>
                  <TableHead>Fecha Solicitud</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Precio</TableHead>
                  <TableHead>Acciones</TableHead>
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
                            <div className="text-muted-foreground">Cotizado</div>
                          </div>
                        ) : (
                          <div className="text-sm text-muted-foreground">Pendiente</div>
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
                                Ver
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Detalle de Solicitud - {quote.quote_number}</DialogTitle>
                                <DialogDescription>
                                  Información completa de tu solicitud de transporte
                                </DialogDescription>
                              </DialogHeader>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Vehicle Information */}
                                <Card>
                                  <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                      <Truck className="h-5 w-5" />
                                      Información del Vehículo
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent className="space-y-2">
                                    <div><strong>Marca:</strong> {quote.brand}</div>
                                    <div><strong>Modelo:</strong> {quote.model}</div>
                                    <div><strong>Color:</strong> {quote.color}</div>
                                    <div><strong>Placa:</strong> {quote.license_plate}</div>
                                  </CardContent>
                                </Card>

                                {/* Transport Details */}
                                <Card>
                                  <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                      <MapPin className="h-5 w-5" />
                                      Detalles del Transporte
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent className="space-y-2">
                                    <div><strong>Origen:</strong> {quote.origin_city}, {quote.origin_country}</div>
                                    <div><strong>Destino:</strong> {quote.destination_city}, {quote.destination_country}</div>
                                    <div><strong>Fecha:</strong> {new Date(quote.transport_date).toLocaleDateString()}</div>
                                    <div><strong>Estado:</strong> {getStatusBadge(quote.status)}</div>
                                  </CardContent>
                                </Card>

                                {/* Origin Contact */}
                                <Card>
                                  <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                      <User className="h-5 w-5" />
                                      Contacto Origen
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

                                {/* Destination Contact */}
                                <Card>
                                  <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                      <User className="h-5 w-5" />
                                      Contacto Destino
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

                              {/* Quote Response */}
                              {response && (
                                <Card className="mt-6">
                                  <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                      <Calendar className="h-5 w-5" />
                                      Cotización Recibida
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                      <div>
                                        <strong>Precio Cotizado:</strong>
                                        <div className="text-2xl font-bold text-primary">€{response.quoted_price}</div>
                                      </div>
                                      <div>
                                        <strong>Fecha Recogida:</strong>
                                        <div>{new Date(response.estimated_pickup_date).toLocaleDateString()}</div>
                                      </div>
                                      <div>
                                        <strong>Fecha Entrega:</strong>
                                        <div>{new Date(response.estimated_delivery_date).toLocaleDateString()}</div>
                                      </div>
                                    </div>
                                    
                                    {response.terms_and_conditions && (
                                      <div>
                                        <strong>Términos y Condiciones:</strong>
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
                                          Aceptar Cotización
                                        </Button>
                                        <Button
                                          variant="outline"
                                          onClick={() => handleRejectQuote(quote.id)}
                                          className="flex items-center gap-2"
                                        >
                                          <XCircle className="h-4 w-4" />
                                          Rechazar
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
                                Aceptar
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleRejectQuote(quote.id)}
                                className="flex items-center gap-1"
                              >
                                <XCircle className="h-4 w-4" />
                                Rechazar
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