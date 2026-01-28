
import React, { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Trash2, AlertTriangle, Wrench, Home } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { VehicleFormData } from '@/types/vehicle';
import { DamageEditor } from './DamageEditor';

interface DamagesSectionProps {
  form: UseFormReturn<VehicleFormData>;
}

export const DamagesSection: React.FC<DamagesSectionProps> = ({ form }) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'exterior' | 'interior' | 'mechanical'>('exterior');
  const [editingDamage, setEditingDamage] = useState<string | null>(null);

  const damages = form.watch('damages') || [];

  const getDamagesByType = (type: 'exterior' | 'interior' | 'mechanical') => {
    return damages.filter(damage => damage.damage_type === type);
  };

  const addDamage = (type: 'exterior' | 'interior' | 'mechanical') => {
    const newDamage = {
      id: Date.now().toString(),
      damage_type: type,
      title: '',
      description: '',
      severity: 'minor' as const,
      location: '',
      estimated_cost: undefined,
      images: []
    };

    const currentDamages = form.getValues('damages') || [];
    form.setValue('damages', [...currentDamages, newDamage]);
    setEditingDamage(newDamage.id);
  };

  const removeDamage = (damageId: string) => {
    const currentDamages = form.getValues('damages') || [];
    const filteredDamages = currentDamages.filter(damage => damage.id !== damageId);
    form.setValue('damages', filteredDamages);
  };

  const updateDamage = (damageId: string, updatedDamage: any) => {
    const currentDamages = form.getValues('damages') || [];
    const updatedDamages = currentDamages.map(damage => 
      damage.id === damageId ? { ...damage, ...updatedDamage } : damage
    );
    form.setValue('damages', updatedDamages);
  };

  const getTabIcon = (type: string) => {
    switch (type) {
      case 'exterior': return <AlertTriangle className="h-4 w-4" />;
      case 'mechanical': return <Wrench className="h-4 w-4" />;
      case 'interior': return <Home className="h-4 w-4" />;
      default: return null;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'minor': return 'bg-yellow-100 text-yellow-800';
      case 'moderate': return 'bg-orange-100 text-orange-800';
      case 'severe': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold mb-2">{t('vehicles.damages')}</h3>
        <p className="text-sm text-muted-foreground">
          {t('vehicles.damagesFormDescription')}
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="exterior" className="flex items-center gap-2">
            {getTabIcon('exterior')}
            {t('vehicles.exteriorDamages')}
            {getDamagesByType('exterior').length > 0 && (
              <Badge variant="secondary" className="ml-1">
                {getDamagesByType('exterior').length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="interior" className="flex items-center gap-2">
            {getTabIcon('interior')}
            {t('vehicles.interiorDamages')}
            {getDamagesByType('interior').length > 0 && (
              <Badge variant="secondary" className="ml-1">
                {getDamagesByType('interior').length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="mechanical" className="flex items-center gap-2">
            {getTabIcon('mechanical')}
            {t('vehicles.mechanicalDamages')}
            {getDamagesByType('mechanical').length > 0 && (
              <Badge variant="secondary" className="ml-1">
                {getDamagesByType('mechanical').length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="exterior" className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-medium">{t('vehicles.exteriorDamages')}</h4>
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={() => addDamage('exterior')}
            >
              <Plus className="h-4 w-4 mr-2" />
              {t('vehicles.addExteriorDamage')}
            </Button>
          </div>
          
          {getDamagesByType('exterior').length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center text-muted-foreground">
                {t('vehicles.noExteriorDamages')}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {getDamagesByType('exterior').map((damage) => (
                <Card key={damage.id}>
                  <CardContent className="p-4">
                    {editingDamage === damage.id ? (
                      <DamageEditor
                        damage={damage}
                        onSave={(updatedDamage) => {
                          updateDamage(damage.id!, updatedDamage);
                          setEditingDamage(null);
                        }}
                        onCancel={() => setEditingDamage(null)}
                      />
                    ) : (
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h5 className="font-medium">{damage.title || t('vehicles.noTitle')}</h5>
                            <Badge className={getSeverityColor(damage.severity)}>
                              {damage.severity}
                            </Badge>
                          </div>
                          {damage.description && (
                            <p className="text-sm text-muted-foreground mb-2">{damage.description}</p>
                          )}
                          {damage.location && (
                            <p className="text-xs text-muted-foreground">{t('vehicles.location')}: {damage.location}</p>
                          )}
                          {damage.estimated_cost && (
                            <p className="text-xs text-muted-foreground">{t('vehicles.estimatedCost')}: €{damage.estimated_cost}</p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingDamage(damage.id!)}
                          >
                            {t('common.edit')}
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeDamage(damage.id!)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="interior" className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-medium">{t('vehicles.interiorDamages')}</h4>
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={() => addDamage('interior')}
            >
              <Plus className="h-4 w-4 mr-2" />
              {t('vehicles.addInteriorDamage')}
            </Button>
          </div>
          
          {getDamagesByType('interior').length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center text-muted-foreground">
                {t('vehicles.noInteriorDamages')}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {getDamagesByType('interior').map((damage) => (
                <Card key={damage.id}>
                  <CardContent className="p-4">
                    {editingDamage === damage.id ? (
                      <DamageEditor
                        damage={damage}
                        onSave={(updatedDamage) => {
                          updateDamage(damage.id!, updatedDamage);
                          setEditingDamage(null);
                        }}
                        onCancel={() => setEditingDamage(null)}
                      />
                    ) : (
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h5 className="font-medium">{damage.title || t('vehicles.noTitle')}</h5>
                            <Badge className={getSeverityColor(damage.severity)}>
                              {damage.severity}
                            </Badge>
                          </div>
                          {damage.description && (
                            <p className="text-sm text-muted-foreground mb-2">{damage.description}</p>
                          )}
                          {damage.location && (
                            <p className="text-xs text-muted-foreground">{t('vehicles.location')}: {damage.location}</p>
                          )}
                          {damage.estimated_cost && (
                            <p className="text-xs text-muted-foreground">{t('vehicles.estimatedCost')}: €{damage.estimated_cost}</p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingDamage(damage.id!)}
                          >
                            {t('common.edit')}
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeDamage(damage.id!)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="mechanical" className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-medium">{t('vehicles.mechanicalDamages')}</h4>
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={() => addDamage('mechanical')}
            >
              <Plus className="h-4 w-4 mr-2" />
              {t('vehicles.addMechanicalDamage')}
            </Button>
          </div>
          
          {getDamagesByType('mechanical').length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center text-muted-foreground">
                {t('vehicles.noMechanicalDamages')}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {getDamagesByType('mechanical').map((damage) => (
                <Card key={damage.id}>
                  <CardContent className="p-4">
                    {editingDamage === damage.id ? (
                      <DamageEditor
                        damage={damage}
                        onSave={(updatedDamage) => {
                          updateDamage(damage.id!, updatedDamage);
                          setEditingDamage(null);
                        }}
                        onCancel={() => setEditingDamage(null)}
                      />
                    ) : (
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h5 className="font-medium">{damage.title || t('vehicles.noTitle')}</h5>
                            <Badge className={getSeverityColor(damage.severity)}>
                              {damage.severity}
                            </Badge>
                          </div>
                          {damage.description && (
                            <p className="text-sm text-muted-foreground mb-2">{damage.description}</p>
                          )}
                          {damage.location && (
                            <p className="text-xs text-muted-foreground">{t('vehicles.location')}: {damage.location}</p>
                          )}
                          {damage.estimated_cost && (
                            <p className="text-xs text-muted-foreground">{t('vehicles.estimatedCost')}: €{damage.estimated_cost}</p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingDamage(damage.id!)}
                          >
                            {t('common.edit')}
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeDamage(damage.id!)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
