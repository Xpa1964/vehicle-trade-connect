
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, Users, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import UserCard from './UserCard';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const UsersDirectory: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [businessTypeFilter, setBusinessTypeFilter] = useState('all');
  const [countryFilter, setCountryFilter] = useState('all');

  const { data: users, isLoading } = useQuery({
    queryKey: ['users-directory', searchTerm, businessTypeFilter, countryFilter],
    queryFn: async () => {
      let query = supabase
        .from('profiles')
        .select(`
          id,
          full_name,
          company_name,
          business_type,
          country,
          company_logo
        `)
        .order('company_name', { ascending: true });

      if (searchTerm) {
        query = query.or(`company_name.ilike.%${searchTerm}%,full_name.ilike.%${searchTerm}%`);
      }

      if (businessTypeFilter !== 'all') {
        query = query.eq('business_type', businessTypeFilter);
      }

      if (countryFilter !== 'all') {
        query = query.eq('country', countryFilter);
      }

      const { data, error } = await query.limit(50);
      
      if (error) {
        console.error('Error fetching users:', error);
        return [];
      }

      return data || [];
    }
  });

  const businessTypes = [
    { value: 'all', label: 'Todos los tipos' },
    { value: 'dealer', label: 'Concesionario' },
    { value: 'multibrand_used', label: 'Multimarca VO' },
    { value: 'buy_sell', label: 'Compraventa' },
    { value: 'rent_a_car', label: 'Rent a Car' },
    { value: 'renting', label: 'Renting' },
    { value: 'workshop', label: 'Taller' },
    { value: 'importer', label: 'Importador' },
    { value: 'exporter', label: 'Exportador' },
    { value: 'trader', label: 'Comerciante' },
    { value: 'other', label: 'Otro' }
  ];

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigate('/messages')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a Mensajería
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Directorio de Usuarios
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar por empresa o contacto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={businessTypeFilter} onValueChange={setBusinessTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Tipo de actividad" />
              </SelectTrigger>
              <SelectContent>
                {businessTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={countryFilter} onValueChange={setCountryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="País" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los países</SelectItem>
                <SelectItem value="España">España</SelectItem>
                <SelectItem value="Francia">Francia</SelectItem>
                <SelectItem value="Italia">Italia</SelectItem>
                <SelectItem value="Alemania">Alemania</SelectItem>
                <SelectItem value="Portugal">Portugal</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Cargando usuarios...</p>
            </div>
          ) : users && users.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {users.map((user) => (
                <UserCard
                  key={user.id}
                  userId={user.id}
                  userName={user.full_name}
                  companyName={user.company_name}
                  businessType={user.business_type}
                  country={user.country}
                  companyLogo={user.company_logo}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">
                {searchTerm || businessTypeFilter !== 'all' || countryFilter !== 'all'
                  ? 'No se encontraron usuarios con los filtros aplicados'
                  : 'No hay usuarios registrados'
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UsersDirectory;
