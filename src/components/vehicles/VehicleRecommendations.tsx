import React, { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lightbulb, TrendingUp, ChevronRight, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useVehicleRecommendations } from '@/hooks/useVehicleRecommendations';

interface VehicleRecommendationsProps {
  className?: string;
}

const VehicleRecommendations: React.FC<VehicleRecommendationsProps> = memo(({ className = '' }) => {
  const navigate = useNavigate();
  const {
    recommendedVehicles,
    reasoning,
    confidenceScore,
    isLoading,
    error,
    isAuthenticated,
    trackVehicleVisit,
    cached
  } = useVehicleRecommendations();

  // Don't show for non-authenticated users
  if (!isAuthenticated) return null;

  // Don't show if loading initially or if there's an error
  if (isLoading || error || !recommendedVehicles.length) return null;

  const handleVehicleClick = (vehicleId: string) => {
    trackVehicleVisit(vehicleId, 'click', 'gallery');
    navigate(`/vehicle/${vehicleId}`);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Card className={`bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 ${className}`}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Lightbulb className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-lg text-blue-900 flex items-center gap-2">
                Recomendados para ti
                {cached && (
                  <Badge variant="outline" className="text-xs bg-blue-50">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Actualizadas
                  </Badge>
                )}
              </CardTitle>
              <p className="text-sm text-blue-600 mt-1">
                {reasoning.length > 0 && reasoning[0]}
              </p>
            </div>
          </div>
          {confidenceScore > 0 && (
            <div className="flex items-center gap-1 text-blue-600">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm font-medium">{Math.round(confidenceScore)}%</span>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {recommendedVehicles.slice(0, 4).map((vehicle) => (
            <div
              key={vehicle.id}
              onClick={() => handleVehicleClick(vehicle.id)}
              className="group cursor-pointer bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200 hover:scale-[1.02]"
            >
              <div className="aspect-[4/3] bg-gray-100 overflow-hidden">
                <img
                  src={vehicle.image_url}
                  alt={`${vehicle.brand} ${vehicle.model}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              
              <div className="p-3">
                <h4 className="font-medium text-sm text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                  {vehicle.brand} {vehicle.model}
                </h4>
                <p className="text-xs text-gray-500 mb-2">{vehicle.year}</p>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-blue-600 text-sm">
                    {formatPrice(vehicle.price)}
                  </span>
                  <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {recommendedVehicles.length > 4 && (
          <div className="mt-4 pt-4 border-t border-blue-200">
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              onClick={() => {
                // TODO: Implement show more recommendations or filter by recommendations
                console.log('Show more recommendations');
              }}
            >
              Ver más recomendaciones ({recommendedVehicles.length - 4} adicionales)
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        )}

        {reasoning.length > 1 && (
          <div className="mt-3 pt-3 border-t border-blue-200">
            <p className="text-xs text-blue-600 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              {reasoning.slice(1).join(' • ')}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
});

VehicleRecommendations.displayName = 'VehicleRecommendations';

export default VehicleRecommendations;