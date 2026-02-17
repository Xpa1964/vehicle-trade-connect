
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

interface PrivacySettingsProps {
  initialSettings?: {
    show_contact_details?: boolean;
    show_location_details?: boolean;
    show_business_stats?: boolean;
  };
}

const PrivacySettings: React.FC<PrivacySettingsProps> = ({ initialSettings }) => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [settings, setSettings] = useState({
    show_contact_details: initialSettings?.show_contact_details ?? true,
    show_location_details: initialSettings?.show_location_details ?? false,
    show_business_stats: initialSettings?.show_business_stats ?? true,
  });
  const [saving, setSaving] = useState(false);

  const handleSettingChange = (key: keyof typeof settings, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const saveSettings = async () => {
    if (!user?.id) {
      toast.error(t('toast.privacyError'));
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update(settings)
        .eq('id', user.id);

      if (error) {
        console.error('Error updating privacy settings:', error);
        toast.error(t('toast.privacyError'));
        return;
      }

      toast.success(t('toast.privacyUpdated'));
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error(t('toast.privacyError'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuración de Privacidad</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="contact-details">Mostrar detalles de contacto</Label>
              <p className="text-sm text-muted-foreground">
                Permitir que otros usuarios vean tu teléfono y email de contacto
              </p>
            </div>
            <Switch
              id="contact-details"
              checked={settings.show_contact_details}
              onCheckedChange={(value) => handleSettingChange('show_contact_details', value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="location-details">Mostrar dirección completa</Label>
              <p className="text-sm text-muted-foreground">
                Mostrar dirección completa en lugar de solo país/ciudad
              </p>
            </div>
            <Switch
              id="location-details"
              checked={settings.show_location_details}
              onCheckedChange={(value) => handleSettingChange('show_location_details', value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="business-stats">Mostrar estadísticas de negocio</Label>
              <p className="text-sm text-muted-foreground">
                Permitir que otros vean tus estadísticas de ventas y operaciones
              </p>
            </div>
            <Switch
              id="business-stats"
              checked={settings.show_business_stats}
              onCheckedChange={(value) => handleSettingChange('show_business_stats', value)}
            />
          </div>
        </div>

        <div className="pt-4 border-t">
          <p className="text-sm text-muted-foreground mb-4">
            <strong>Nota:</strong> Las valoraciones y puntuación siempre serán visibles para mantener la confianza en el marketplace.
          </p>
          <Button onClick={saveSettings} disabled={saving}>
            {saving ? 'Guardando...' : 'Guardar Configuración'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PrivacySettings;
