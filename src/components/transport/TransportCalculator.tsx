import React, { useState, useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useLanguage } from '@/contexts/LanguageContext';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Calculator, AlertTriangle, CheckCircle2, Info, Car, Truck, Crown } from 'lucide-react';
import { 
  calculateTransportPrice, 
  CalculationResult, 
  VehicleType,
  getEstimatedDistance,
  VEHICLE_TYPES
} from '@/lib/transportPriceCalculator';
import { FormValues } from './types';

interface TransportCalculatorProps {
  form: UseFormReturn<FormValues>;
  onCalculationComplete: (result: CalculationResult | null) => void;
}

const TransportCalculator: React.FC<TransportCalculatorProps> = ({ form, onCalculationComplete }) => {
  const { t } = useLanguage();
  const [isCalculating, setIsCalculating] = useState(false);
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [manualDistance, setManualDistance] = useState<string>('');
  const [showManualDistance, setShowManualDistance] = useState(false);

  // Watch form fields
  const originCity = form.watch('originCity');
  const originCountry = form.watch('originCountry');
  const destinationCity = form.watch('destinationCity');
  const destinationCountry = form.watch('destinationCountry');
  const vehicleType = form.watch('vehicleType');
  const cleaning = form.watch('cleaning');
  const personalizedDelivery = form.watch('personalizedDelivery');
  const urgent = form.watch('urgent');
  const night = form.watch('night');
  const holiday = form.watch('holiday');

  // Reset result when key fields change
  useEffect(() => {
    setResult(null);
    onCalculationComplete(null);
  }, [originCity, originCountry, destinationCity, destinationCountry]);

  const canCalculate = originCity && originCountry && destinationCity && destinationCountry && vehicleType;

  const handleCalculate = async () => {
    if (!canCalculate) return;

    setIsCalculating(true);

    try {
      // Try to get distance estimate
      let distanceKm = getEstimatedDistance(destinationCity);
      
      // If no estimate and manual distance provided, use it
      if (!distanceKm && manualDistance) {
        distanceKm = parseInt(manualDistance, 10);
      }
      
      // If still no distance, show manual input
      if (!distanceKm) {
        setShowManualDistance(true);
        setIsCalculating(false);
        return;
      }

      const calculationResult = calculateTransportPrice({
        originCity,
        originCountry,
        destinationCity,
        destinationCountry,
        vehicleType: vehicleType as VehicleType,
        optionalServices: {
          cleaning: cleaning || false,
          personalizedDelivery: personalizedDelivery || false,
          urgent: urgent || false,
          night: night || false,
          holiday: holiday || false
        },
        distanceKm
      });

      setResult(calculationResult);
      onCalculationComplete(calculationResult);

      // Update form with calculation data
      form.setValue('calculatedPrice', calculationResult.price || undefined);
      form.setValue('calculationResultType', calculationResult.type);
      form.setValue('calculatedDistanceKm', calculationResult.distanceKm);
    } catch (error) {
      console.error('Calculation error:', error);
    } finally {
      setIsCalculating(false);
    }
  };

  const getVehicleIcon = (type: string) => {
    switch (type) {
      case 'premium': return <Crown className="h-4 w-4" />;
      case 'industrial': return <Truck className="h-4 w-4" />;
      default: return <Car className="h-4 w-4" />;
    }
  };

  return (
    <Card className="border-2 border-dashed border-primary/30 bg-primary/5">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Calculator className="h-5 w-5 text-primary" />
          {t('transport.calculator.title', { fallback: 'Calculadora de Precio' })}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Vehicle Type Selection */}
        <FormField
          control={form.control}
          name="vehicleType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('transport.calculator.vehicleType', { fallback: 'Tipo de Vehículo' })} *</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={t('transport.calculator.selectVehicle', { fallback: 'Selecciona tipo de vehículo' })} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {VEHICLE_TYPES.map((vt) => (
                    <SelectItem key={vt.value} value={vt.value}>
                      <div className="flex items-center gap-2">
                        {getVehicleIcon(vt.value)}
                        <span>
                          {t(`transport.calculator.vehicleType.${vt.value}`, { 
                            fallback: `${vt.value.charAt(0).toUpperCase() + vt.value.slice(1)} (${vt.rate} €/h)` 
                          })}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Optional Services */}
        <div className="space-y-3">
          <FormLabel>{t('transport.calculator.services', { fallback: 'Servicios Opcionales' })}</FormLabel>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Cleaning */}
            <FormField
              control={form.control}
              name="cleaning"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-3 space-y-0 rounded-lg border p-3 bg-background">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-0.5">
                    <FormLabel className="text-sm font-normal cursor-pointer">
                      {t('transport.calculator.cleaning', { fallback: 'Limpieza del vehículo' })}
                    </FormLabel>
                    <p className="text-xs text-muted-foreground">+0.5h</p>
                  </div>
                </FormItem>
              )}
            />

            {/* Personalized Delivery */}
            <FormField
              control={form.control}
              name="personalizedDelivery"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-3 space-y-0 rounded-lg border p-3 bg-background">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-0.5">
                    <FormLabel className="text-sm font-normal cursor-pointer">
                      {t('transport.calculator.personalizedDelivery', { fallback: 'Entrega personalizada' })}
                    </FormLabel>
                    <p className="text-xs text-muted-foreground">+1h</p>
                  </div>
                </FormItem>
              )}
            />

            {/* Urgent */}
            <FormField
              control={form.control}
              name="urgent"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-3 space-y-0 rounded-lg border p-3 bg-background">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-0.5">
                    <FormLabel className="text-sm font-normal cursor-pointer">
                      {t('transport.calculator.urgent', { fallback: 'Servicio urgente' })}
                    </FormLabel>
                    <p className="text-xs text-muted-foreground">+20%</p>
                  </div>
                </FormItem>
              )}
            />

            {/* Night */}
            <FormField
              control={form.control}
              name="night"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-3 space-y-0 rounded-lg border p-3 bg-background">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-0.5">
                    <FormLabel className="text-sm font-normal cursor-pointer">
                      {t('transport.calculator.night', { fallback: 'Servicio nocturno' })}
                    </FormLabel>
                    <p className="text-xs text-muted-foreground">+25%</p>
                  </div>
                </FormItem>
              )}
            />

            {/* Holiday */}
            <FormField
              control={form.control}
              name="holiday"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-3 space-y-0 rounded-lg border p-3 bg-background">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-0.5">
                    <FormLabel className="text-sm font-normal cursor-pointer">
                      {t('transport.calculator.holiday', { fallback: 'Servicio festivo' })}
                    </FormLabel>
                    <p className="text-xs text-muted-foreground">+25%</p>
                  </div>
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Manual Distance Input */}
        {showManualDistance && (
          <div className="space-y-2">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                {t('transport.calculator.manualDistanceInfo', { 
                  fallback: 'No pudimos estimar la distancia automáticamente. Por favor, introduce los kilómetros aproximados.' 
                })}
              </AlertDescription>
            </Alert>
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Km"
                value={manualDistance}
                onChange={(e) => setManualDistance(e.target.value)}
                className="w-32"
              />
              <span className="self-center text-sm text-muted-foreground">kilómetros</span>
            </div>
          </div>
        )}

        {/* Calculate Button */}
        <Button
          type="button"
          onClick={handleCalculate}
          disabled={!canCalculate || isCalculating}
          className="w-full"
          variant="outline"
        >
          <Calculator className="h-4 w-4 mr-2" />
          {isCalculating 
            ? t('transport.calculator.calculating', { fallback: 'Calculando...' })
            : t('transport.calculator.calculate', { fallback: 'Calcular Precio' })
          }
        </Button>

        {/* Result Display */}
        {result && (
          <CalculationResultDisplay result={result} t={t} />
        )}
      </CardContent>
    </Card>
  );
};

