import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { X, Save, CheckCircle, XCircle, FileText, User, Building2, Phone, Mail, MapPin, Calendar, MessageSquare, RotateCcw, Eye, EyeOff } from 'lucide-react';
import { RegistrationRequest } from '@/hooks/useRegistrationRequests';
import ProfileCreationStatus from '@/components/registration/ProfileCreationStatus';
import CredentialsDisplay from './CredentialsDisplay';

interface RegistrationRequestDetailsProps {
  request: RegistrationRequest;
  adminNotes: string;
  isProcessing: boolean;
  createdCredentials?: {email: string, password: string, isExistingUser?: boolean} | null;
  onNotesChange: (notes: string) => void;
  onSaveNotes: () => void;
  onApprove: () => void;
  onReject: () => void;
  onResetToPending: () => void;
  onClose: () => void;
}

const RegistrationRequestDetails: React.FC<RegistrationRequestDetailsProps> = ({
  request,
  adminNotes,
  isProcessing,
  createdCredentials,
  onNotesChange,
  onSaveNotes,
  onApprove,
  onReject,
  onResetToPending,
  onClose,
}) => {
  const [showPassword, setShowPassword] = React.useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved': return 'Aprobado';
      case 'rejected': return 'Rechazado';
      case 'pending': return 'Pendiente';
      default: return status;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <Building2 className="h-6 w-6 text-blue-600" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {request.company_name}
              </h2>
              <p className="text-sm text-gray-500">
                Solicitud de registro #{request.id.substring(0, 8)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge className={getStatusColor(request.status)}>
              {getStatusText(request.status)}
            </Badge>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Show credentials if user was just created/updated */}
          {createdCredentials && (
            <div className="mb-6">
              <CredentialsDisplay 
                credentials={createdCredentials} 
                onClose={() => {}} 
              />
            </div>
          )}

          {/* Company Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Información de la Empresa
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">Nombre de la empresa</label>
                  <p className="text-sm text-gray-900">{request.company_name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Tipo de negocio</label>
                  <p className="text-sm text-gray-900">{request.business_type}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Tipo de comerciante</label>
                  <p className="text-sm text-gray-900">{request.trader_type}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    <MapPin className="h-4 w-4 inline mr-1" />
                    País
                  </label>
                  <p className="text-sm text-gray-900">{request.country}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Ciudad</label>
                  <p className="text-sm text-gray-900">{request.city}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Código postal</label>
                  <p className="text-sm text-gray-900">{request.postal_code}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Información de Contacto
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">Persona de contacto</label>
                  <p className="text-sm text-gray-900">{request.contact_person}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    <Mail className="h-4 w-4 inline mr-1" />
                    Email
                  </label>
                  <p className="text-sm text-gray-900">{request.email}</p>
                </div>
                {/* AGREGADO: Mostrar la contraseña elegida por el usuario */}
                {request.password && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Contraseña elegida</label>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-gray-900 font-mono bg-gray-50 px-2 py-1 rounded">
                        {showPassword ? request.password : '•'.repeat(request.password.length)}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    <Phone className="h-4 w-4 inline mr-1" />
                    Teléfono
                  </label>
                  <p className="text-sm text-gray-900">{request.phone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Nombre del gerente</label>
                  <p className="text-sm text-gray-900">{request.manager_name}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Information */}
          {request.description && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Descripción Adicional
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-900 whitespace-pre-wrap">{request.description}</p>
              </CardContent>
            </Card>
          )}

          {/* Documents */}
          {request.documents_paths && request.documents_paths.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Documentos Adjuntos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {request.documents_paths.map((docPath, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                      <FileText className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-700">{docPath}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Profile Creation Status */}
          <ProfileCreationStatus 
            registrationId={request.id} 
            status={request.status} 
          />

          {/* Admin Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Notas del Administrador
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={adminNotes}
                onChange={(e) => onNotesChange(e.target.value)}
                placeholder="Agregar notas internas..."
                rows={4}
                className="w-full"
              />
              <Button onClick={onSaveNotes} variant="outline" size="sm">
                <Save className="h-4 w-4 mr-2" />
                Guardar Notas
              </Button>
            </CardContent>
          </Card>

          {/* Metadata */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Creado: {new Date(request.created_at).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Actualizado: {new Date(request.updated_at).toLocaleDateString()}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between gap-3 p-6 border-t bg-gray-50">
          {/* Reset button for processed requests */}
          {request.status !== 'pending' && (
            <Button 
              onClick={onResetToPending} 
              variant="outline" 
              disabled={isProcessing}
              className="border-blue-300 text-blue-700 hover:bg-blue-50"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Volver a Pendiente
            </Button>
          )}
          
          {/* Action buttons for pending requests */}
          {request.status === 'pending' && (
            <div className="flex gap-3 ml-auto">
              <Button 
                onClick={onReject} 
                variant="outline" 
                disabled={isProcessing}
                className="border-red-300 text-red-700 hover:bg-red-50"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Rechazar
              </Button>
              <Button 
                onClick={onApprove} 
                disabled={isProcessing}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                {isProcessing ? 'Procesando...' : 'Aprobar'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegistrationRequestDetails;
