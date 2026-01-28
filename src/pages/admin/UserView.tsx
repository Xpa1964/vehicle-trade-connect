
import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, Mail, Phone, MapPin, Building, Calendar, BarChart3, RotateCcw } from 'lucide-react';
import { Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import StarRating from '@/components/ratings/StarRating';
import { useRatings } from '@/hooks/useRatings';
import { useAdminOperations } from '@/hooks/useAdminOperations';
import AdminEmailModal from '@/components/admin/AdminEmailModal';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface AdminUserDetail {
  id: string;
  email: string;
  full_name: string | null;
  company_name: string | null;
  contact_phone: string | null;
  country: string | null;
  address: string | null;
  business_type: string | null;
  trader_type: string | null;
  company_logo: string | null;
  total_operations: number;
  operations_breakdown: any;
  created_at: string;
  updated_at: string | null;
  registration_date: string | null;
  role: string;
}

const AdminUserView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { resetUserPassword, sendAdminEmail, isLoading: operationLoading } = useAdminOperations();
  
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);

  const { data: user, isLoading } = useQuery({
    queryKey: ['admin-user-detail', id],
    queryFn: async () => {
      if (!id) throw new Error('User ID is required');
      
      console.log('[AdminUserView] Fetching user detail for user:', id);
      
      // Obtener perfil del usuario con email incluido
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) {
        console.error('[AdminUserView] Error fetching profile:', error);
        throw error;
      }
      
      // Obtener rol del usuario
      const { data: userRole } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', id)
        .single();
      
      const userData = {
        ...profile,
        role: userRole?.role || 'user'
      } as AdminUserDetail;
      
      console.log('[AdminUserView] User data fetched successfully:', userData);
      return userData;
    },
    enabled: !!id
  });

  const { ratingSummary } = useRatings(id);

  const handleResetPassword = async () => {
    if (!user || !id) return;
    
    try {
      await resetUserPassword(id, user.email);
      setShowPasswordDialog(false);
    } catch (error) {
      console.error('Error resetting password:', error);
    }
  };

  const handleSendEmail = async (subject: string, message: string) => {
    if (!id) return;
    
    try {
      await sendAdminEmail(id, subject, message);
      setShowEmailModal(false);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge className="bg-red-500">Administrador</Badge>;
      case 'moderator':
        return <Badge className="bg-blue-500">Moderador</Badge>;
      case 'dealer':
        return <Badge className="bg-green-500">Distribuidor</Badge>;
      default:
        return <Badge>{role || 'Usuario'}</Badge>;
    }
  };

  const getBusinessTypeLabel = (businessType: string) => {
    const types: Record<string, string> = {
      'dealer': 'Concesionario',
      'multibrand_used': 'Multimarca VO',
      'buy_sell': 'Compraventa',
      'rent_a_car': 'Rent a Car',
      'renting': 'Renting',
      'workshop': 'Taller',
      'importer': 'Importador',
      'exporter': 'Exportador',
      'trader': 'Comerciante',
      'other': 'Otro'
    };
    return types[businessType] || businessType;
  };

  // Helper function to safely parse operations_breakdown
  const getOperationsBreakdown = (operationsData: any) => {
    if (!operationsData) {
      return { buys: 0, sells: 0, exchanges: 0 };
    }
    
    // If it's already an object, return it
    if (typeof operationsData === 'object' && operationsData !== null) {
      return {
        buys: operationsData.buys || 0,
        sells: operationsData.sells || 0,
        exchanges: operationsData.exchanges || 0
      };
    }
    
    // If it's a string, try to parse it
    if (typeof operationsData === 'string') {
      try {
        const parsed = JSON.parse(operationsData);
        return {
          buys: parsed.buys || 0,
          sells: parsed.sells || 0,
          exchanges: parsed.exchanges || 0
        };
      } catch {
        return { buys: 0, sells: 0, exchanges: 0 };
      }
    }
    
    return { buys: 0, sells: 0, exchanges: 0 };
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Usuario no encontrado</h1>
          <Link to="/admin/users">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a la lista
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const operationsBreakdown = getOperationsBreakdown(user.operations_breakdown);

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/admin/control-panel">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al Panel de Control
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">{user.full_name || 'Sin nombre'}</h1>
            <p className="text-gray-500">{user.company_name || 'Sin empresa'}</p>
          </div>
        </div>
        <Link to={`/admin/users/${id}/edit`}>
          <Button>
            <Edit className="h-4 w-4 mr-2" />
            Editar Usuario
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Información Principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Datos Personales */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building className="h-5 w-5 mr-2" />
                Información Personal y Empresa
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Nombre Completo</label>
                  <p className="text-sm">{user.full_name || 'No especificado'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p className="text-sm flex items-center">
                    <Mail className="h-4 w-4 mr-2" />
                    {user.email || 'No disponible'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Empresa</label>
                  <p className="text-sm">{user.company_name || 'No especificado'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Teléfono</label>
                  <p className="text-sm flex items-center">
                    {user.contact_phone ? (
                      <>
                        <Phone className="h-4 w-4 mr-2" />
                        {user.contact_phone}
                      </>
                    ) : (
                      'No especificado'
                    )}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">País</label>
                  <p className="text-sm flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    {user.country || 'No especificado'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Tipo de Negocio</label>
                  <p className="text-sm">{user.business_type ? getBusinessTypeLabel(user.business_type) : 'No especificado'}</p>
                </div>
              </div>
              
              {user.address && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Dirección</label>
                  <p className="text-sm">{user.address}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Estadísticas de Operaciones */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Estadísticas de Operaciones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{user.total_operations || 0}</p>
                  <p className="text-sm text-gray-500">Total</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{operationsBreakdown.sells}</p>
                  <p className="text-sm text-gray-500">Ventas</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-600">{operationsBreakdown.buys}</p>
                  <p className="text-sm text-gray-500">Compras</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Estado y Rol */}
          <Card>
            <CardHeader>
              <CardTitle>Estado y Permisos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Rol</label>
                <div className="mt-1">
                  {getRoleBadge(user.role)}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Estado</label>
                <div className="mt-1">
                  <Badge className="bg-green-500">Activo</Badge>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Fecha de Registro</label>
                <p className="text-sm flex items-center mt-1">
                  <Calendar className="h-4 w-4 mr-2" />
                  {user.created_at ? format(new Date(user.created_at), 'dd/MM/yyyy') : 'No disponible'}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Valoraciones */}
          <Card>
            <CardHeader>
              <CardTitle>Valoraciones</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <StarRating rating={ratingSummary?.average_rating || 0} size={20} />
                <p className="text-sm text-gray-500 mt-2">
                  {ratingSummary?.total_ratings || 0} valoraciones
                </p>
                {ratingSummary?.verified_ratings ? (
                  <p className="text-xs text-green-600">
                    {ratingSummary.verified_ratings} verificadas
                  </p>
                ) : null}
              </div>
            </CardContent>
          </Card>

          {/* Acciones Rápidas */}
          <Card>
            <CardHeader>
              <CardTitle>Acciones</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full" 
                size="sm"
                onClick={() => setShowEmailModal(true)}
                disabled={operationLoading}
              >
                {operationLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Mail className="h-4 w-4 mr-2" />
                )}
                Enviar Email
              </Button>
              <Button 
                variant="outline" 
                className="w-full" 
                size="sm"
                onClick={() => setShowPasswordDialog(true)}
                disabled={operationLoading}
              >
                {operationLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <RotateCcw className="h-4 w-4 mr-2" />
                )}
                Resetear Contraseña
              </Button>
              <Link to={`/user/${id}`} className="w-full">
                <Button variant="outline" className="w-full" size="sm">
                  Ver Perfil Público
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Email Modal */}
      <AdminEmailModal
        isOpen={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        onSend={handleSendEmail}
        userEmail={user.email || ''}
        userName={user.full_name || user.company_name || 'Usuario'}
        isLoading={operationLoading}
      />

      {/* Password Reset Confirmation Dialog */}
      <AlertDialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Restablecimiento de Contraseña</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Está seguro de que desea restablecer la contraseña para <strong>{user.full_name || user.company_name}</strong>?
              <br />
              <span className="text-sm text-gray-600">({user.email || 'Sin email'})</span>
              <br /><br />
              Se generará un enlace de restablecimiento que se enviará al usuario.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={operationLoading}>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleResetPassword}
              disabled={operationLoading}
            >
              {operationLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Procesando...
                </>
              ) : (
                'Confirmar Restablecimiento'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminUserView;
