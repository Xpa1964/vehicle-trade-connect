
import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRegistrationRequests } from '@/hooks/useRegistrationRequests';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { Calendar, ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useRegistrationRequestOperations } from '@/hooks/useRegistrationRequestOperations';
import RegistrationRequestDetails from '@/components/admin/RegistrationRequestDetails';

const RegistrationRequests: React.FC = () => {
  const { user, hasPermission } = useAuth();
  const { 
    requests, 
    isLoading, 
    error, 
    refetch 
  } = useRegistrationRequests();
  
  const {
    selectedRequest,
    adminNotes,
    isProcessing,
    createdCredentials,
    setAdminNotes,
    setSelectedRequest,
    handleOpenDetails,
    handleSaveNotes,
    handleStatusUpdate,
    handleResetToPending
  } = useRegistrationRequestOperations(refetch);

  const { t } = useLanguage();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) return;

    if (!hasPermission('users.view')) {
      toast({
        title: "Acceso denegado",
        description: "No tienes permiso para ver las solicitudes de registro",
        variant: "destructive"
      });
    }
  }, [user, hasPermission, toast]);

  if (!hasPermission('users.view')) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Acceso Denegado</h1>
          <p className="text-gray-600">No tienes permiso para ver esta página.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Cargando Solicitudes de Registro...</h1>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Error al Cargar Solicitudes de Registro</h1>
          <p className="text-red-600">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => window.location.href = '/admin/control-panel'}
        className="mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Volver al Panel de Control
      </Button>

      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-3xl font-bold">{t('admin.registrationRequests')}</h1>
        <Button onClick={() => refetch()}>
          {t('common.refresh')}
        </Button>
      </div>

      {selectedRequest && (
        <RegistrationRequestDetails
          request={selectedRequest}
          adminNotes={adminNotes}
          isProcessing={isProcessing}
          createdCredentials={createdCredentials}
          onNotesChange={setAdminNotes}
          onSaveNotes={handleSaveNotes}
          onApprove={() => handleStatusUpdate(selectedRequest.id, 'approved')}
          onReject={() => handleStatusUpdate(selectedRequest.id, 'rejected')}
          onResetToPending={handleResetToPending}
          onClose={() => {
            setSelectedRequest(null);
          }}
        />
      )}

      <div className="rounded-md border">
        <Table>
          <TableCaption>Solicitudes de registro de empresas para Kontact VO.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[150px]">Empresa</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Contacto</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead className="text-right">Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests?.map((request) => (
              <TableRow key={request.id} onClick={() => handleOpenDetails(request)} className="cursor-pointer hover:bg-gray-50">
                <TableCell className="font-medium">{request.company_name}</TableCell>
                <TableCell>{request.email}</TableCell>
                <TableCell>{request.contact_person}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 opacity-70" />
                    <span>{new Date(request.created_at).toLocaleDateString()}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Badge variant="secondary">{request.status}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                {requests?.length || 0} resultados totales
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  );
};

export default RegistrationRequests;
