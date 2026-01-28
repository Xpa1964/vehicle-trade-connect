
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Database, Users, Car } from 'lucide-react';

const VehicleGalleryDebug: React.FC = () => {
  const { data: vehicleCount, isLoading: countLoading } = useQuery({
    queryKey: ['vehicle-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('vehicles')
        .select('*', { count: 'exact', head: true });
      
      if (error) throw error;
      return count || 0;
    },
  });

  const { data: userCount } = useQuery({
    queryKey: ['user-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
      
      if (error) throw error;
      return count || 0;
    },
  });

  const { data: dbConnection, isLoading: dbLoading } = useQuery({
    queryKey: ['db-connection'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('vehicles')
          .select('id')
          .limit(1);
        
        return { 
          connected: !error, 
          error: error?.message || null,
          hasData: data && data.length > 0 
        };
      } catch (err) {
        return { 
          connected: false, 
          error: err instanceof Error ? err.message : 'Unknown error',
          hasData: false 
        };
      }
    },
  });

  if (countLoading || dbLoading) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Cargando diagnóstico...
          </CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-4 w-full max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Estado de la Base de Datos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Conexión a Supabase:</span>
            <Badge variant={dbConnection?.connected ? "default" : "destructive"}>
              {dbConnection?.connected ? "Conectado" : "Error"}
            </Badge>
          </div>
          
          {dbConnection?.error && (
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">{dbConnection.error}</span>
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <span>Vehículos en DB:</span>
            <Badge variant={vehicleCount === 0 ? "secondary" : "default"}>
              <Car className="h-3 w-3 mr-1" />
              {vehicleCount}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span>Usuarios registrados:</span>
            <Badge variant="outline">
              <Users className="h-3 w-3 mr-1" />
              {userCount}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {vehicleCount === 0 && (
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader>
            <CardTitle className="text-amber-800 flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Base de Datos Vacía
            </CardTitle>
          </CardHeader>
          <CardContent className="text-amber-700">
            <p>No hay vehículos en la base de datos. Esto explica por qué la galería aparece vacía.</p>
            <p className="mt-2 text-sm">
              Para resolver esto, necesitas:
            </p>
            <ul className="list-disc list-inside mt-2 text-sm space-y-1">
              <li>Agregar vehículos de prueba a la base de datos</li>
              <li>O usar la funcionalidad de subida de vehículos</li>
              <li>Verificar que los usuarios puedan crear vehículos</li>
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VehicleGalleryDebug;