// Result Display Component
interface ResultDisplayProps {
  result: CalculationResult;
  t: (key: string, options?: { fallback?: string }) => string;
}

const CalculationResultDisplay: React.FC<ResultDisplayProps> = ({ result, t }) => {
  if (result.type === 'NOT_AVAILABLE') {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>{result.warningMessage}</AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className={`border-2 ${result.type === 'ORIENTATIVE' ? 'border-warning bg-warning/10' : 'border-primary bg-primary/10'}`}>
      <CardContent className="p-4 space-y-4">
        {/* Warning for orientative */}
        {result.type === 'ORIENTATIVE' && (
          <Alert variant="default" className="border-warning bg-warning/10">
            <AlertTriangle className="h-4 w-4 text-warning" />
            <AlertDescription className="text-warning-foreground">
              {result.warningMessage}
            </AlertDescription>
          </Alert>
        )}
        
        {/* Price */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            {result.type === 'FINAL' ? (
              <CheckCircle2 className="h-6 w-6 text-primary" />
            ) : (
              <Info className="h-6 w-6 text-warning" />
            )}
            <p className="text-4xl font-bold text-primary">
              {result.price?.toFixed(2)} €
            </p>
          </div>
          <Badge variant={result.type === 'FINAL' ? 'default' : 'outline'} className={result.type === 'ORIENTATIVE' ? 'border-warning text-warning' : ''}>
            {result.type === 'FINAL' 
              ? t('transport.calculator.result.final', { fallback: 'Precio Final' })
              : t('transport.calculator.result.orientative', { fallback: 'Precio Orientativo' })
            }
          </Badge>
        </div>
        
        {/* Breakdown */}
        <details className="mt-4">
          <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground transition-colors">
            {t('transport.calculator.showBreakdown', { fallback: 'Ver desglose' })}
          </summary>
          <div className="mt-3 space-y-2 text-sm bg-background/50 rounded-lg p-3">
            <div className="flex justify-between">
              <span>{t('transport.calculator.breakdown.distance', { fallback: 'Distancia' })}</span>
              <span className="font-medium">{result.distanceKm} km</span>
            </div>
            <div className="flex justify-between">
              <span>{t('transport.calculator.breakdown.drivingTime', { fallback: 'Tiempo conducción' })}</span>
              <span className="font-medium">{result.drivingTimeHours.toFixed(1)} h</span>
            </div>
            <div className="flex justify-between">
              <span>{t('transport.calculator.breakdown.rate', { fallback: 'Tarifa/hora' })}</span>
              <span className="font-medium">{result.hourlyRate} €</span>
            </div>
            <div className="flex justify-between">
              <span>{t('transport.calculator.breakdown.driving', { fallback: 'Coste conducción' })}</span>
              <span className="font-medium">{result.breakdown.driving.toFixed(2)} €</span>
            </div>
            {result.extraHours > 0 && (
              <div className="flex justify-between">
                <span>{t('transport.calculator.breakdown.extras', { fallback: 'Servicios extra' })}</span>
                <span className="font-medium">{result.breakdown.extras.toFixed(2)} €</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>{t('transport.calculator.breakdown.return', { fallback: 'Coste retorno' })}</span>
              <span className="font-medium">{result.breakdown.return.toFixed(2)} €</span>
            </div>
            <div className="flex justify-between">
              <span>{t('transport.calculator.breakdown.insurance', { fallback: 'Seguro' })}</span>
              <span className="font-medium">{result.breakdown.insurance.toFixed(2)} €</span>
            </div>
            {result.surchargePercentage > 0 && (
              <div className="flex justify-between text-warning">
                <span>{t('transport.calculator.breakdown.surcharges', { fallback: 'Recargos' })} (+{(result.surchargePercentage * 100).toFixed(0)}%)</span>
                <span className="font-medium">{result.breakdown.surcharges.toFixed(2)} €</span>
              </div>
            )}
            <div className="border-t pt-2 flex justify-between font-semibold">
              <span>{t('transport.calculator.breakdown.total', { fallback: 'Total' })}</span>
              <span>{result.price?.toFixed(2)} €</span>
            </div>
          </div>
        </details>
      </CardContent>
    </Card>
  );
};

export default TransportCalculator;
