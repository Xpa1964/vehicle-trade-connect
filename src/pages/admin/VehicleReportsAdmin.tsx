import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Upload, Check, X, Clock, DollarSign, AlertCircle, Package, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { formatFileSize } from '@/utils/fileUtils';

interface ReportRequest {
  id: string;
  user_id: string;
  vehicle_plate: string;
  vehicle_brand: string;
  vehicle_model: string;
  vehicle_year: number;
  vehicle_location: string;
  report_type: string;
  status: string;
  observations: string;
  base_price: number;
  final_price: number;
  admin_notes: string;
  created_at: string;
  updated_at: string;
  profiles?: {
    full_name: string | null;
    email: string;
    company_name: string | null;
  } | null;
}

const VehicleReportsAdmin: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [requests, setRequests] = useState<ReportRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<ReportRequest | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showBatchDialog, setShowBatchDialog] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  
  // Budget form
  const [budgetAmount, setBudgetAmount] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  
  // Upload form
  const [uploadFiles, setUploadFiles] = useState<FileList | null>(null);
  const [uploading, setUploading] = useState(false);

  // Premium batch
  const [premiumRequests, setPremiumRequests] = useState<ReportRequest[]>([]);
  const [selectedPremiumIds, setSelectedPremiumIds] = useState<string[]>([]);

  useEffect(() => {
    fetchRequests();
  }, [statusFilter, typeFilter]);

  const fetchRequests = async () => {
    try {
      let query = supabase
        .from('vehicle_report_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter as any);
      }

      if (typeFilter !== 'all') {
        query = query.eq('report_type', typeFilter as any);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      // Fetch user profiles separately
      const requestsWithProfiles = await Promise.all(
        (data || []).map(async (request) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name, email, company_name')
            .eq('id', request.user_id)
            .single();
          
          return {
            ...request,
            profiles: profile
          };
        })
      );

      setRequests(requestsWithProfiles as any);

      // Filter premium requests for batch management
      const premium = (data || []).filter(
        r => r.report_type === 'premium' && ['pending', 'budgeted', 'paid'].includes(r.status)
      );
      setPremiumRequests(premium);
    } catch (error) {
      console.error('Error fetching requests:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudieron cargar las solicitudes'
      });
    } finally {
      setLoading(false);
    }
  };

  const updateRequestStatus = async (requestId: string, newStatus: string, additionalData?: any) => {
    try {
      const updateData: any = { status: newStatus, updated_at: new Date().toISOString() };
      
      if (additionalData) {
        Object.assign(updateData, additionalData);
      }

      const { error } = await supabase
        .from('vehicle_report_requests')
        .update(updateData)
        .eq('id', requestId);

      if (error) throw error;

      toast({
        title: 'Estado actualizado',
        description: 'El estado de la solicitud ha sido actualizado correctamente'
      });

      fetchRequests();
      setShowDetailDialog(false);
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo actualizar el estado'
      });
    }
  };

  const handleSetBudget = async () => {
    if (!selectedRequest || !budgetAmount) return;

    await updateRequestStatus(selectedRequest.id, 'budgeted', {
      final_price: parseFloat(budgetAmount),
      admin_notes: adminNotes
    });

    setBudgetAmount('');
    setAdminNotes('');
  };

  const handleFileUpload = async () => {
    if (!selectedRequest || !uploadFiles || uploadFiles.length === 0) return;

    setUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated');

      for (let i = 0; i < uploadFiles.length; i++) {
        const file = uploadFiles[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${selectedRequest.id}_${Date.now()}_${i}.${fileExt}`;
        const filePath = `reports/${fileName}`;

        // Upload to storage
        const { error: uploadError } = await supabase.storage
          .from('vehicle-documents')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('vehicle-documents')
          .getPublicUrl(filePath);

        // Create delivery record
        const { error: deliveryError } = await supabase
          .from('vehicle_report_deliveries')
          .insert({
            request_id: selectedRequest.id,
            file_name: file.name,
            file_type: file.type,
            file_url: publicUrl,
            file_size: file.size,
            is_primary: i === 0,
            uploaded_by: user.id
          });

        if (deliveryError) throw deliveryError;
      }

      // Update request status to delivered
      await updateRequestStatus(selectedRequest.id, 'delivered');

      toast({
        title: 'Archivos subidos',
        description: 'Los archivos han sido subidos correctamente'
      });

      setShowUploadDialog(false);
      setUploadFiles(null);
    } catch (error) {
      console.error('Error uploading files:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudieron subir los archivos'
      });
    } finally {
      setUploading(false);
    }
  };

  const createPremiumBatch = async () => {
    if (selectedPremiumIds.length < 5) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Se requieren al menos 5 solicitudes para crear un lote Premium'
      });
      return;
    }

    try {
      const batchNumber = `PREMIUM-${Date.now()}`;

      const { error } = await supabase
        .from('premium_report_batches')
        .insert({
          batch_number: batchNumber,
          request_ids: selectedPremiumIds,
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: 'Lote creado',
        description: `Lote ${batchNumber} creado con ${selectedPremiumIds.length} solicitudes`
      });

      setSelectedPremiumIds([]);
      setShowBatchDialog(false);
      fetchRequests();
    } catch (error) {
      console.error('Error creating batch:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo crear el lote'
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; className: string; icon: any }> = {
      draft: { label: 'Borrador', className: 'bg-gray-100 text-gray-800', icon: FileText },
      pending: { label: 'Pendiente', className: 'bg-yellow-100 text-yellow-800', icon: Clock },
      budgeted: { label: 'Presupuestado', className: 'bg-blue-100 text-blue-800', icon: DollarSign },
      paid: { label: 'Pagado', className: 'bg-purple-100 text-purple-800', icon: Check },
      in_process: { label: 'En Proceso', className: 'bg-orange-100 text-orange-800', icon: Clock },
      delivered: { label: 'Entregado', className: 'bg-green-100 text-green-800', icon: Check },
      rejected: { label: 'Rechazado', className: 'bg-red-100 text-red-800', icon: X }
    };

    const info = statusMap[status] || statusMap.pending;
    const Icon = info.icon;

    return (
      <Badge className={info.className}>
        <Icon className="h-3 w-3 mr-1" />
        {info.label}
      </Badge>
    );
  };

  const getReportTypeName = (type: string) => {
    const types: Record<string, string> = {
      basic: 'Básico (DGT)',
      technical: 'Técnico (Carfax)',
      premium: 'Premium (Inspección)'
    };
    return types[type] || type;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => navigate('/admin/control-panel')}
        className="mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Volver al Panel de Control
      </Button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Gestión de Informes de Vehículos</h1>
        <p className="text-gray-600">Administra las solicitudes de informes técnicos</p>
      </div>

      <Tabs defaultValue="requests" className="space-y-6">
        <TabsList>
          <TabsTrigger value="requests">Solicitudes</TabsTrigger>
          <TabsTrigger value="premium-batch">
            Lotes Premium
            {premiumRequests.length >= 5 && (
              <Badge className="ml-2 bg-orange-500">{premiumRequests.length}</Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="requests" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Filtros</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Estado</Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="pending">Pendiente</SelectItem>
                      <SelectItem value="budgeted">Presupuestado</SelectItem>
                      <SelectItem value="paid">Pagado</SelectItem>
                      <SelectItem value="in_process">En Proceso</SelectItem>
                      <SelectItem value="delivered">Entregado</SelectItem>
                      <SelectItem value="rejected">Rechazado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Tipo de Informe</Label>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="basic">Básico (DGT)</SelectItem>
                      <SelectItem value="technical">Técnico (Carfax)</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{requests.filter(r => r.status === 'pending').length}</div>
                <p className="text-sm text-gray-600">Pendientes</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{requests.filter(r => r.status === 'in_process').length}</div>
                <p className="text-sm text-gray-600">En Proceso</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{requests.filter(r => r.status === 'delivered').length}</div>
                <p className="text-sm text-gray-600">Entregados</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{premiumRequests.length}</div>
                <p className="text-sm text-gray-600">Premium Pendientes</p>
              </CardContent>
            </Card>
          </div>

          {/* Requests List */}
          <Card>
            <CardHeader>
              <CardTitle>Solicitudes</CardTitle>
              <CardDescription>
                {requests.length} solicitud{requests.length !== 1 ? 'es' : ''} encontrada{requests.length !== 1 ? 's' : ''}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">Cargando...</div>
              ) : requests.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No hay solicitudes</div>
              ) : (
                <div className="space-y-4">
                  {requests.map((request) => (
                    <div
                      key={request.id}
                      className="border rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => {
                        setSelectedRequest(request);
                        setShowDetailDialog(true);
                        setBudgetAmount(request.final_price?.toString() || request.base_price?.toString() || '');
                        setAdminNotes(request.admin_notes || '');
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">
                              {request.vehicle_brand} {request.vehicle_model} {request.vehicle_year} - {request.vehicle_plate}
                            </h3>
                            {getStatusBadge(request.status)}
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                            <div>
                              <span className="font-medium">Cliente:</span>{' '}
                              {request.profiles?.full_name || request.profiles?.company_name || 'N/A'}
                            </div>
                            <div>
                              <span className="font-medium">Email:</span> {request.profiles?.email || 'N/A'}
                            </div>
                            <div>
                              <span className="font-medium">Tipo:</span> {getReportTypeName(request.report_type)}
                            </div>
                            <div>
                              <span className="font-medium">Ubicación:</span> {request.vehicle_location}
                            </div>
                            <div>
                              <span className="font-medium">Precio base:</span> {request.base_price}€
                            </div>
                            {request.final_price && (
                              <div>
                                <span className="font-medium">Precio final:</span> {request.final_price}€
                              </div>
                            )}
                            <div className="col-span-2">
                              <span className="font-medium">Fecha:</span>{' '}
                              {new Date(request.created_at).toLocaleString('es-ES')}
                            </div>
                          </div>

                          {request.observations && (
                            <div className="mt-2 text-sm text-gray-600">
                              <span className="font-medium">Observaciones:</span> {request.observations}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="premium-batch">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Gestión de Lotes Premium
              </CardTitle>
              <CardDescription>
                Agrupa solicitudes Premium para programar inspecciones físicas (mínimo 5)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {premiumRequests.length < 5 ? (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Se requieren al menos 5 solicitudes Premium para crear un lote.
                    Actualmente hay {premiumRequests.length} solicitud{premiumRequests.length !== 1 ? 'es' : ''} pendiente{premiumRequests.length !== 1 ? 's' : ''}.
                  </AlertDescription>
                </Alert>
              ) : (
                <>
                  <div className="mb-4">
                    <Button onClick={() => setShowBatchDialog(true)}>
                      Crear Nuevo Lote ({premiumRequests.length} solicitudes disponibles)
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {premiumRequests.map((request) => (
                      <div key={request.id} className="border rounded p-3 text-sm">
                        <div className="font-medium">
                          {request.vehicle_brand} {request.vehicle_model} - {request.vehicle_plate}
                        </div>
                        <div className="text-gray-600">
                          {request.vehicle_location} | {request.profiles?.company_name}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalles de la Solicitud</DialogTitle>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <Label>Vehículo</Label>
                  <p className="font-medium">
                    {selectedRequest.vehicle_brand} {selectedRequest.vehicle_model} {selectedRequest.vehicle_year}
                  </p>
                </div>
                <div>
                  <Label>Matrícula</Label>
                  <p className="font-medium">{selectedRequest.vehicle_plate}</p>
                </div>
                <div>
                  <Label>Tipo de Informe</Label>
                  <p className="font-medium">{getReportTypeName(selectedRequest.report_type)}</p>
                </div>
                <div>
                  <Label>Estado</Label>
                  <div className="mt-1">{getStatusBadge(selectedRequest.status)}</div>
                </div>
              </div>

              {/* Budget Section */}
              {['pending', 'budgeted'].includes(selectedRequest.status) && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Establecer Presupuesto</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Precio Final (€)</Label>
                      <Input
                        type="number"
                        value={budgetAmount}
                        onChange={(e) => setBudgetAmount(e.target.value)}
                        placeholder="Precio final"
                      />
                    </div>
                    <div>
                      <Label>Notas del Administrador</Label>
                      <Textarea
                        value={adminNotes}
                        onChange={(e) => setAdminNotes(e.target.value)}
                        placeholder="Notas internas..."
                        rows={3}
                      />
                    </div>
                    <Button onClick={handleSetBudget} className="w-full">
                      Guardar Presupuesto
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Actions */}
              <div className="space-y-2">
                <Label>Acciones</Label>
                <div className="flex flex-wrap gap-2">
                  {selectedRequest.status === 'pending' && (
                    <Button
                      variant="outline"
                      onClick={() => updateRequestStatus(selectedRequest.id, 'in_process')}
                    >
                      Marcar En Proceso
                    </Button>
                  )}
                  {selectedRequest.status === 'budgeted' && (
                    <Button
                      variant="outline"
                      onClick={() => updateRequestStatus(selectedRequest.id, 'paid')}
                    >
                      Marcar como Pagado
                    </Button>
                  )}
                  {['paid', 'in_process'].includes(selectedRequest.status) && (
                    <Button
                      onClick={() => {
                        setShowDetailDialog(false);
                        setShowUploadDialog(true);
                      }}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Subir Informe
                    </Button>
                  )}
                  <Button
                    variant="destructive"
                    onClick={() => updateRequestStatus(selectedRequest.id, 'rejected')}
                  >
                    Rechazar
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Upload Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Subir Archivos del Informe</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Archivos (PDF, Audio, etc.)</Label>
              <Input
                type="file"
                multiple
                accept=".pdf,.mp3,.wav,.m4a"
                onChange={(e) => setUploadFiles(e.target.files)}
              />
              {uploadFiles && uploadFiles.length > 0 && (
                <div className="mt-2 text-sm text-gray-600">
                  {uploadFiles.length} archivo{uploadFiles.length !== 1 ? 's' : ''} seleccionado{uploadFiles.length !== 1 ? 's' : ''}
                  {Array.from(uploadFiles).map((file, i) => (
                    <div key={i} className="flex items-center justify-between py-1">
                      <span>{file.name}</span>
                      <span className="text-xs">{formatFileSize(file.size)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                El primer archivo será marcado como principal. Puedes subir PDFs y archivos de audio.
              </AlertDescription>
            </Alert>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUploadDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleFileUpload} disabled={uploading || !uploadFiles}>
              {uploading ? 'Subiendo...' : 'Subir Archivos'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Batch Creation Dialog */}
      <Dialog open={showBatchDialog} onOpenChange={setShowBatchDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crear Lote Premium</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Selecciona al menos 5 solicitudes Premium para crear un lote de inspección.
              </AlertDescription>
            </Alert>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {premiumRequests.map((request) => (
                <div
                  key={request.id}
                  className={`border rounded p-3 cursor-pointer transition-colors ${
                    selectedPremiumIds.includes(request.id) ? 'bg-blue-50 border-blue-500' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => {
                    setSelectedPremiumIds(prev =>
                      prev.includes(request.id)
                        ? prev.filter(id => id !== request.id)
                        : [...prev, request.id]
                    );
                  }}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedPremiumIds.includes(request.id)}
                      onChange={() => {}}
                      className="rounded"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-sm">
                        {request.vehicle_brand} {request.vehicle_model} - {request.vehicle_plate}
                      </div>
                      <div className="text-xs text-gray-600">
                        {request.vehicle_location}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-sm text-gray-600">
              {selectedPremiumIds.length} de {premiumRequests.length} seleccionadas
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowBatchDialog(false);
              setSelectedPremiumIds([]);
            }}>
              Cancelar
            </Button>
            <Button
              onClick={createPremiumBatch}
              disabled={selectedPremiumIds.length < 5}
            >
              Crear Lote ({selectedPremiumIds.length}/5 mínimo)
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VehicleReportsAdmin;