
import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, ChevronLeft, ChevronRight, X } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '@/components/ui/carousel';

interface DamageImage {
  url: string;
  description: string;
  severity: string;
  location: string | null;
  repairCost: number | null;
  damageType: string;
}

const VehicleDamagesPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

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

  const { data: damages, isLoading: damagesLoading } = useQuery({
    queryKey: ['vehicle-damages', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vehicle_damages')
        .select('*, vehicle_damage_images(*)')
        .eq('vehicle_id', id)
        .order('created_at', { ascending: true });
      if (error) throw error;
      return data || [];
    }
  });

  const isLoading = vehicleLoading || damagesLoading;

  const damageItems: DamageImage[] = React.useMemo(() => {
    if (!damages) return [];
    const items: DamageImage[] = [];
    
    for (const damage of damages) {
      const images = damage.vehicle_damage_images || [];
      
      if (images.length > 0) {
        for (const img of images) {
          items.push({
            url: img.image_url,
            description: damage.description || damage.damage_type || t('vehicles.damage') || 'Daño',
            severity: damage.severity || 'minor',
            location: damage.location,
            repairCost: damage.repair_cost,
            damageType: damage.damage_type || 'exterior',
          });
        }
      } else if (damage.image_url) {
        items.push({
          url: damage.image_url,
          description: damage.description || damage.damage_type || t('vehicles.damage') || 'Daño',
          severity: damage.severity || 'minor',
          location: damage.location,
          repairCost: damage.repair_cost,
          damageType: damage.damage_type || 'exterior',
        });
      }
    }
    return items;
  }, [damages, t]);

  const getSeverityLabel = (severity: string) => {
    switch (severity) {
      case 'minor': return t('vehicles.severityMinor') || 'Menor';
      case 'moderate': return t('vehicles.severityModerate') || 'Moderado';
      case 'severe': return t('vehicles.severitySevere') || 'Severo';
      default: return severity;
    }
  };

  const getSeverityVariant = (severity: string): "gold" | "default" | "destructive" => {
    switch (severity) {
      case 'minor': return 'gold';
      case 'moderate': return 'default';
      case 'severe': return 'destructive';
      default: return 'default';
    }
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

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
        <div className="text-center text-destructive">
          <h2 className="text-2xl font-bold mb-4">{t('common.error')}</h2>
          <p>{t('vehicles.notFound')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
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
          <Button variant="outline" size="sm">
            {t('common.backToHome')}
          </Button>
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-6 text-center">
        {t('vehicles.damages')} - {vehicle.brand} {vehicle.model}
      </h1>

      {damageItems.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            {t('vehicles.noDamages') || 'No se han reportado daños para este vehículo'}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Carousel de daños */}
          <div className="px-10">
            <Carousel
              opts={{ align: 'start', loop: damageItems.length > 3 }}
              className="w-full"
            >
              <CarouselContent className="-ml-3">
                {damageItems.map((item, index) => (
                  <CarouselItem
                    key={index}
                    className="pl-3 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
                  >
                    <Card className="overflow-hidden h-full">
                      <CardContent className="p-0 flex flex-col h-full">
                        {/* Imagen */}
                        <div
                          className="aspect-[4/3] relative cursor-pointer overflow-hidden"
                          onClick={() => openLightbox(index)}
                        >
                          <img
                            src={item.url}
                            alt={item.description}
                            className="w-full h-full object-cover transition-transform hover:scale-105"
                            loading="lazy"
                          />
                        </div>

                        {/* Info debajo */}
                        <div className="p-3 space-y-2 flex-1">
                          <Badge variant={getSeverityVariant(item.severity)}>
                            {getSeverityLabel(item.severity)}
                          </Badge>
                          <p className="text-sm font-medium line-clamp-2 text-foreground">
                            {item.description}
                          </p>
                          {item.location && (
                            <p className="text-xs text-muted-foreground">
                              {item.location}
                            </p>
                          )}
                          {item.repairCost != null && (
                            <p className="text-xs font-semibold text-muted-foreground">
                              €{item.repairCost}
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>

          {/* Summary */}
          <p className="text-sm text-muted-foreground text-center">
            {damageItems.length} {damageItems.length === 1
              ? (t('vehicles.damageRegistered') || 'daño registrado')
              : (t('vehicles.damagesRegistered') || 'daños registrados')}
          </p>
        </div>
      )}

      {/* Lightbox */}
      {lightboxOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={() => setLightboxOpen(false)}
        >
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-white hover:bg-white/20 z-50"
            onClick={() => setLightboxOpen(false)}
          >
            <X className="h-6 w-6" />
          </Button>

          {damageItems.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 h-12 w-12"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex(prev => prev === 0 ? damageItems.length - 1 : prev - 1);
                }}
              >
                <ChevronLeft className="h-8 w-8" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 h-12 w-12"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex(prev => prev === damageItems.length - 1 ? 0 : prev + 1);
                }}
              >
                <ChevronRight className="h-8 w-8" />
              </Button>
            </>
          )}

          <div className="max-w-4xl max-h-[85vh] p-4" onClick={(e) => e.stopPropagation()}>
            <img
              src={damageItems[lightboxIndex].url}
              alt={damageItems[lightboxIndex].description}
              className="max-w-full max-h-[70vh] object-contain mx-auto"
            />
            <div className="text-white text-center mt-4 space-y-1">
              <p className="font-medium">{damageItems[lightboxIndex].description}</p>
              <p className="text-sm text-white/70">
                {lightboxIndex + 1} / {damageItems.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleDamagesPage;
