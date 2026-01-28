import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import BudgetFormCard from './BudgetFormCard';
import { 
  Clock, 
  CheckCircle, 
  FileUp, 
  Car, 
  User, 
  Mail, 
  Phone, 
  Calendar,
  DollarSign,
  CreditCard,
  PlayCircle,
  Send,
  X,
  FileText,
  Image as ImageIcon,
  Music,
  AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface UploadFile {
  id: string;
  file: File;
  category: 'main_report' | 'audio' | 'photo' | 'supplementary';
  progress: number;
  uploaded: boolean;
}

interface ReportProcessCardProps {
  request: any;
  onUpdate: () => void;
}

const ReportProcessCard: React.FC<ReportProcessCardProps> = ({ request, onUpdate }) => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [notes, setNotes] = useState(request.admin_notes || '');
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);
  const [newFileCategory, setNewFileCategory] = useState<'main_report' | 'audio' | 'photo' | 'supplementary'>('main_report');

  const handleStartProcessing = async () => {
    setIsProcessing(true);
    try {
      const { error } = await (supabase as any)
        .from('vehicle_report_requests')
        .update({
          status: 'in_process',
          admin_notes: notes,
          updated_at: new Date().toISOString(),
        })
        .eq('id', request.id);

      if (error) throw error;

      // Notify user
      await (supabase as any).rpc('create_system_notification', {
        p_user_id: request.user_id,
        p_subject: 'Informe en Proceso',
        p_content: `Tu solicitud de informe ${request.report_type} para el vehículo ${request.vehicle_plate} está siendo procesada. Te notificaremos cuando esté listo.`,
        p_type: 'info',
      });

      toast({
        title: 'Proceso iniciado',
        description: 'El informe ha sido marcado como en proceso',
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

  const handleAddFile = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const newFiles: UploadFile[] = Array.from(files).map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      category: newFileCategory,
      progress: 0,
      uploaded: false
    }));

    setUploadFiles(prev => [...prev, ...newFiles]);
  };

  const handleRemoveFile = (fileId: string) => {
    setUploadFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const getCategoryLabel = (category: string) => {
    const labels = {
      main_report: 'Informe Principal',
      audio: 'Audio',
      photo: 'Foto',
      supplementary: 'Suplementario'
    };
    return labels[category as keyof typeof labels] || category;
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      main_report: FileText,
      audio: Music,
      photo: ImageIcon,
      supplementary: FileUp
    };
    const Icon = icons[category as keyof typeof icons] || FileText;
    return <Icon className="h-4 w-4" />;
  };

  const handleCompleteReport = async () => {
    const mainReport = uploadFiles.find(f => f.category === 'main_report');
    if (!mainReport) {
      toast({
        title: 'Archivo requerido',
        description: 'Debes subir al menos el informe principal (PDF)',
        variant: 'destructive',
      });
      return;
    }

    setIsProcessing(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No autenticado');

      // Upload all files
      for (const uploadFile of uploadFiles) {
        const fileExt = uploadFile.file.name.split('.').pop();
        const fileName = `${request.id}-${uploadFile.category}-${Date.now()}.${fileExt}`;
        const filePath = `${request.user_id}/${fileName}`;

        // Simulate progress
        setUploadFiles(prev => prev.map(f => 
          f.id === uploadFile.id ? { ...f, progress: 50 } : f
        ));

        const { error: uploadError } = await supabase.storage
          .from('vehicle-reports')
          .upload(filePath, uploadFile.file);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('vehicle-reports')
          .getPublicUrl(filePath);

        // Create delivery record
        const { error: deliveryError } = await (supabase as any)
          .from('vehicle_report_deliveries')
          .insert({
            request_id: request.id,
            file_name: uploadFile.file.name,
            file_type: uploadFile.file.type,
            file_url: publicUrl,
            file_size: uploadFile.file.size,
            file_category: uploadFile.category,
            uploaded_by: user.id,
            is_primary: uploadFile.category === 'main_report',
          });

        if (deliveryError) throw deliveryError;

        // Mark as uploaded
        setUploadFiles(prev => prev.map(f => 
          f.id === uploadFile.id ? { ...f, progress: 100, uploaded: true } : f
        ));
      }

      // Update request status
      const { error: updateError } = await (supabase as any)
        .from('vehicle_report_requests')
        .update({
          status: 'delivered',
          admin_notes: notes,
          updated_at: new Date().toISOString(),
        })
        .eq('id', request.id);

      if (updateError) throw updateError;

      // Notify user
      await (supabase as any).rpc('create_system_notification', {
        p_user_id: request.user_id,
        p_subject: 'Informe Disponible',
        p_content: `¡Tu informe ${request.report_type} para el vehículo ${request.vehicle_plate} ya está disponible! Incluye ${uploadFiles.length} archivo(s). Puedes descargarlo desde la sección de Informes Vehiculares.`,
        p_type: 'success',
      });

      toast({
        title: 'Informe entregado',
        description: `${uploadFiles.length} archivo(s) subido(s) y el usuario ha sido notificado`,
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
    const statusConfig: Record<string, { label: string; variant: any; icon: any; className?: string }> = {
      pending: { label: 'Pendiente', variant: 'secondary' as const, icon: Clock },
      budgeted: { label: 'Presupuestado', variant: 'outline' as const, icon: DollarSign, className: 'border-amber-500 text-amber-600' },
      budget_accepted: { label: 'Presupuesto Aceptado', variant: 'outline' as const, icon: CheckCircle, className: 'border-green-500 text-green-600' },
      budget_rejected: { label: 'Presupuesto Rechazado', variant: 'outline' as const, icon: X, className: 'border-red-500 text-red-600' },
      in_process: { label: 'En Proceso', variant: 'default' as const, icon: Clock },
      delivered: { label: 'Entregado', variant: 'default' as const, icon: CheckCircle },
    };
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <Badge variant={config.variant} className={`gap-1 ${config.className || ''}`}>
        <config.icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Car className="h-5 w-5 text-muted-foreground" />
              <h3 className="font-semibold text-lg">
                {request.vehicle_brand} {request.vehicle_model} ({request.vehicle_year})
              </h3>
              {getStatusBadge(request.status)}
            </div>
            <p className="text-sm text-muted-foreground">
              Matrícula: <span className="font-medium">{request.vehicle_plate}</span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Tipo de Informe</p>
            <p className="text-lg font-bold capitalize">{request.report_type}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Client Info */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Cliente</p>
              <p className="text-sm font-medium">
                {request.profiles?.company_name || request.profiles?.full_name}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Email</p>
              <p className="text-sm font-medium">{request.profiles?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Teléfono</p>
              <p className="text-sm font-medium">{request.profiles?.contact_phone || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Vehicle Location */}
        {request.vehicle_location && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-600 mb-1">Ubicación del Vehículo</p>
            <p className="text-sm font-medium text-blue-700">{request.vehicle_location}</p>
          </div>
        )}

        {/* Observations */}
        {request.observations && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-xs text-yellow-600 mb-1">Observaciones del Cliente</p>
            <p className="text-sm text-yellow-700">{request.observations}</p>
          </div>
        )}

        {/* Budget Form - Only for Premium pending requests */}
        {request.status === 'pending' && request.report_type === 'premium' && (
          <div className="space-y-4">
            <Separator />
            <BudgetFormCard requestId={request.id} onBudgetSent={onUpdate} />
          </div>
        )}

        {/* Budget Display - For budgeted status */}
        {request.status === 'budgeted' && request.budget_amount && (
          <div className="space-y-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-amber-600" />
              <h4 className="font-semibold text-amber-800">Presupuesto Enviado</h4>
            </div>
            <div className="space-y-2">
              {request.budget_breakdown && Array.isArray(request.budget_breakdown) && request.budget_breakdown.length > 0 && (
                <div className="space-y-1">
                  {request.budget_breakdown.map((item: any) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>{item.concept}</span>
                      <span className="font-medium">€{Number(item.amount).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              )}
              <Separator />
              <div className="flex justify-between items-center font-bold text-lg text-amber-800">
                <span>Total:</span>
                <span>€{Number(request.budget_amount).toFixed(2)}</span>
              </div>
              {request.estimated_delivery_date && (
                <div className="flex items-center gap-2 text-sm text-amber-700 mt-2">
                  <Calendar className="h-4 w-4" />
                  <span>Entrega estimada: {format(new Date(request.estimated_delivery_date), 'PPP', { locale: es })}</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-amber-700 bg-amber-100 p-2 rounded">
              <AlertCircle className="h-4 w-4" />
              <span>Esperando respuesta del usuario</span>
            </div>
          </div>
        )}

        {/* Budget Accepted - Ready to process */}
        {request.status === 'budget_accepted' && request.budget_amount && (
          <div className="space-y-3 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <h4 className="font-semibold text-green-800">Presupuesto Aceptado</h4>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-green-700">Monto aprobado:</span>
              <span className="font-bold text-lg text-green-800">€{Number(request.budget_amount).toFixed(2)}</span>
            </div>
            {request.estimated_delivery_date && (
              <div className="flex items-center gap-2 text-sm text-green-700">
                <Calendar className="h-4 w-4" />
                <span>Entrega estimada: {format(new Date(request.estimated_delivery_date), 'PPP', { locale: es })}</span>
              </div>
            )}
          </div>
        )}

        {/* Admin Notes */}
        {request.status !== 'pending' && (
          <div>
            <Label htmlFor="notes" className="text-sm font-medium mb-2 block">
              Notas del Administrador
            </Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Añade notas sobre el proceso del informe..."
              className="min-h-[80px]"
              disabled={request.status === 'delivered'}
            />
          </div>
        )}

        {/* Upload Files (only for in_process) */}
        {request.status === 'in_process' && (
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium mb-2 block">
                Subir Archivos del Informe
              </Label>
              
              <div className="flex gap-2 mb-3">
                <Select value={newFileCategory} onValueChange={(value: any) => setNewFileCategory(value)}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="main_report">Informe Principal (PDF)</SelectItem>
                    <SelectItem value="audio">Audio de Inspección</SelectItem>
                    <SelectItem value="photo">Fotos Adicionales</SelectItem>
                    <SelectItem value="supplementary">Archivo Suplementario</SelectItem>
                  </SelectContent>
                </Select>
                
                <div className="flex-1">
                  <Input
                    type="file"
                    onChange={(e) => handleAddFile(e.target.files)}
                    disabled={isProcessing}
                    multiple
                    accept={newFileCategory === 'main_report' ? '.pdf' : 
                            newFileCategory === 'audio' ? 'audio/*' : 
                            newFileCategory === 'photo' ? 'image/*' : '*'}
                  />
                </div>
              </div>

              {/* File List */}
              {uploadFiles.length > 0 && (
                <div className="space-y-2 mt-3">
                  {uploadFiles.map((uploadFile) => (
                    <div key={uploadFile.id} className="flex items-center gap-3 p-3 border rounded-lg bg-muted/30">
                      <div className="flex items-center gap-2 flex-1">
                        {getCategoryIcon(uploadFile.category)}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{uploadFile.file.name}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Badge variant="outline" className="text-xs">
                              {getCategoryLabel(uploadFile.category)}
                            </Badge>
                            <span>
                              {(uploadFile.file.size / 1024 / 1024).toFixed(2)} MB
                            </span>
                          </div>
                          {uploadFile.progress > 0 && uploadFile.progress < 100 && (
                            <Progress value={uploadFile.progress} className="mt-2 h-1" />
                          )}
                        </div>
                      </div>
                      {uploadFile.uploaded ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveFile(uploadFile.id)}
                          disabled={isProcessing}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {uploadFiles.length > 0 && (
                <p className="text-xs text-muted-foreground mt-2">
                  {uploadFiles.filter(f => f.category === 'main_report').length > 0 ? (
                    <span className="text-green-600">✓ Informe principal incluido</span>
                  ) : (
                    <span className="text-orange-600">⚠ Debes incluir al menos el informe principal</span>
                  )}
                  {' · '} Total: {uploadFiles.length} archivo(s)
                </p>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          {/* For pending basic/technical reports - direct processing */}
          {request.status === 'pending' && request.report_type !== 'premium' && (
            <Button
              onClick={handleStartProcessing}
              disabled={isProcessing}
              className="flex-1"
            >
              <PlayCircle className="h-4 w-4 mr-2" />
              Iniciar Proceso
            </Button>
          )}

          {/* For budget_accepted premium reports - start processing */}
          {request.status === 'budget_accepted' && (
            <Button
              onClick={handleStartProcessing}
              disabled={isProcessing}
              className="flex-1"
            >
              <PlayCircle className="h-4 w-4 mr-2" />
              Iniciar Proceso
            </Button>
          )}

          {request.status === 'in_process' && (
            <Button
              onClick={handleCompleteReport}
              disabled={isProcessing || uploadFiles.filter(f => f.category === 'main_report').length === 0}
              className="flex-1"
            >
              <Send className="h-4 w-4 mr-2" />
              {isProcessing ? 'Subiendo archivos...' : `Completar y Entregar (${uploadFiles.length} archivo${uploadFiles.length !== 1 ? 's' : ''})`}
            </Button>
          )}
          {request.status === 'delivered' && (
            <div className="flex-1 text-center py-2 px-4 bg-green-50 text-green-700 rounded-md">
              <CheckCircle className="h-4 w-4 inline mr-2" />
              Informe entregado al cliente
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportProcessCard;
