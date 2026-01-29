
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, RefreshCw, Eye, Filter, ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import ExchangeProposalCard from '@/components/admin/ExchangeProposalCard';

interface ExchangeProposal {
  id: string;
  initiator_id: string;
  offered_vehicle_id: string;
  requested_vehicle_id: string;
  compensation: number;
  conditions: string[];
  status: string;
  created_at: string;
  conversation_id?: string;
  initiator?: {
    email: string;
    profiles?: {
      company_name?: string;
      full_name?: string;
    };
  };
  offered_vehicle?: {
    brand: string;
    model: string;
    year: number;
    mileage?: number;
  };
  requested_vehicle?: {
    brand: string;
    model: string;
    year: number;
    mileage?: number;
  };
}

const AdminExchanges: React.FC = () => {
  const navigate = useNavigate();
  const [proposals, setProposals] = useState<ExchangeProposal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchExchangeProposals = async () => {
    setIsLoading(true);
    try {
      console.log('Fetching exchange proposals...');
      
      // Fetch exchanges que tengan TODOS los campos requeridos
      const { data: exchangesData, error: exchangesError } = await supabase
        .from('exchanges')
        .select('*')
        .not('initiator_id', 'is', null)
        .not('offered_vehicle_id', 'is', null)
        .not('requested_vehicle_id', 'is', null)
        .order('created_at', { ascending: false });

      if (exchangesError) {
        console.error('Error fetching exchanges:', exchangesError);
        throw exchangesError;
      }

      console.log('Raw exchanges data:', exchangesData);

      if (!exchangesData || exchangesData.length === 0) {
        setProposals([]);
        return;
      }

      // Get unique user IDs and vehicle IDs - solo los que no son nulos
      const userIds = [...new Set(exchangesData.map(ex => ex.initiator_id).filter(Boolean))];
      const offeredVehicleIds = [...new Set(exchangesData.map(ex => ex.offered_vehicle_id).filter(Boolean))];
      const requestedVehicleIds = [...new Set(exchangesData.map(ex => ex.requested_vehicle_id).filter(Boolean))];
      const allVehicleIds = [...new Set([...offeredVehicleIds, ...requestedVehicleIds])];

      console.log('Processing IDs:', { userIds: userIds.length, vehicleIds: allVehicleIds.length });

      // Fetch profiles data
      let profilesData: any[] = [];
      if (userIds.length > 0) {
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, company_name, full_name')
          .in('id', userIds);
        
        if (profilesError) {
          console.error('Error fetching profiles:', profilesError);
        } else {
          profilesData = profiles || [];
        }
      }

      // Fetch vehicle data
      let vehiclesData: any[] = [];
      if (allVehicleIds.length > 0) {
        const { data: vehicles, error: vehiclesError } = await supabase
          .from('vehicles')
          .select('id, brand, model, year, mileage')
          .in('id', allVehicleIds);
        
        if (vehiclesError) {
          console.error('Error fetching vehicles:', vehiclesError);
        } else {
          vehiclesData = vehicles || [];
        }
      }

      // Combine data - solo crear propuestas con datos válidos
      const enrichedProposals = exchangesData
        .map((exchange: any) => {
          const profile = profilesData.find(p => p.id === exchange.initiator_id);
          const offeredVehicle = vehiclesData.find(v => v.id === exchange.offered_vehicle_id);
          const requestedVehicle = vehiclesData.find(v => v.id === exchange.requested_vehicle_id);

          // Solo incluir si tenemos al menos los datos básicos
          if (!profile && !offeredVehicle && !requestedVehicle) {
            console.warn('Exchange with incomplete data:', exchange.id);
            return null;
          }

          return {
            ...exchange,
            initiator: profile ? {
              email: `user-${exchange.initiator_id.slice(0, 8)}@domain.com`,
              profiles: profile
            } : undefined,
            offered_vehicle: offeredVehicle,
            requested_vehicle: requestedVehicle
          };
        })
        .filter(Boolean) as ExchangeProposal[];

      console.log('Enriched proposals:', enrichedProposals);
      setProposals(enrichedProposals);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al cargar las propuestas de intercambio');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExchangeProposals();
  }, []);

  const handleViewConversation = (conversationId: string) => {
    navigate(`/admin/conversations/${conversationId}`);
  };

  const filteredProposals = proposals.filter(proposal => {
    const matchesSearch = searchTerm === '' || 
      proposal.initiator?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proposal.initiator?.profiles?.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proposal.offered_vehicle?.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proposal.offered_vehicle?.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proposal.requested_vehicle?.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proposal.requested_vehicle?.model?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || proposal.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusStats = () => {
    const stats = {
      total: proposals.length,
      pending: proposals.filter(p => p.status === 'pending').length,
      accepted: proposals.filter(p => p.status === 'accepted').length,
      rejected: proposals.filter(p => p.status === 'rejected').length,
    };
    return stats;
  };

  const stats = getStatusStats();

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

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Intercambios</h1>
          <p className="text-gray-600">Administra las propuestas de intercambio de vehículos</p>
        </div>
        <Button onClick={fetchExchangeProposals} disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Actualizar
        </Button>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <p className="text-sm text-gray-600">Total de propuestas</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <p className="text-sm text-gray-600">Pendientes</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{stats.accepted}</div>
            <p className="text-sm text-gray-600">Aceptadas</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
            <p className="text-sm text-gray-600">Rechazadas</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar por usuario, empresa o vehículo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="pending">Pendientes</SelectItem>
                  <SelectItem value="accepted">Aceptadas</SelectItem>
                  <SelectItem value="rejected">Rechazadas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de propuestas */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2 text-blue-600" />
            <p>Cargando propuestas de intercambio...</p>
          </div>
        </div>
      ) : filteredProposals.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <Eye className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No se encontraron propuestas
              </h3>
              <p className="text-gray-600">
                {searchTerm || statusFilter !== 'all' 
                  ? 'No hay propuestas que coincidan con los filtros aplicados.'
                  : 'Aún no hay propuestas de intercambio registradas.'}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredProposals.map((proposal) => (
            <ExchangeProposalCard
              key={proposal.id}
              proposal={proposal}
              onViewConversation={handleViewConversation}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminExchanges;
