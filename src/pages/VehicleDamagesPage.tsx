
import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, AlertTriangle, Wrench, Home } from 'lucide-react';

const VehicleDamagesPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();
  const navigate = useNavigate();

  // Query para obtener información del vehículo
  const { data: vehicle, isLoading: vehicleLoading } = useQuery({
    queryKey: ['vehicle', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    }
  });

  // Query para obtener daños del vehículo
  const { data: damages, isLoading: damagesLoading } = useQuery({
    queryKey: ['vehicle-damages', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vehicle_damages')
        .select('*')
        .eq('vehicle_id', id)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return data || [];
    }
  });

  const isLoading = vehicleLoading || damagesLoading;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 flex items-center justify-center">
        <div className="animate-pulse text-xl">{t('common.loading')}</div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center text-red-500">
          <h2 className="text-2xl font-bold mb-4">{t('common.error')}</h2>
          <p>{t('vehicles.notFound')}</p>
        </div>
      </div>
    );
  }

  const getDamagesByType = (type: string) => {
    return damages?.filter(damage => damage.damage_type === type) || [];
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'minor': return 'bg-yellow-100 text-yellow-800';
      case 'moderate': return 'bg-orange-100 text-orange-800';
      case 'severe': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'exterior': return <AlertTriangle className="h-5 w-5" />;
      case 'mechanical': return <Wrench className="h-5 w-5" />;
      case 'interior': return <Home className="h-5 w-5" />;
      default: return null;
    }
  };

  const renderDamageSection = (type: string, title: string) => {
    const typeDamages = getDamagesByType(type);
    
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          {getTypeIcon(type)}
          <h3 className="text-xl font-semibold">{title}</h3>
          <Badge variant="secondary">{typeDamages.length}</Badge>
        </div>
        
        {typeDamages.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              No se han reportado daños de este tipo
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {typeDamages.map((damage) => (
              <Card key={damage.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium text-lg">{damage.damage_type || 'Daño'}</h4>
                        <Badge className={getSeverityColor(damage.severity)}>
                          {damage.severity === 'minor' ? 'Menor' : 
                           damage.severity === 'moderate' ? 'Moderado' : 'Severo'}
                        </Badge>
                      </div>
                      {damage.location && (
                        <p className="text-sm text-muted-foreground mb-2">
                          <strong>Ubicación:</strong> {damage.location}
                        </p>
                      )}
                      {damage.repair_cost && (
                        <p className="text-sm text-muted-foreground mb-2">
                          <strong>Costo estimado:</strong> €{damage.repair_cost}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {damage.description && (
                    <p className="text-gray-700 mb-4">{damage.description}</p>
                  )}
                  
                  {damage.image_url && (
                    <div>
                      <h5 className="font-medium mb-2">Imagen del daño:</h5>
                      <div className="aspect-video bg-muted rounded-lg overflow-hidden w-48">
                        <img 
                          src={damage.image_url} 
                          alt="Imagen de daño"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigate(`/vehicle-preview/${id}`)}
          className="flex items-center"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t('common.back')}
        </Button>
        
        <Link to="/vehicles">
          <Button 
            variant="outline" 
            size="sm" 
          >
            {t('common.backToHome')}
          </Button>
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-6 text-center">
        {t('vehicles.damages')} - {vehicle.brand} {vehicle.model}
      </h1>
      
      <Card className="mb-8">
        <CardContent className="p-6">
          <h2 className="text-2xl font-semibold mb-4">{t('vehicles.damagesFullDescription')}</h2>
          
          <div className="space-y-8">
            {renderDamageSection('exterior', t('vehicles.exteriorDamages'))}
            {renderDamageSection('interior', t('vehicles.interiorDamages'))}
            {renderDamageSection('mechanical', t('vehicles.mechanicalDamages'))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VehicleDamagesPage;
