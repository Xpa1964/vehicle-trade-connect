
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useExchangeVehicles } from '@/hooks/useExchangeVehicles';
import { Vehicle } from '@/types/vehicle';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from '@/components/ui/card';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Car, Plus, ArrowRight } from 'lucide-react';

// Schema for selecting an existing vehicle
const existingVehicleSchema = z.object({
  vehicleId: z.string().min(1, "Debe seleccionar un vehículo"),
  acceptBrands: z.string().min(1, "Las marcas de interés son obligatorias"),
  acceptCountries: z.string().min(1, "Los países de origen son obligatorios")
});

// Schema for entering a new vehicle
const newVehicleSchema = z.object({
  offerBrand: z.string().min(1, "La marca es obligatoria"),
  offerModel: z.string().min(1, "El modelo es obligatorio"),
  offerYear: z.string().min(1, "El año es obligatorio"),
  offerKilometers: z.string().min(1, "Los kilómetros son obligatorios"),
  acceptBrands: z.string().min(1, "Las marcas de interés son obligatorias"),
  acceptCountries: z.string().min(1, "Los países de origen son obligatorios")
});

export const ExchangeRequestForm = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<"existing" | "new">("existing");
  const { userVehicles, fetchUserVehicles, isLoading } = useExchangeVehicles();

  // Create two separate forms for each tab
  const existingVehicleForm = useForm<z.infer<typeof existingVehicleSchema>>({
    resolver: zodResolver(existingVehicleSchema),
    defaultValues: {
      vehicleId: '',
      acceptBrands: '',
      acceptCountries: '',
    }
  });

  const newVehicleForm = useForm<z.infer<typeof newVehicleSchema>>({
    resolver: zodResolver(newVehicleSchema),
    defaultValues: {
      offerBrand: '',
      offerModel: '',
      offerYear: '',
      offerKilometers: '',
      acceptBrands: '',
      acceptCountries: '',
    }
  });

  // Fetch user's vehicles on component mount
  useEffect(() => {
    if (user) {
      fetchUserVehicles(user.id);
    }
  }, [user]);

  const handleTabChange = (value: string) => {
    setActiveTab(value as "existing" | "new");
  };

  const onSubmitExistingVehicle = async (data: z.infer<typeof existingVehicleSchema>) => {
    if (!user) {
      toast.error(t('auth.loginRequired'));
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const selectedVehicle = userVehicles.find(v => v.id === data.vehicleId);
      if (!selectedVehicle) {
        throw new Error("Vehicle not found");
      }

      const exchangeData = {
        initiator_id: user.id,
        status: 'pending',
        initiator_vehicle_id: data.vehicleId,
        target_preferences: {
          brands: data.acceptBrands,
          countries: data.acceptCountries
        }
      };
      
      const { error } = await supabase
        .from('exchanges')
        .insert(exchangeData);
      
      if (error) throw error;
      
      toast.success(t('exchanges.exchangeAddedTitle'), {
        description: t('exchanges.exchangeAddedDescription')
      });
      
      navigate('/exchanges');
    } catch (error) {
      console.error('Error submitting exchange request:', error);
      toast.error(t('common.error'), {
        description: t('exchanges.exchangeErrorDescription')
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmitNewVehicle = async (data: z.infer<typeof newVehicleSchema>) => {
    if (!user) {
      toast.error(t('auth.loginRequired'));
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const exchangeData = {
        initiator_id: user.id,
        status: 'pending',
        initiator_vehicle: {
          brand: data.offerBrand,
          model: data.offerModel,
          year: data.offerYear,
          kilometers: data.offerKilometers
        },
        target_preferences: {
          brands: data.acceptBrands,
          countries: data.acceptCountries
        }
      };
      
      const { error } = await supabase
        .from('exchanges')
        .insert(exchangeData);
      
      if (error) throw error;
      
      toast.success(t('exchanges.exchangeAddedTitle'), {
        description: t('exchanges.exchangeAddedDescription')
      });
      
      navigate('/exchanges');
    } catch (error) {
      console.error('Error submitting exchange request:', error);
      toast.error(t('common.error'), {
        description: t('exchanges.exchangeErrorDescription')
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-xl font-semibold mb-3 text-primary">
          {t('exchanges.chooseOptionTitle')}
        </h2>
        <p className="text-muted-foreground">
          {t('exchanges.chooseOptionDescription')}
        </p>
      </div>
      
      <Tabs
        defaultValue="existing" 
        value={activeTab}
        onValueChange={handleTabChange} 
        className="w-full"
      >
        <TabsList className="grid grid-cols-2 w-full h-16 p-1 bg-muted/50">
          <TabsTrigger 
            value="existing"
            className="flex flex-col items-center gap-2 p-4 h-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Car className="h-5 w-5" />
            <span className="text-sm font-medium">{t('exchanges.selectExistingVehicle')}</span>
          </TabsTrigger>
          <TabsTrigger 
            value="new"
            className="flex flex-col items-center gap-2 p-4 h-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          >
            <Plus className="h-5 w-5" />
            <span className="text-sm font-medium">{t('exchanges.enterNewVehicle')}</span>
          </TabsTrigger>
        </TabsList>
        
        {/* Tab for selecting an existing vehicle */}
        <TabsContent value="existing" className="space-y-4 mt-6">
          <Card>
            <CardContent className="pt-6">
              <Form {...existingVehicleForm}>
                <form onSubmit={existingVehicleForm.handleSubmit(onSubmitExistingVehicle)} className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">{t('exchanges.offering')}</h3>
                    <FormField
                      control={existingVehicleForm.control}
                      name="vehicleId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('exchanges.selectVehicleToOffer')}</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value} 
                            disabled={isLoading || userVehicles.length === 0}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder={t('exchanges.selectVehicle')} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {userVehicles.map((vehicle) => (
                                <SelectItem key={vehicle.id} value={vehicle.id}>
                                  {vehicle.brand} {vehicle.model} ({vehicle.year})
                                </SelectItem>
                              ))}
                              {userVehicles.length === 0 && (
                                <SelectItem value="none" disabled>
                                  {t('exchanges.noVehiclesAvailable')}
                                </SelectItem>
                              )}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                          {userVehicles.length === 0 && (
                            <FormDescription>
                              {t('exchanges.noVehiclesToOffer')}
                            </FormDescription>
                          )}
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="space-y-4 pt-4">
                    <h3 className="text-lg font-medium">{t('exchanges.accepting')}</h3>
                    <FormField
                      control={existingVehicleForm.control}
                      name="acceptBrands"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('exchanges.brandsInterest')}</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder={t('exchanges.brandsPlaceholder')} 
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            {t('exchanges.acceptingDescription')}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={existingVehicleForm.control}
                      name="acceptCountries"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('exchanges.countriesOrigin')}</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder={t('exchanges.countriesPlaceholder')} 
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isSubmitting || userVehicles.length === 0}
                  >
                    {isSubmitting ? t('common.loading') : t('exchanges.publishRequest')}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Tab for entering a new vehicle */}
        <TabsContent value="new" className="space-y-4 mt-6">
          <Card>
            <CardContent className="pt-6">
              <Form {...newVehicleForm}>
                <form onSubmit={newVehicleForm.handleSubmit(onSubmitNewVehicle)} className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">{t('exchanges.offering')}</h3>
                    <FormField
                      control={newVehicleForm.control}
                      name="offerBrand"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('exchanges.brand')}</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder={t('exchanges.brandPlaceholder')} 
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={newVehicleForm.control}
                      name="offerModel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('exchanges.model')}</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder={t('exchanges.modelPlaceholder')} 
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={newVehicleForm.control}
                        name="offerYear"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('exchanges.year')}</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder={t('exchanges.yearPlaceholder')} 
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={newVehicleForm.control}
                        name="offerKilometers"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('exchanges.kilometers')}</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder={t('exchanges.kilometersPlaceholder')} 
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="space-y-4 pt-4">
                    <h3 className="text-lg font-medium">{t('exchanges.accepting')}</h3>
                    <FormField
                      control={newVehicleForm.control}
                      name="acceptBrands"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('exchanges.brandsInterest')}</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder={t('exchanges.brandsPlaceholder')} 
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            {t('exchanges.acceptingDescription')}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={newVehicleForm.control}
                      name="acceptCountries"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('exchanges.countriesOrigin')}</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder={t('exchanges.countriesPlaceholder')} 
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? t('common.loading') : t('exchanges.publishRequest')}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
