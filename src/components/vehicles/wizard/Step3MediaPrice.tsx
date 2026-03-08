import React, { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { VehicleFormData } from '@/types/vehicle';
import { useLanguage } from '@/contexts/LanguageContext';
import { FileUpload } from '../form-sections/FileUpload';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Euro, FileText, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ImageHelpDrawer from './ImageHelpDrawer';

interface Step3MediaPriceProps {
  form: UseFormReturn<VehicleFormData>;
  onChange: (field: string, value: string | number) => void;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  previewUrl: string | null;
}

export const Step3MediaPrice: React.FC<Step3MediaPriceProps> = ({
  form,
  onChange,
  onImageChange,
  previewUrl,
}) => {
  const { t } = useLanguage();
  const formData = form.getValues();

  return (
    <div className="space-y-6">
      {/* Price & Status Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-bold">
            <Euro className="h-5 w-5" />
            {t('vehicles.priceAndStatus', { fallback: 'Precio y Estado' })}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>{t('vehicles.price')} (€) *</Label>
              <Input
                type="number"
                value={formData.price || ''}
                onChange={(e) => onChange('price', parseFloat(e.target.value) || 0)}
                placeholder="25000"
                min="0"
                step="0.01"
                className="text-lg font-semibold"
              />
            </div>
            <div className="space-y-2">
              <Label>{t('vehicles.mileage')} *</Label>
              <Input
                type="number"
                value={formData.mileage || ''}
                onChange={(e) => onChange('mileage', parseInt(e.target.value) || 0)}
                placeholder="50000"
                min="0"
              />
            </div>
            <div className="space-y-2">
              <Label>{t('vehicles.status')}</Label>
              <Select
                value={formData.status || 'available'}
                onValueChange={(v) => onChange('status', v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">{t('vehicles.statusAvailable')}</SelectItem>
                  <SelectItem value="reserved">{t('vehicles.statusReserved')}</SelectItem>
                  <SelectItem value="sold">{t('vehicles.statusSold')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Description */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-bold">
            <FileText className="h-5 w-5" />
            {t('vehicles.description', { fallback: 'Descripción' })}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={formData.description || ''}
            onChange={(e) => onChange('description', e.target.value)}
            placeholder={t('vehicles.additionalDescriptionPlaceholder')}
            className="min-h-[120px]"
          />
        </CardContent>
      </Card>

      {/* Media Upload - reuse existing FileUpload */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-lg font-bold">
              {t('vehicles.images')}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full text-muted-foreground hover:text-primary"
              onClick={() => setHelpOpen(true)}
              aria-label={t('vehicles.imageHelp.title')}
            >
              <HelpCircle className="h-5 w-5" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <FileUpload
            form={form}
            onImageChange={onImageChange}
            previewUrl={previewUrl}
          />
        </CardContent>
      </Card>
    </div>
  );
};
