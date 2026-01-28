import React, { useState, useEffect } from 'react';
import { ArrowLeft, FileText, Download, CheckCircle, Clock, Plus, Eye, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import BudgetReviewDialog from '@/components/vehicle-reports/BudgetReviewDialog';
import reportDeliveryImage from '@/assets/report-delivery-image.png';

interface ReportRequest {
  id: string;
  vehicle_plate: string;
  vehicle_brand: string;
  vehicle_model: string;
  vehicle_year: number;
  report_type: string;
  status: string;
  created_at: string;
  budget_amount?: number;
  budget_breakdown?: any;
  budget_notes?: string;
  estimated_delivery_date?: string;
}

interface ReportDelivery {
  id: string;
  file_name: string;
  file_type: string;
  file_url: string;
  file_size: number;
  is_primary: boolean;
  file_category: string;
}

const VehicleReports: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [reports, setReports] = useState<ReportRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [deliveries, setDeliveries] = useState<Record<string, ReportDelivery[]>>({});
  const [selectedBudget, setSelectedBudget] = useState<ReportRequest | null>(null);
  const [budgetDialogOpen, setBudgetDialogOpen] = useState(false);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('vehicle_report_requests')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReports(data || []);

      // Fetch deliveries for delivered reports
      const deliveredIds = (data || [])
        .filter(r => r.status === 'delivered')
        .map(r => r.id);

      if (deliveredIds.length > 0) {
        const { data: deliveriesData } = await (supabase as any)
          .from('vehicle_report_deliveries')
          .select('*')
          .in('request_id', deliveredIds);

        if (deliveriesData) {
          const deliveriesMap: Record<string, ReportDelivery[]> = {};
          deliveriesData.forEach((delivery: any) => {
            if (!deliveriesMap[delivery.request_id]) {
              deliveriesMap[delivery.request_id] = [];
            }
            deliveriesMap[delivery.request_id].push(delivery);
          });
          setDeliveries(deliveriesMap);
        }
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudieron cargar los informes'
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; variant: any; className?: string }> = {
      pending: { label: 'Pendiente de Procesamiento', variant: 'secondary' },
      budgeted: { label: 'Presupuesto Disponible', variant: 'outline', className: 'border-amber-500 text-amber-600' },
      budget_accepted: { label: 'Presupuesto Aceptado', variant: 'outline', className: 'border-green-500 text-green-600' },
      budget_rejected: { label: 'Presupuesto Rechazado', variant: 'outline', className: 'border-red-500 text-red-600' },
      in_process: { label: 'En Proceso', variant: 'default', className: 'bg-orange-100 text-orange-800' },
      delivered: { label: 'Entregado', variant: 'default', className: 'bg-green-100 text-green-800' },
      rejected: { label: 'Rechazado', variant: 'destructive' }
    };

    const statusInfo = statusMap[status] || statusMap.pending;
    return (
      <Badge variant={statusInfo.variant} className={statusInfo.className}>
        {statusInfo.label}
      </Badge>
    );
  };

  const getReportTypeName = (type: string) => {
    const types: Record<string, string> = {
      basic: 'Básico (DGT)',
      technical: 'Técnico (Carfax)',
      premium: 'Premium (Carfax + Inspección)'
    };
    return types[type] || type;
  };

  const handleDownload = async (fileUrl: string, fileName: string) => {
    try {
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = fileName;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading file:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo descargar el archivo'
      });
    }
  };

  return (
    <div className="min-h-screen w-full">
      <div className="container mx-auto px-4 py-8 max-w-full">
        {/* Header con imagen de fondo */}
        <div className="relative overflow-hidden rounded-xl shadow-lg mb-6">
          <div className="absolute inset-0">
            <img 
              src={reportDeliveryImage}
              alt="Vehicle Reports Background"
              className="w-full h-full object-cover object-center"
              style={{ minHeight: '320px' }}
            />
          </div>
          
          <div className="relative z-10 p-8" style={{ minHeight: '320px' }}>
            <div className="flex flex-col justify-between h-full">
              {/* Back button */}
              <div className="mb-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => navigate('/dashboard')}
                  className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  {t('navigation.backToDashboard')}
                </Button>
              </div>
              
              <div className="flex flex-col justify-end flex-1">
                {/* Title with independent mask */}
                <div className="mb-4 bg-black/20 backdrop-blur-sm rounded-lg p-4 border border-white/10 w-fit">
                  <h1 className="text-3xl md:text-4xl font-bold text-white">
                    {t('reports.title', { fallback: 'Entrega de Informes' })}
                  </h1>
                </div>
                
                {/* Description with independent mask */}
                <div className="bg-black/20 backdrop-blur-sm rounded-lg p-4 border border-white/10 w-fit">
                  <p className="text-lg text-white font-bold">
                    {t('reports.subtitle', { fallback: 'Descarga tus informes técnicos solicitados' })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Informes Entregados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {reports.filter(r => r.status === 'delivered').length}
            </div>
            <p className="text-gray-600">Listos para descarga</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-600" />
              En Proceso
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">
              {reports.filter(r => r.status === 'in_process').length}
            </div>
            <p className="text-gray-600">Siendo procesados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Nuevo Informe</CardTitle>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link to="/request-report">
                <Plus className="h-4 w-4 mr-2" />
                Solicitar Informe
              </Link>
            </Button>
          </CardContent>
        </Card>
        </div>

        {/* Reports List */}
        <Card>
        <CardHeader>
          <CardTitle>Mis Informes</CardTitle>
          <CardDescription>
            Informes técnicos solicitados y su estado actual
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300 animate-pulse" />
              <p>Cargando informes...</p>
            </div>
          ) : reports.length > 0 ? (
            <div className="space-y-4">
              {reports.map((report) => (
                <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">
                      {report.vehicle_brand} {report.vehicle_model} {report.vehicle_year} - {report.vehicle_plate}
                    </h3>
                    <p className="text-gray-600">{getReportTypeName(report.report_type)}</p>
                    <p className="text-sm text-gray-500">
                      Solicitado el: {new Date(report.created_at).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    {getStatusBadge(report.status)}
                    
                    {report.status === 'budgeted' && (
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedBudget(report);
                          setBudgetDialogOpen(true);
                        }}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Ver Presupuesto
                      </Button>
                    )}
                    
                    {report.status === 'delivered' && deliveries[report.id] && (
                      <div className="flex flex-wrap gap-2">
                        {deliveries[report.id]
                          .sort((a, b) => (a.is_primary ? -1 : 1))
                          .map((delivery) => {
                            const categoryLabels: Record<string, string> = {
                              main_report: 'PDF Principal',
                              audio: 'Audio',
                              photo: 'Foto',
                              supplementary: 'Suplementario'
                            };
                            const label = categoryLabels[delivery.file_category] || 
                                         (delivery.file_type === 'application/pdf' ? 'PDF' : 
                                          delivery.file_type.startsWith('audio/') ? 'Audio' : 'Archivo');
                            
                            return (
                              <Button
                                key={delivery.id}
                                size="sm"
                                variant={delivery.is_primary ? 'default' : 'outline'}
                                onClick={() => handleDownload(delivery.file_url, delivery.file_name)}
                              >
                                <Download className="h-4 w-4 mr-2" />
                                {label}
                              </Button>
                            );
                          })}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <p>No tienes informes solicitados aún</p>
              <Button asChild className="mt-4">
                <Link to="/request-report">
                  <Plus className="h-4 w-4 mr-2" />
                  Solicitar tu primer informe
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedBudget && (
        <BudgetReviewDialog
          open={budgetDialogOpen}
          onOpenChange={setBudgetDialogOpen}
          requestId={selectedBudget.id}
          budgetAmount={selectedBudget.budget_amount || 0}
          budgetBreakdown={selectedBudget.budget_breakdown || []}
          budgetNotes={selectedBudget.budget_notes}
          estimatedDeliveryDate={selectedBudget.estimated_delivery_date}
          onBudgetResponse={() => {
            fetchReports();
            setSelectedBudget(null);
          }}
        />
      )}
      </div>
    </div>
  );
};

export default VehicleReports;
