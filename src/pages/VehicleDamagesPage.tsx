
import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, AlertTriangle, Wrench, Home, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { cn } from '@/lib/utils';

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
  const [currentIndex, setCurrentIndex] = useState(0);
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

  // Flatten all damages into a single array of image items for carousel
  const damageItems: DamageImage[] = React.useMemo(() => {
    if (!damages) return [];
    const items: DamageImage[] = [];
    
    for (const damage of damages) {
      const images = damage.vehicle_damage_images || [];
      
      if (images.length > 0) {
        for (const img of images) {
          items.push({
            url: img.image_url,
            description: damage.description || damage.damage_type || 'Daño',
            severity: damage.severity || 'minor',
            location: damage.location,
            repairCost: damage.repair_cost,
            damageType: damage.damage_type || 'exterior',
          });
        }
      } else if (damage.image_url) {
        items.push({
          url: damage.image_url,
          description: damage.description || damage.damage_type || 'Daño',
          severity: damage.severity || 'minor',
          location: damage.location,
          repairCost: damage.repair_cost,
          damageType: damage.damage_type || 'exterior',
        });
      }
    }
    return items;
  }, [damages]);

  const getSeverityLabel = (severity: string) => {
    switch (severity) {
      case 'minor': return 'Menor';
      case 'moderate': return 'Moderado';
      case 'severe': return 'Severo';
      default: return severity;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'minor': return 'bg-yellow-100 text-yellow-800';
      case 'moderate': return 'bg-orange-100 text-orange-800';
      case 'severe': return 'bg-red-100 text-red-800';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'exterior': return <AlertTriangle className="h-4 w-4" />;
      case 'mechanical': return <Wrench className="h-4 w-4" />;
      case 'interior': return <Home className="h-4 w-4" />;
      default: return null;
    }
  };

  const goToPrev = () => {
    setCurrentIndex(prev => prev === 0 ? damageItems.length - 1 : prev - 1);
  };

  const goToNext = () => {
    setCurrentIndex(prev => prev === damageItems.length - 1 ? 0 : prev + 1);
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

  // Items visible at once in the thumbnail strip
  const visibleCount = Math.min(4, damageItems.length);

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
            No se han reportado daños para este vehículo
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Main carousel image */}
          <Card className="overflow-hidden">
            <CardContent className="p-0 relative">
              <div 
                className="relative aspect-video bg-muted cursor-pointer"
                onClick={() => openLightbox(currentIndex)}
              >
                <img
                  src={damageItems[currentIndex].url}
                  alt={damageItems[currentIndex].description}
                  className="w-full h-full object-contain bg-black/5"
                  loading="eager"
                />
                
                {/* Navigation arrows */}
                {damageItems.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background/90 backdrop-blur-sm h-10 w-10 rounded-full"
                      onClick={(e) => { e.stopPropagation(); goToPrev(); }}
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background/90 backdrop-blur-sm h-10 w-10 rounded-full"
                      onClick={(e) => { e.stopPropagation(); goToNext(); }}
                    >
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </>
                )}

                {/* Counter */}
                <div className="absolute top-3 right-3 bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                  {currentIndex + 1} / {damageItems.length}
                </div>
              </div>

              {/* Description below main image */}
              <div className="p-4 space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  {getTypeIcon(damageItems[currentIndex].damageType)}
                  <span className="font-medium capitalize">{damageItems[currentIndex].damageType}</span>
                  <Badge className={getSeverityColor(damageItems[currentIndex].severity)}>
                    {getSeverityLabel(damageItems[currentIndex].severity)}
                  </Badge>
                </div>
                <p className="text-foreground">{damageItems[currentIndex].description}</p>
                {damageItems[currentIndex].location && (
                  <p className="text-sm text-muted-foreground">
                    <strong>Ubicación:</strong> {damageItems[currentIndex].location}
                  </p>
                )}
                {damageItems[currentIndex].repairCost && (
                  <p className="text-sm text-muted-foreground">
                    <strong>Costo estimado:</strong> €{damageItems[currentIndex].repairCost}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Thumbnail strip */}
          {damageItems.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {damageItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={cn(
                    'flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2 transition-all',
                    index === currentIndex
                      ? 'border-primary ring-2 ring-primary/30'
                      : 'border-border hover:border-primary/50'
                  )}
                >
                  <img
                    src={item.url}
                    alt={item.description}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Summary */}
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground text-center">
                Total: {damageItems.length} {damageItems.length === 1 ? 'daño registrado' : 'daños registrados'}
              </p>
            </CardContent>
          </Card>
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
