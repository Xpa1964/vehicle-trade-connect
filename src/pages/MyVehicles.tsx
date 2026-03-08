
import React, { useState, useMemo, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Vehicle } from '@/types/vehicle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Loader2, Search, Plus, ArrowLeft, Filter, Car, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import VehicleCard from '@/components/vehicles/VehicleCard';
import VehicleEmpty from '@/components/vehicles/VehicleEmpty';
import { VehicleStatusActions } from '@/components/vehicles/VehicleStatusActions';
import { useVehicleStatusChange } from '@/hooks/useVehicleStatusChange';

const MyVehicles: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<string>('newest');
  const { markVehicleStatus } = useVehicleStatusChange();

  const { data: vehicles, isLoading, error } = useQuery({
    queryKey: ['my-vehicles', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        toast.error(t('common.error'));
        throw error;
      }

      const mappedVehicles: Vehicle[] = data.map(vehicle => ({
        ...vehicle,
        countryCode: vehicle.country_code || 'es',
        thumbnailUrl: vehicle.thumbnailurl,
        userId: vehicle.user_id
      }));

      return mappedVehicles;
    },
    enabled: !!user,
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });

  const handleEditVehicle = useCallback((id: string) => {
    navigate(`/vehicle/${id}/edit`);
  }, [navigate]);

  // Memoized filtered vehicles
  const filteredVehicles = useMemo(() => {
    if (!vehicles) return [];

    return vehicles
      .filter(vehicle => {
        if (statusFilter !== 'all' && vehicle.status !== statusFilter) {
          return false;
        }
        
        if (searchTerm) {
          const searchTermLower = searchTerm.toLowerCase();
          return (
            vehicle.brand?.toLowerCase().includes(searchTermLower) ||
            vehicle.model?.toLowerCase().includes(searchTermLower) ||
            vehicle.description?.toLowerCase().includes(searchTermLower) ||
            vehicle.location?.toLowerCase().includes(searchTermLower)
          );
        }
        
        return true;
      })
      .sort((a, b) => {
        switch (sortOrder) {
          case 'priceAsc':
            return (a.price || 0) - (b.price || 0);
          case 'priceDesc':
            return (b.price || 0) - (a.price || 0);
          case 'mileage':
            return (a.mileage || 0) - (b.mileage || 0);
          case 'newest':
          default:
            return new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime();
        }
      });
  }, [vehicles, statusFilter, searchTerm, sortOrder]);

  if (error) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-bold mb-2">{t('common.error')}</h2>
        <p>{t('vehicles.loadError')}</p>
        <Button 
          variant="outline" 
          onClick={() => navigate('/dashboard')} 
          className="mt-4"
        >
          {t('common.back')}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <Button 
            variant="outline" 
            size="sm" 
            className="mb-4" 
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('common.back')}
          </Button>
          <h1 className="text-3xl font-bold flex items-center">
            <Car className="h-8 w-8 mr-2 text-auto-blue" />
            {t('vehicles.myVehicles', { fallback: 'My Vehicles' })}
          </h1>
          <p className="text-muted-foreground">
            {t('vehicles.myVehiclesDescription', { fallback: 'Manage your vehicle listings' })}
          </p>
        </div>
        <div className="w-full md:w-auto">
          <Button 
            onClick={() => navigate('/vehicle-management')} 
            className="w-full md:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            {t('vehicles.publishNewVehicle')}
          </Button>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t('vehicles.search')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="flex flex-row gap-2">
              <div className="w-48">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder={t('vehicles.filter')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('common.all')}</SelectItem>
                    <SelectItem value="available">{t('vehicles.statusAvailable')}</SelectItem>
                    <SelectItem value="reserved">{t('vehicles.statusReserved')}</SelectItem>
                    <SelectItem value="sold">{t('vehicles.statusSold')}</SelectItem>
                    <SelectItem value="draft">{t('vehicles.statusDraft', { fallback: 'Borrador' })}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-48">
                <Select value={sortOrder} onValueChange={setSortOrder}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={t('vehicles.sort')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">{t('vehicles.sortNewest')}</SelectItem>
                    <SelectItem value="priceAsc">{t('vehicles.sortPriceAsc')}</SelectItem>
                    <SelectItem value="priceDesc">{t('vehicles.sortPriceDesc')}</SelectItem>
                    <SelectItem value="mileage">{t('vehicles.sortMileage')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vehicle Grid */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      ) : filteredVehicles && filteredVehicles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVehicles.map((vehicle) => (
            <div key={vehicle.id} className="space-y-4">
              <VehicleCard 
                vehicle={vehicle} 
              />
              
              {vehicle.status === 'available' && (
                <VehicleStatusActions
                  vehicleId={vehicle.id}
                  onStatusChange={(status) => markVehicleStatus.mutate({ vehicleId: vehicle.id, status })}
                  isPending={markVehicleStatus.isPending}
                />
              )}
              {vehicle.status === 'draft' && (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigate(`/vehicle/${vehicle.id}/edit`)}
                    className="flex-1"
                  >
                    {t('common.edit', { fallback: 'Editar' })}
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => markVehicleStatus.mutate({ vehicleId: vehicle.id, status: 'available' })}
                    disabled={markVehicleStatus.isPending}
                    className="flex-1"
                  >
                    <Upload className="h-4 w-4 mr-1" />
                    {t('vehicles.publishVehicle', { fallback: 'Publicar' })}
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <VehicleEmpty />
      )}
    </div>
  );
};

export default MyVehicles;
