
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Car, Loader2, Eye, Edit, Trash2, Plus, Search, Filter } from 'lucide-react';
import PageHeader from '@/components/layout/PageHeader';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from 'date-fns';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useLanguage } from '@/contexts/LanguageContext';

const AdminVehicles = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const itemsPerPage = 20;

  // Fetch vehicles with pagination and filters
  const { data: vehiclesData, isLoading, error } = useQuery({
    queryKey: ['admin-vehicles', page, searchTerm, statusFilter],
    queryFn: async () => {
      console.log('Fetching vehicles for admin panel...');
      
      let query = supabase
        .from('vehicles')
        .select(`
          id,
          brand,
          model,
          year,
          price,
          mileage,
          fuel,
          transmission,
          status,
          country,
          location,
          thumbnailurl,
          created_at,
          updated_at,
          user_id
        `)
        .order('created_at', { ascending: false });

      // Apply search filter
      if (searchTerm) {
        query = query.or(`brand.ilike.%${searchTerm}%,model.ilike.%${searchTerm}%,location.ilike.%${searchTerm}%`);
      }

      // Apply status filter
      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      // Apply pagination
      const from = (page - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;
      query = query.range(from, to);

      const { data, error, count } = await supabase
        .from('vehicles')
        .select('*', { count: 'exact', head: true });

      if (error) {
        console.error('Error fetching vehicles count:', error);
        throw error;
      }

      const { data: vehicles, error: vehiclesError } = await query;
      
      if (vehiclesError) {
        console.error('Error fetching vehicles:', vehiclesError);
        throw vehiclesError;
      }

      // Fetch profiles separately to avoid relation issues
      const vehicleIds = vehicles?.map(v => v.user_id).filter(Boolean) || [];
      let profilesData = [];
      
      if (vehicleIds.length > 0) {
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, full_name, company_name')
          .in('id', vehicleIds);
          
        if (profilesError) {
          console.error('Error fetching profiles:', profilesError);
        } else {
          profilesData = profiles || [];
        }
      }

      // Merge vehicle and profile data
      const vehiclesWithProfiles = vehicles?.map(vehicle => ({
        ...vehicle,
        profile: profilesData.find(p => p.id === vehicle.user_id)
      })) || [];

      console.log(`Successfully fetched ${vehiclesWithProfiles?.length || 0} vehicles`);
      return {
        vehicles: vehiclesWithProfiles,
        totalCount: count || 0
      };
    }
  });

  // Delete vehicle mutation
  const deleteVehicleMutation = useMutation({
    mutationFn: async (vehicleId: string) => {
      console.log(`Admin deleting vehicle: ${vehicleId}`);
      
      // Delete related records first
      await supabase.from('vehicle_images').delete().eq('vehicle_id', vehicleId);
      await supabase.from('vehicle_equipment').delete().eq('vehicle_id', vehicleId);
      await supabase.from('vehicle_documents').delete().eq('vehicle_id', vehicleId);
      await supabase.from('vehicle_information').delete().eq('vehicle_id', vehicleId);
      await supabase.from('vehicle_metadata').delete().eq('vehicle_id', vehicleId);
      
      // Delete the vehicle
      const { error } = await supabase
        .from('vehicles')
        .delete()
        .eq('id', vehicleId);
      
      if (error) throw error;
      
      return vehicleId;
    },
    onSuccess: (vehicleId) => {
      console.log(`Vehicle ${vehicleId} deleted successfully`);
      toast.success('Vehículo eliminado correctamente');
      queryClient.invalidateQueries({ queryKey: ['admin-vehicles'] });
    },
    onError: (error) => {
      console.error('Error deleting vehicle:', error);
      toast.error('Error al eliminar el vehículo');
    }
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <Badge className="bg-green-500">Disponible</Badge>;
      case 'reserved':
        return <Badge className="bg-amber-500">Reservado</Badge>;
      case 'sold':
        return <Badge className="bg-blue-500">Vendido</Badge>;
      case 'in_auction':
        return <Badge className="bg-purple-500">En Subasta</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleViewVehicle = (vehicleId: string) => {
    navigate(`/vehicle-preview/${vehicleId}`);
  };

  const handleEditVehicle = (vehicleId: string) => {
    navigate(`/upload-vehicle/${vehicleId}`);
  };

  const handleDeleteVehicle = (vehicleId: string) => {
    deleteVehicleMutation.mutate(vehicleId);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-8">
          <p className="text-red-600">Error al cargar los vehículos: {error.message}</p>
          <Button onClick={() => queryClient.invalidateQueries({ queryKey: ['admin-vehicles'] })} className="mt-4">
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  const { vehicles = [], totalCount = 0 } = vehiclesData || {};
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  return (
    <div className="container mx-auto p-6">
      <PageHeader 
        title="Gestión de Vehículos" 
        subtitle={`Administra los ${totalCount} vehículos disponibles en la plataforma`}
        showBackButton={true}
        backTo="/admin/control-panel"
        backText="Volver al Panel de Control"
      />
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar por marca, modelo o ubicación..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[200px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filtrar por estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            <SelectItem value="available">Disponible</SelectItem>
            <SelectItem value="reserved">Reservado</SelectItem>
            <SelectItem value="sold">Vendido</SelectItem>
            <SelectItem value="in_auction">En Subasta</SelectItem>
          </SelectContent>
        </Select>
        
        <Button 
          variant="default" 
          className="flex items-center gap-2"
          onClick={() => navigate('/upload-vehicle')}
        >
          <Plus className="h-4 w-4" />
          Añadir Vehículo
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('common.image', { fallback: 'Imagen' })}</TableHead>
              <TableHead>{t('vehicles.vehicle', { fallback: 'Vehículo' })}</TableHead>
              <TableHead>{t('vehicles.price', { fallback: 'Precio' })}</TableHead>
              <TableHead>{t('vehicles.status', { fallback: 'Estado' })}</TableHead>
              <TableHead>{t('vehicles.location', { fallback: 'Ubicación' })}</TableHead>
              <TableHead>{t('common.owner', { fallback: 'Propietario' })}</TableHead>
              <TableHead>{t('vehicles.date', { fallback: 'Fecha' })}</TableHead>
              <TableHead>{t('vehicles.actions', { fallback: 'Acciones' })}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vehicles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  {t('vehicles.noVehicles', { fallback: 'No hay vehículos disponibles' })}
                </TableCell>
              </TableRow>
            ) : (
              vehicles.map((vehicle) => (
                <TableRow key={vehicle.id}>
                  <TableCell>
                    <img 
                      src={vehicle.thumbnailurl || '/placeholder.svg'} 
                      alt={`${vehicle.brand} ${vehicle.model}`}
                      className="w-16 h-12 object-cover rounded"
                    />
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{vehicle.brand} {vehicle.model}</div>
                      <div className="text-sm text-gray-500">{vehicle.year}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {vehicle.price ? `€${vehicle.price.toLocaleString()}` : t('vehicles.priceOnRequest', { fallback: 'Consultar' })}
                  </TableCell>
                  <TableCell>{getStatusBadge(vehicle.status)}</TableCell>
                  <TableCell>
                    <div>
                      <div>{vehicle.location || t('common.notAvailable')}</div>
                      <div className="text-sm text-gray-500">{vehicle.country}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{vehicle.profile?.full_name || vehicle.profile?.company_name || t('common.notAvailable')}</div>
                      <div className="text-gray-500 font-mono">{vehicle.user_id?.substring(0, 8)}...</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {vehicle.created_at ? format(new Date(vehicle.created_at), 'dd/MM/yyyy') : t('common.notAvailable')}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleViewVehicle(vehicle.id)}
                        title="Ver detalles"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleEditVehicle(vehicle.id)}
                        title="Editar vehículo"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="text-red-600 hover:text-red-700"
                            title="Eliminar vehículo"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>¿Eliminar vehículo?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta acción no se puede deshacer. Se eliminará permanentemente el vehículo 
                              {vehicle.brand} {vehicle.model} {vehicle.year} y todos sus datos asociados.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDeleteVehicle(vehicle.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Eliminar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <Button 
            variant="outline" 
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Anterior
          </Button>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              Página {page} de {totalPages}
            </span>
          </div>
          
          <Button 
            variant="outline" 
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Siguiente
          </Button>
        </div>
      )}
    </div>
  );
};

export default AdminVehicles;
