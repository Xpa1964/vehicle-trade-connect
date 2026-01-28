import React, { useState } from 'react';
import { VehicleFormData } from '@/types/vehicle';
import { ImageAssociation } from '@/utils/imageVehicleAssociator';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Eye,
  Image as ImageIcon,
  Euro,
  Gauge,
  Calendar,
  MapPin,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface EnhancedPreviewSectionProps {
  vehicles: VehicleFormData[];
  imageAssociations: ImageAssociation[];
  onVehiclesSelectionChange: (selectedIndices: number[]) => void;
  strategyType?: 'vin' | 'plate' | 'sequential' | 'manual';
  strategyConfidence?: 'high' | 'medium' | 'low';
}

export const EnhancedPreviewSection: React.FC<EnhancedPreviewSectionProps> = ({
  vehicles,
  imageAssociations,
  onVehiclesSelectionChange,
  strategyType = 'sequential',
  strategyConfidence = 'medium',
}) => {
  const { t } = useLanguage();
  const [selectedVehicles, setSelectedVehicles] = useState<Set<number>>(
    new Set(vehicles.map((_, i) => i))
  );
  const [detailsVehicle, setDetailsVehicle] = useState<{
    vehicle: VehicleFormData;
    association?: ImageAssociation;
  } | null>(null);

  const handleToggleVehicle = (index: number) => {
    const newSelected = new Set(selectedVehicles);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedVehicles(newSelected);
    onVehiclesSelectionChange(Array.from(newSelected));
  };

  const handleToggleAll = () => {
    if (selectedVehicles.size === vehicles.length) {
      setSelectedVehicles(new Set());
      onVehiclesSelectionChange([]);
    } else {
      const allIndices = vehicles.map((_, i) => i);
      setSelectedVehicles(new Set(allIndices));
      onVehiclesSelectionChange(allIndices);
    }
  };

  const getVehicleStatus = (index: number): 'complete' | 'no-images' | 'error' => {
    const association = imageAssociations.find(a => a.vehicleIndex === index);
    if (!association || association.images.length === 0) return 'no-images';
    return 'complete';
  };

  const getStatusIcon = (status: 'complete' | 'no-images' | 'error') => {
    switch (status) {
      case 'complete':
        return <CheckCircle2 className="h-5 w-5 text-success" />;
      case 'no-images':
        return <AlertTriangle className="h-5 w-5 text-warning" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-destructive" />;
    }
  };

  const getStatusBadge = (status: 'complete' | 'no-images' | 'error') => {
    switch (status) {
      case 'complete':
        return (
          <Badge variant="default" className="bg-success">
            {t('vehicles.ready', { fallback: 'Listo' })}
          </Badge>
        );
      case 'no-images':
        return (
          <Badge variant="secondary" className="bg-warning/20 text-warning">
            {t('vehicles.noImages', { fallback: 'Sin Imágenes' })}
          </Badge>
        );
      case 'error':
        return (
          <Badge variant="destructive">
            {t('vehicles.error', { fallback: 'Error' })}
          </Badge>
        );
    }
  };

  const strategyInfo = {
    vin: { label: 'VIN', color: 'text-blue-600' },
    plate: { label: t('vehicles.licensePlate', { fallback: 'Matrícula' }), color: 'text-purple-600' },
    sequential: { label: t('vehicles.sequential', { fallback: 'Secuencial' }), color: 'text-orange-600' },
    manual: { label: t('vehicles.manual', { fallback: 'Manual' }), color: 'text-gray-600' },
  };

  const confidenceColors = {
    high: 'bg-green-500/10 border-green-500/20 text-green-700',
    medium: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-700',
    low: 'bg-red-500/10 border-red-500/20 text-red-700',
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              {t('vehicles.vehiclePreview', { fallback: 'Vista Previa de Vehículos' })}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={strategyInfo[strategyType].color}>
                {t('vehicles.associatedBy', { fallback: 'Asociado por' })}: {strategyInfo[strategyType].label}
              </Badge>
              <Badge variant="outline" className={confidenceColors[strategyConfidence]}>
                {t('vehicles.confidence', { fallback: 'Confianza' })}: {strategyConfidence}
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Controles de selección */}
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2">
              <Checkbox
                checked={selectedVehicles.size === vehicles.length}
                onCheckedChange={handleToggleAll}
              />
              <span className="text-sm font-medium">
                {t('vehicles.selectAll', { fallback: 'Seleccionar Todos' })}
              </span>
            </div>
            <span className="text-sm text-muted-foreground">
              {selectedVehicles.size} / {vehicles.length} {t('vehicles.selected', { fallback: 'seleccionados' })}
            </span>
          </div>

          {/* Grid de tarjetas de vehículos */}
          <ScrollArea className="h-[600px] pr-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {vehicles.map((vehicle, index) => {
                const status = getVehicleStatus(index);
                const association = imageAssociations.find(a => a.vehicleIndex === index);
                const isSelected = selectedVehicles.has(index);
                const thumbnail = association?.images[0] ? URL.createObjectURL(association.images[0]) : null;

                return (
                  <Card
                    key={index}
                    className={cn(
                      'transition-all cursor-pointer hover:shadow-lg',
                      isSelected ? 'ring-2 ring-primary' : 'opacity-70'
                    )}
                    onClick={() => handleToggleVehicle(index)}
                  >
                    <CardContent className="p-4 space-y-3">
                      {/* Thumbnail */}
                      <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                        {thumbnail ? (
                          <img
                            src={thumbnail}
                            alt={`${vehicle.brand} ${vehicle.model}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ImageIcon className="h-12 w-12 text-muted-foreground/50" />
                          </div>
                        )}
                        
                        {/* Checkbox en la esquina */}
                        <div className="absolute top-2 left-2">
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => handleToggleVehicle(index)}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-background"
                          />
                        </div>

                        {/* Estado en la esquina */}
                        <div className="absolute top-2 right-2">
                          {getStatusIcon(status)}
                        </div>

                        {/* Contador de imágenes */}
                        {association && association.images.length > 0 && (
                          <Badge className="absolute bottom-2 right-2 bg-black/70 text-white">
                            <ImageIcon className="h-3 w-3 mr-1" />
                            {association.images.length}/25
                          </Badge>
                        )}
                      </div>

                      {/* Información del vehículo */}
                      <div className="space-y-2">
                        <div>
                          <h3 className="font-semibold text-lg leading-tight">
                            {vehicle.brand} {vehicle.model}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {vehicle.year} • {vehicle.fuel} • {vehicle.transmission}
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="flex items-center gap-1">
                            <Euro className="h-3 w-3 text-muted-foreground" />
                            <span className="font-medium">{vehicle.price.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Gauge className="h-3 w-3 text-muted-foreground" />
                            <span>{vehicle.mileage.toLocaleString()} km</span>
                          </div>
                          <div className="flex items-center gap-1 col-span-2">
                            <MapPin className="h-3 w-3 text-muted-foreground" />
                            <span className="truncate">{vehicle.location}, {vehicle.country}</span>
                          </div>
                        </div>

                        {/* Badge de estado */}
                        <div className="flex items-center justify-between">
                          {getStatusBadge(status)}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDetailsVehicle({ vehicle, association });
                            }}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            {t('common.details', { fallback: 'Detalles' })}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Dialog de detalles */}
      <Dialog open={!!detailsVehicle} onOpenChange={() => setDetailsVehicle(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {detailsVehicle && (
            <>
              <DialogHeader>
                <DialogTitle>
                  {detailsVehicle.vehicle.brand} {detailsVehicle.vehicle.model} {detailsVehicle.vehicle.year}
                </DialogTitle>
                <DialogDescription>
                  {t('vehicles.completeDetails', { fallback: 'Detalles completos del vehículo' })}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                {/* Imágenes */}
                {detailsVehicle.association && detailsVehicle.association.images.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">
                      {t('vehicles.images', { fallback: 'Imágenes' })} ({detailsVehicle.association.images.length})
                    </h4>
                    <div className="grid grid-cols-4 gap-2">
                      {detailsVehicle.association.images.map((img, i) => (
                        <img
                          key={i}
                          src={URL.createObjectURL(img)}
                          alt={`${i + 1}`}
                          className="aspect-square object-cover rounded border"
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Datos del vehículo */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">{t('vehicles.brand', { fallback: 'Marca' })}:</span>
                    <p className="font-medium">{detailsVehicle.vehicle.brand}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">{t('vehicles.model', { fallback: 'Modelo' })}:</span>
                    <p className="font-medium">{detailsVehicle.vehicle.model}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">{t('vehicles.year', { fallback: 'Año' })}:</span>
                    <p className="font-medium">{detailsVehicle.vehicle.year}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">{t('vehicles.price', { fallback: 'Precio' })}:</span>
                    <p className="font-medium">€{detailsVehicle.vehicle.price.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">{t('vehicles.mileage', { fallback: 'Kilometraje' })}:</span>
                    <p className="font-medium">{detailsVehicle.vehicle.mileage.toLocaleString()} km</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">{t('vehicles.fuel', { fallback: 'Combustible' })}:</span>
                    <p className="font-medium capitalize">{detailsVehicle.vehicle.fuel}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">{t('vehicles.transmission', { fallback: 'Transmisión' })}:</span>
                    <p className="font-medium capitalize">{detailsVehicle.vehicle.transmission}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">{t('vehicles.location', { fallback: 'Ubicación' })}:</span>
                    <p className="font-medium">{detailsVehicle.vehicle.location}</p>
                  </div>
                  {detailsVehicle.vehicle.vin && (
                    <div className="col-span-2">
                      <span className="text-muted-foreground">VIN:</span>
                      <p className="font-medium font-mono">{detailsVehicle.vehicle.vin}</p>
                    </div>
                  )}
                  {detailsVehicle.vehicle.licensePlate && (
                    <div className="col-span-2">
                      <span className="text-muted-foreground">{t('vehicles.licensePlate', { fallback: 'Matrícula' })}:</span>
                      <p className="font-medium font-mono">{detailsVehicle.vehicle.licensePlate}</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
