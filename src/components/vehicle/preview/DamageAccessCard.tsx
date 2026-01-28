
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface DamageAccessCardProps {
  vehicleId: string;
}

const DamageAccessCard: React.FC<DamageAccessCardProps> = ({
  vehicleId
}) => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  // Query para obtener el número real de daños
  const { data: damagesCount = 0 } = useQuery({
    queryKey: ['vehicle-damages-count', vehicleId],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('vehicle_damages')
        .select('*', { count: 'exact', head: true })
        .eq('vehicle_id', vehicleId);
      
      if (error) {
        console.error('Error fetching damages count:', error);
        return 0;
      }
      
      return count || 0;
    }
  });

  const handleDamagesClick = () => {
    navigate(`/vehicle/${vehicleId}/damages`);
  };

  return (
    <Card 
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={handleDamagesClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            <span className="font-medium">Estado</span>
          </div>
          <Badge variant="secondary" className="px-2 py-1">
            {damagesCount}
          </Badge>
        </div>
        <p className="text-sm text-gray-600">
          Acceder para conocer el estado del vehículo
        </p>
      </CardContent>
    </Card>
  );
};

export default DamageAccessCard;
