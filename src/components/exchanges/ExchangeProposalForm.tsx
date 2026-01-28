import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useConversations } from '@/hooks/useConversations';
import { ArrowLeft, Car, PlusCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import VehicleComparisonCard from '@/components/exchanges/VehicleComparisonCard';
import { toast } from 'sonner';
import { Vehicle } from '@/types/vehicle';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Define form schema
const exchangeProposalSchema = z.object({
  offeredVehicleId: z.string().min(1, { message: "Please select a vehicle to offer" }),
  compensation: z.coerce.number().min(0, { message: "Compensation cannot be negative" }).optional(),
  conditions: z.string().optional(),
});

type ExchangeProposalFormValues = z.infer<typeof exchangeProposalSchema>;

interface ExchangeProposalFormProps {
  targetVehicleId?: string;
  sellerId?: string;
  onClose?: () => void;
}

export const ExchangeProposalForm: React.FC<ExchangeProposalFormProps> = ({
  targetVehicleId,
  sellerId,
  onClose
}) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { startConversation, sendMessage } = useConversations();
  const [userVehicles, setUserVehicles] = useState<Vehicle[]>([]);
  const [targetVehicle, setTargetVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('select-vehicle');
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  // Form setup
  const form = useForm<ExchangeProposalFormValues>({
    resolver: zodResolver(exchangeProposalSchema),
    defaultValues: {
      offeredVehicleId: '',
      compensation: 0,
      conditions: '',
    },
  });

  // Fetch user's vehicles
  useEffect(() => {
    const fetchUserVehicles = async () => {
      if (!user?.id) return;
      
      try {
        const { data, error } = await supabase
          .from('vehicles')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'available');
          
        if (error) throw error;
        
        // Map the database results to match the Vehicle type
        const mappedVehicles: Vehicle[] = (data || []).map(vehicle => ({
          ...vehicle,
          // Add required properties from Vehicle type with default values
          fuel: 'unknown',
          transmission: 'unknown',
          countryCode: vehicle.country_code || 'es',
          thumbnailUrl: vehicle.thumbnailurl || '',
          mileageUnit: 'km',
          acceptsExchange: true,
          currency: 'EUR'
        }));
        
        setUserVehicles(mappedVehicles);
      } catch (error) {
        console.error('Error fetching user vehicles:', error);
        toast.error(t('common.error'), {
          description: t('vehicles.errorFetchingVehicles')
        });
      }
    };
    
    fetchUserVehicles();
  }, [user?.id, t]);
  
  // Fetch target vehicle details if ID is provided
  useEffect(() => {
    const fetchTargetVehicle = async () => {
      if (!targetVehicleId) return;
      
      try {
        const { data, error } = await supabase
          .from('vehicles')
          .select('*')
          .eq('id', targetVehicleId)
          .single();
          
        if (error) throw error;
        
        if (data) {
          // Map the database result to match the Vehicle type
          const mappedVehicle: Vehicle = {
            ...data,
            // Add required properties from Vehicle type with default values
            fuel: 'unknown',
            transmission: 'unknown',
            countryCode: data.country_code || 'es',
            thumbnailUrl: data.thumbnailurl || '',
            mileageUnit: 'km',
            acceptsExchange: true,
            currency: 'EUR'
          };
          
          setTargetVehicle(mappedVehicle);
        } else {
          setTargetVehicle(null);
        }
      } catch (error) {
        console.error('Error fetching target vehicle:', error);
      }
    };
    
    fetchTargetVehicle();
  }, [targetVehicleId]);
  
  // Update selectedVehicle when form value changes
  useEffect(() => {
    const vehicleId = form.watch('offeredVehicleId');
    if (vehicleId) {
      const selected = userVehicles.find(v => v.id === vehicleId) || null;
      setSelectedVehicle(selected);
    } else {
      setSelectedVehicle(null);
    }
  }, [form.watch('offeredVehicleId'), userVehicles]);

  const onSubmit = async (values: ExchangeProposalFormValues) => {
    if (!user?.id || !targetVehicleId || !sellerId) {
      toast.error(t('common.error'), {
        description: t('exchanges.missingInformation')
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // Find offered vehicle details
      const offeredVehicle = userVehicles.find(v => v.id === values.offeredVehicleId);
      
      if (!offeredVehicle) {
        throw new Error('Selected vehicle not found');
      }
      
      // Create or get conversation
      const conversation = await startConversation(
        sellerId,
        targetVehicleId,
        {
          sourceType: 'exchange',
          sourceId: targetVehicleId,
          sourceTitle: targetVehicle ? `${targetVehicle.brand} ${targetVehicle.model} ${targetVehicle.year}` : undefined
        }
      );
      
      if (!conversation) {
        throw new Error('Failed to start conversation');
      }
      
      // Create exchange proposal message
      const proposalData = {
        type: 'exchange_proposal',
        offeredVehicleId: values.offeredVehicleId,
        offeredVehicleDetails: {
          brand: offeredVehicle.brand,
          model: offeredVehicle.model,
          year: offeredVehicle.year,
          price: offeredVehicle.price,
          thumbnailUrl: offeredVehicle.thumbnailUrl || '',
          mileage: offeredVehicle.mileage,
          location: offeredVehicle.location || offeredVehicle.country || '',
          condition: offeredVehicle.condition
        },
        requestedVehicleId: targetVehicleId,
        compensation: values.compensation || 0,
        conditions: values.conditions || '',
        status: 'pending'
      };
      
      // Send the proposal as a message
      const messageContent = JSON.stringify(proposalData);
      await sendMessage(conversation.id, messageContent);
      
      toast.success(t('exchanges.proposalSent'), {
        description: t('exchanges.proposalSentDescription')
      });
      
      // Navigate to messages with this conversation open
      navigate(`/messages?conversation=${conversation.id}`);
    } catch (error) {
      console.error('Error sending exchange proposal:', error);
      toast.error(t('common.error'), {
        description: t('exchanges.errorSendingProposal')
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (onClose) {
      onClose();
    } else {
      navigate(-1);
    }
  };
  
  const handleAddVehicle = () => {
    // Save form data to local storage or context if needed
    navigate('/vehicles/add?returnTo=/exchanges/propose');
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center mb-2">
          <Button variant="ghost" size="icon" onClick={handleBack} className="mr-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <CardTitle>{t('exchanges.proposeExchange')}</CardTitle>
        </div>
        <CardDescription>
          {targetVehicle ? (
            <span>
              {t('exchanges.proposeExchangeFor').replace('{vehicle}', `${targetVehicle.brand} ${targetVehicle.model} ${targetVehicle.year}`)}
            </span>
          ) : (
            t('exchanges.selectVehicleToExchange')
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
          <TabsList className="mb-4">
            <TabsTrigger value="select-vehicle">
              {t('exchanges.selectVehicle')}
            </TabsTrigger>
            <TabsTrigger value="preview" disabled={!selectedVehicle}>
              {t('exchanges.preview')}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="select-vehicle">
            <Form {...form}>
              <form className="space-y-6">
                <FormField
                  control={form.control}
                  name="offeredVehicleId"
                  render={({ field }) => (
                    <FormItem className="mb-4">
                      <FormLabel>{t('exchanges.selectVehicleToOffer')}</FormLabel>
                      <div className="flex items-center space-x-2">
                        <FormControl className="flex-1">
                          <Select 
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            value={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder={t('exchanges.selectVehicle')} />
                            </SelectTrigger>
                            <SelectContent>
                              {userVehicles.length === 0 ? (
                                <SelectItem value="no-vehicles" disabled>
                                  {t('exchanges.noVehiclesAvailable')}
                                </SelectItem>
                              ) : (
                                userVehicles.map((vehicle) => (
                                  <SelectItem key={vehicle.id} value={vehicle.id}>
                                    {vehicle.brand} {vehicle.model} ({vehicle.year})
                                  </SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="icon"
                          onClick={handleAddVehicle}
                          title={t('vehicles.addVehicle')}
                        >
                          <PlusCircle className="h-4 w-4" />
                        </Button>
                      </div>
                      {userVehicles.length === 0 && (
                        <FormDescription>
                          {t('exchanges.addVehicleFirst')}
                        </FormDescription>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="compensation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('exchanges.compensation')} (€)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="0" 
                          {...field}
                          onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                          min="0"
                        />
                      </FormControl>
                      <FormDescription>
                        {t('exchanges.compensationDescription')}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="conditions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('exchanges.additionalConditions')}</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder={t('exchanges.conditionsPlaceholder')}
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {t('exchanges.conditionsDescription')}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {selectedVehicle && targetVehicle && (
                  <div className="mt-6">
                    <Button 
                      type="button" 
                      variant="secondary"
                      onClick={() => setActiveTab('preview')}
                      className="w-full"
                    >
                      {t('exchanges.previewProposal')}
                    </Button>
                  </div>
                )}
              </form>
            </Form>
          </TabsContent>
          
          <TabsContent value="preview">
            {selectedVehicle && targetVehicle && (
              <div className="mb-6">
                <VehicleComparisonCard 
                  offeredVehicle={selectedVehicle}
                  requestedVehicle={targetVehicle}
                  compensation={form.getValues('compensation') || 0}
                  conditions={form.getValues('conditions')}
                  status="pending"
                  onViewDetails={() => {}}
                />
                <div className="mt-4 flex justify-end">
                  <Button 
                    variant="secondary" 
                    onClick={() => setActiveTab('select-vehicle')} 
                    className="mr-2"
                  >
                    {t('common.edit')}
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handleBack}>
          {t('common.cancel')}
        </Button>
        <Button 
          onClick={form.handleSubmit(onSubmit)}
          disabled={loading || userVehicles.length === 0 || !form.getValues('offeredVehicleId')}
          className="ml-2"
        >
          {loading ? t('common.sending') : t('exchanges.sendProposal')}
        </Button>
      </CardFooter>
    </Card>
  );
};
