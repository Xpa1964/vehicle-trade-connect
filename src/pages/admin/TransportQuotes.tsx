import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Search, Eye, Truck, MapPin, User, Phone, Mail, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import TransportQuoteResponseCard from '@/components/admin/transport/TransportQuoteResponseCard';

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
  user_id: string;
}


const AdminTransportQuotes: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [quotes, setQuotes] = useState<TransportQuote[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedQuote, setSelectedQuote] = useState<TransportQuote | null>(null);

  useEffect(() => {
    loadQuotes();
  }, []);

  const loadQuotes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('transport_quotes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading quotes:', error);
        toast.error(t('transportQuotes.admin.errorLoading'));
      } else {
        setQuotes(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(t('transportQuotes.admin.errorLoading'));
    } finally {
      setLoading(false);
    }
  };

  const filteredQuotes = quotes.filter(quote => {
    const matchesSearch = quote.quote_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quote.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quote.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quote.origin_city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quote.destination_city.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || quote.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

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

  const handleResponseSuccess = () => {
    setSelectedQuote(null);
    loadQuotes();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">{t('transportQuotes.admin.loadingQuotes')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Back Button */}
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => navigate('/admin/control-panel')}
        className="mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Volver al Panel de Control
      </Button>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {t('transportQuotes.admin.title')}
          </h1>
          <p className="text-muted-foreground">
            {t('transportQuotes.admin.description')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-sm">
            {filteredQuotes.length} {t('transportQuotes.admin.totalQuotes')}
          </Badge>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t('transportQuotes.admin.filters')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search">{t('transportQuotes.admin.search')}</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder={t('transportQuotes.admin.searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <Label htmlFor="status-filter">{t('transportQuotes.admin.statusFilter')}</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder={t('transportQuotes.admin.filterByStatus')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('transportQuotes.admin.allStatuses')}</SelectItem>
                  <SelectItem value="pending">{t('transportQuotes.status.pending')}</SelectItem>
                  <SelectItem value="quoted">{t('transportQuotes.status.quoted')}</SelectItem>
                  <SelectItem value="accepted">{t('transportQuotes.status.accepted')}</SelectItem>
                  <SelectItem value="rejected">{t('transportQuotes.status.rejected')}</SelectItem>
                  <SelectItem value="completed">{t('transportQuotes.status.completed')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quotes Table */}
      <Card>
        <CardHeader>
          <CardTitle>{t('transportQuotes.admin.quotesList')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('transportQuotes.admin.tableNumber')}</TableHead>
                  <TableHead>{t('transportQuotes.admin.tableVehicle')}</TableHead>
                  <TableHead>{t('transportQuotes.admin.tableRoute')}</TableHead>
                  <TableHead>{t('transportQuotes.admin.tableRequestDate')}</TableHead>
                  <TableHead>{t('transportQuotes.admin.tableStatus')}</TableHead>
                  <TableHead>{t('transportQuotes.admin.tableActions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredQuotes.map((quote) => (
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
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedQuote(quote)}
                            className="mr-2"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            {t('transportQuotes.admin.viewButton')}
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>{t('transportQuotes.admin.quoteDetail')} - {quote.quote_number}</DialogTitle>
                            <DialogDescription>
                              {t('transportQuotes.admin.quoteDetailDescription')}
                            </DialogDescription>
                          </DialogHeader>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Vehicle Information */}
                            <Card>
                              <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                  <Truck className="h-5 w-5" />
                                  {t('transportQuotes.admin.vehicleInfo')}
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-2">
                                <div><strong>{t('transportQuotes.admin.vehicleBrand')}:</strong> {quote.brand}</div>
                                <div><strong>{t('transportQuotes.admin.vehicleModel')}:</strong> {quote.model}</div>
                                <div><strong>{t('transportQuotes.admin.vehicleColor')}:</strong> {quote.color}</div>
                                <div><strong>{t('transportQuotes.admin.vehiclePlate')}:</strong> {quote.license_plate}</div>
                              </CardContent>
                            </Card>

                            {/* Transport Details */}
                            <Card>
                              <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                  <MapPin className="h-5 w-5" />
                                  {t('transportQuotes.admin.transportDetails')}
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-2">
                                <div><strong>{t('transportQuotes.admin.origin')}:</strong> {quote.origin_city}, {quote.origin_country}</div>
                                <div><strong>{t('transportQuotes.admin.destination')}:</strong> {quote.destination_city}, {quote.destination_country}</div>
                                <div><strong>{t('transportQuotes.admin.date')}:</strong> {new Date(quote.transport_date).toLocaleDateString()}</div>
                                <div><strong>{t('transportQuotes.admin.status')}:</strong> {getStatusBadge(quote.status)}</div>
                              </CardContent>
                            </Card>

                            {/* Origin Contact */}
                            <Card>
                              <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                  <User className="h-5 w-5" />
                                  {t('transportQuotes.admin.originContact')}
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
                                  {t('transportQuotes.admin.destinationContact')}
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

                          {/* Response Form */}
                          {quote.status === 'pending' && (
                            <TransportQuoteResponseCard
                              quote={quote}
                              onSuccess={handleResponseSuccess}
                              onCancel={() => setSelectedQuote(null)}
                            />
                          )}
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {filteredQuotes.length === 0 && (
            <div className="text-center py-8">
              <Truck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">{t('transportQuotes.admin.noQuotesFound')}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminTransportQuotes;