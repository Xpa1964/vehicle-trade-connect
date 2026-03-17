import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';

const REPORT_PRICES: Record<string, number | null> = {
  basic: 160,
  technical: 200,
  premium: null,
  dgt: 19,
  carfax: 29
};

const reportSchema = z.object({
  vehicle_plate: z.string()
    .min(1, 'La matrícula es obligatoria')
    .max(50, 'La matrícula es demasiado larga'),
  vehicle_brand: z.string().min(1, 'La marca es obligatoria'),
  vehicle_model: z.string().min(1, 'El modelo es obligatorio'),
  vehicle_year: z.coerce.number()
    .min(1900, 'Año inválido')
    .max(new Date().getFullYear() + 1, 'Año inválido'),
  vehicle_location: z.string().min(1, 'La ubicación es obligatoria'),
  report_type: z.enum(['basic', 'technical', 'premium', 'dgt', 'carfax']),
  observations: z.string().optional(),
  vehicle_count: z.coerce.number()
    .min(1, 'Mínimo 1 vehículo')
    .max(50, 'Máximo 50 vehículos')
    .optional()
    .default(1),
  urgency_level: z.enum(['normal', 'urgent', 'very_urgent']).optional().default('normal')
});

type ReportFormData = z.infer<typeof reportSchema>;

interface ReportRequestFormProps {
  onSuccess?: () => void;
}

export const ReportRequestForm: React.FC<ReportRequestFormProps> = ({ onSuccess }) => {
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedType, setSelectedType] = useState<string>('');

  const form = useForm<ReportFormData>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      vehicle_plate: '',
      vehicle_brand: '',
      vehicle_model: '',
      vehicle_year: new Date().getFullYear(),
      vehicle_location: '',
      report_type: 'basic',
      observations: '',
      vehicle_count: 1,
      urgency_level: 'normal'
    }
  });

  const onSubmit = async (data: ReportFormData) => {
    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error(t('toast.loginRequired'));
        return;
      }

      const basePrice = data.report_type === 'premium' 
        ? null 
        : REPORT_PRICES[data.report_type];

      const { error } = await supabase
        .from('vehicle_report_requests')
        .insert({
          user_id: user.id,
          vehicle_plate: data.vehicle_plate.toUpperCase(),
          vehicle_brand: data.vehicle_brand,
          vehicle_model: data.vehicle_model,
          vehicle_year: data.vehicle_year,
          vehicle_location: data.vehicle_location,
          report_type: data.report_type,
          observations: data.observations,
          base_price: basePrice,
          vehicle_count: data.vehicle_count || 1,
          urgency_level: data.urgency_level || 'normal',
          status: 'pending'
        });

      if (error) throw error;

      toast.success(t('toast.reportSubmitted'));

      form.reset();
      onSuccess?.();
    } catch (error) {
      console.error('Error submitting report request:', error);
      toast.error(t('toast.reportError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const getReportTypeInfo = (type: string) => {
    switch (type) {
      case 'basic':
        return {
          name: 'Básico (DGT)',
          price: '15€',
          description: 'Informe oficial de la DGT con titularidad, cargas, ITV y kilometraje'
        };
      case 'technical':
        return {
          name: 'Técnico (Carfax)',
          price: '30€',
          description: 'Historial detallado: mantenimiento, siniestros y revisiones'
        };
      case 'premium':
        return {
          name: 'Premium (Carfax + Inspección)',
          price: 'Precio según presupuesto personalizado',
          description: 'Informe Carfax + revisión física de 126 puntos con fotos y vídeo. Recibirás un presupuesto personalizado según ubicación, urgencia y número de vehículos.'
        };
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('reports.form.title')}</CardTitle>
        <CardDescription>
          {t('reports.form.description')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Alert className="mb-6">
          <Info className="h-4 w-4" />
          <AlertDescription>
            {t('reports.form.availabilityNotice')}
          </AlertDescription>
        </Alert>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="vehicle_plate">
                {t('reports.form.vehicleId')} *
              </Label>
              <Input
                id="vehicle_plate"
                placeholder="1234ABC"
                {...form.register('vehicle_plate')}
                className="uppercase"
              />
              {form.formState.errors.vehicle_plate && (
                <p className="text-sm text-red-500 mt-1">
                  {form.formState.errors.vehicle_plate.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="vehicle_brand">Marca *</Label>
              <Input
                id="vehicle_brand"
                placeholder="BMW, Mercedes, Audi..."
                {...form.register('vehicle_brand')}
              />
              {form.formState.errors.vehicle_brand && (
                <p className="text-sm text-red-500 mt-1">
                  {form.formState.errors.vehicle_brand.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="vehicle_model">Modelo *</Label>
              <Input
                id="vehicle_model"
                placeholder="X5, C-Class, A4..."
                {...form.register('vehicle_model')}
              />
              {form.formState.errors.vehicle_model && (
                <p className="text-sm text-red-500 mt-1">
                  {form.formState.errors.vehicle_model.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="vehicle_year">Año *</Label>
              <Input
                id="vehicle_year"
                type="number"
                placeholder="2020"
                {...form.register('vehicle_year')}
              />
              {form.formState.errors.vehicle_year && (
                <p className="text-sm text-red-500 mt-1">
                  {form.formState.errors.vehicle_year.message}
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="vehicle_location">Ubicación del vehículo *</Label>
              <Input
                id="vehicle_location"
                placeholder="Madrid, Barcelona, Valencia..."
                {...form.register('vehicle_location')}
              />
              {form.formState.errors.vehicle_location && (
                <p className="text-sm text-red-500 mt-1">
                  {form.formState.errors.vehicle_location.message}
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="report_type">
                {t('reports.form.reportType')} *
              </Label>
              <Select
                value={form.watch('report_type')}
                onValueChange={(value) => {
                  form.setValue('report_type', value as any);
                  setSelectedType(value);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona el tipo de informe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">{t('inspection.basic.title')} - {t('inspection.basic.price')}</SelectItem>
                  <SelectItem value="technical">{t('inspection.standard.title')} - {t('inspection.standard.price')}</SelectItem>
                  <SelectItem value="premium">{t('inspection.premium.title')} - {t('inspection.premium.price')}</SelectItem>
                  <SelectItem value="dgt">{t('inspection.extras.dgt')} - {t('inspection.extras.dgt.price')}</SelectItem>
                  <SelectItem value="carfax">{t('inspection.extras.carfax')} - {t('inspection.extras.carfax.price')}</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.report_type && (
                <p className="text-sm text-red-500 mt-1">
                  {form.formState.errors.report_type.message}
                </p>
              )}
            </div>

            {selectedType && (
              <div className="md:col-span-2">
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    <strong>{getReportTypeInfo(selectedType)?.name}</strong> - {getReportTypeInfo(selectedType)?.price}
                    <br />
                    {getReportTypeInfo(selectedType)?.description}
                  </AlertDescription>
                </Alert>
              </div>
            )}

            {selectedType === 'premium' && (
              <>
                <div className="md:col-span-2">
                  <Alert variant="default" className="border-orange-500">
                    <AlertCircle className="h-4 w-4 text-orange-500" />
                    <AlertDescription>
                      <strong>Nota importante:</strong> {t('reports.form.premiumWarning')}
                    </AlertDescription>
                  </Alert>
                </div>

                <div>
                  <Label htmlFor="vehicle_count">{t('reports.form.vehicleCount')}</Label>
                  <Input
                    id="vehicle_count"
                    type="number"
                    min="1"
                    max="50"
                    placeholder="1"
                    {...form.register('vehicle_count')}
                  />
                  {form.formState.errors.vehicle_count && (
                    <p className="text-sm text-red-500 mt-1">
                      {form.formState.errors.vehicle_count.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="urgency_level">Nivel de urgencia</Label>
                  <Select
                    value={form.watch('urgency_level')}
                    onValueChange={(value) => form.setValue('urgency_level', value as any)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona urgencia" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Normal (7-10 días)</SelectItem>
                      <SelectItem value="urgent">Urgente (3-5 días)</SelectItem>
                      <SelectItem value="very_urgent">Muy Urgente (1-2 días)</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.urgency_level && (
                    <p className="text-sm text-red-500 mt-1">
                      {form.formState.errors.urgency_level.message}
                    </p>
                  )}
                </div>
              </>
            )}

            <div className="md:col-span-2">
              <Label htmlFor="observations">
                {t('reports.form.comments')}
              </Label>
              <Textarea
                id="observations"
                placeholder="Añade cualquier información adicional que consideres relevante..."
                {...form.register('observations')}
                rows={4}
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Enviando solicitud...' : t('reports.form.submit')}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};