

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { ArrowLeft, Save, Loader2, Shield, User } from 'lucide-react';
import { useAdminUserEdit } from '@/hooks/useAdminUserEdit';
import { AppRole } from '@/types/auth';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';

interface AdminUserEditFormProps {
  userId: string;
}

interface UserProfileForm {
  full_name: string;
  company_name: string;
  contact_phone: string;
  country: string;
  address: string;
  business_type: string;
  trader_type: string;
}

interface UserRoleForm {
  role: AppRole;
}

const AdminUserEditForm: React.FC<AdminUserEditFormProps> = ({ userId }) => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { refreshUser } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('profile');
  const { updateProfile, updateRole, isUpdating } = useAdminUserEdit();

  const { data: userData, isLoading, refetch } = useQuery({
    queryKey: ['admin-user-edit', userId],
    queryFn: async () => {
      console.log('[AdminUserEditForm] Fetching user data for editing:', userId);
      
      // Get profile data
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (profileError) {
        console.error('[AdminUserEditForm] Error fetching profile:', profileError);
        throw profileError;
      }
      
      // Get user email
      const { data: authUser } = await supabase.auth.admin.getUserById(userId);
      
      // Get user role
      const { data: userRole } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single();
      
      const result = {
        profile,
        email: authUser?.user?.email || 'No disponible',
        role: userRole?.role || 'user'
      };
      
      console.log('[AdminUserEditForm] User data fetched:', result);
      return result;
    },
    enabled: !!userId
  });

  const profileForm = useForm<UserProfileForm>({
    defaultValues: {
      full_name: userData?.profile?.full_name || '',
      company_name: userData?.profile?.company_name || '',
      contact_phone: userData?.profile?.contact_phone || '',
      country: userData?.profile?.country || '',
      address: userData?.profile?.address || '',
      business_type: userData?.profile?.business_type || '',
      trader_type: userData?.profile?.trader_type || ''
    }
  });

  const roleForm = useForm<UserRoleForm>({
    defaultValues: {
      role: (userData?.role as AppRole) || 'user'
    }
  });

  // Update form values when data loads
  React.useEffect(() => {
    if (userData) {
      profileForm.reset({
        full_name: userData.profile?.full_name || '',
        company_name: userData.profile?.company_name || '',
        contact_phone: userData.profile?.contact_phone || '',
        country: userData.profile?.country || '',
        address: userData.profile?.address || '',
        business_type: userData.profile?.business_type || '',
        trader_type: userData.profile?.trader_type || ''
      });
      
      roleForm.reset({
        role: (userData.role as AppRole) || 'user'
      });
    }
  }, [userData, profileForm, roleForm]);

  const onProfileSubmit = async (data: UserProfileForm) => {
    try {
      await updateProfile(userId, data);
      await refreshUser(); // Refresh user data in AuthContext
      toast.success('Perfil actualizado correctamente');
      refetch();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Error al actualizar el perfil');
    }
  };

  const onRoleSubmit = async (data: UserRoleForm) => {
    try {
      await updateRole(userId, data.role);
      toast.success('Rol actualizado correctamente');
      refetch();
    } catch (error) {
      console.error('Error updating role:', error);
      toast.error('Error al actualizar el rol');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold mb-2">Usuario no encontrado</h2>
        <Link to="/admin/users">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a la lista
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with user info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link to="/admin/users">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">{userData.profile?.full_name || 'Sin nombre'}</h1>
            <p className="text-gray-500">{userData.email}</p>
          </div>
        </div>
        <Link to={`/admin/users/${userId}/view`}>
          <Button variant="outline">
            Ver Perfil Completo
          </Button>
        </Link>
      </div>

      {/* Tabs for different sections */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Información Personal
          </TabsTrigger>
          <TabsTrigger value="role" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Roles y Permisos
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Información Personal y Empresarial</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Nombre Completo</Label>
                    <Input
                      id="full_name"
                      {...profileForm.register('full_name', { required: 'El nombre es requerido' })}
                    />
                    {profileForm.formState.errors.full_name && (
                      <p className="text-sm text-red-600">{profileForm.formState.errors.full_name.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company_name">Nombre de la Empresa</Label>
                    <Input
                      id="company_name"
                      {...profileForm.register('company_name')}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contact_phone">Teléfono de Contacto</Label>
                    <Input
                      id="contact_phone"
                      type="tel"
                      {...profileForm.register('contact_phone')}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country">País</Label>
                    <Input
                      id="country"
                      {...profileForm.register('country')}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="business_type">Tipo de Negocio</Label>
                    <Select onValueChange={(value) => profileForm.setValue('business_type', value)} defaultValue={userData.profile?.business_type}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona el tipo de negocio" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dealer">Concesionario</SelectItem>
                        <SelectItem value="multibrand_used">Multimarca VO</SelectItem>
                        <SelectItem value="buy_sell">Compraventa</SelectItem>
                        <SelectItem value="rent_a_car">Rent a Car</SelectItem>
                        <SelectItem value="renting">Renting</SelectItem>
                        <SelectItem value="workshop">Taller</SelectItem>
                        <SelectItem value="importer">Importador</SelectItem>
                        <SelectItem value="exporter">Exportador</SelectItem>
                        <SelectItem value="trader">Comerciante</SelectItem>
                        <SelectItem value="other">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="trader_type">Tipo de Comerciante</Label>
                    <Select onValueChange={(value) => profileForm.setValue('trader_type', value)} defaultValue={userData.profile?.trader_type}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona el tipo de comerciante" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="buyer">{t('auth.register.buyer')}</SelectItem>
                        <SelectItem value="seller">{t('auth.register.seller')}</SelectItem>
                        <SelectItem value="trader">{t('auth.register.trader')}</SelectItem>
                        <SelectItem value="buyer_seller">{t('auth.register.buyerSeller')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Dirección</Label>
                  <Input
                    id="address"
                    {...profileForm.register('address')}
                    placeholder="Dirección completa"
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button type="submit" disabled={isUpdating}>
                    {isUpdating ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    Guardar Cambios
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Role Tab */}
        <TabsContent value="role">
          <Card>
            <CardHeader>
              <CardTitle>Gestión de Roles y Permisos</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={roleForm.handleSubmit(onRoleSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="role">Rol del Usuario</Label>
                  <Select onValueChange={(value) => roleForm.setValue('role', value as AppRole)} defaultValue={userData.role}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un rol" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">Usuario</SelectItem>
                      <SelectItem value="dealer">Distribuidor</SelectItem>
                      <SelectItem value="moderator">Moderador</SelectItem>
                      <SelectItem value="admin">Administrador</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-gray-500">
                    Los cambios de rol se aplicarán inmediatamente y afectarán los permisos del usuario.
                  </p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Permisos por Rol:</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li><strong>Usuario:</strong> Acceso básico a la plataforma</li>
                    <li><strong>Distribuidor:</strong> Gestión de vehículos y ventas</li>
                    <li><strong>Moderador:</strong> Gestión de contenido y usuarios básicos</li>
                    <li><strong>Administrador:</strong> Acceso completo al sistema</li>
                  </ul>
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button type="submit" disabled={isUpdating} variant="default">
                    {isUpdating ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Shield className="h-4 w-4 mr-2" />
                    )}
                    Actualizar Rol
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminUserEditForm;
