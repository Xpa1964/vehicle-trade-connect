
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Vehicle } from '@/types/vehicle';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useExchangeVehicles } from '@/hooks/useExchangeVehicles';

interface VehicleSelectorDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectVehicle: (vehicle: Vehicle, compensation: number, conditions: string) => void;
  targetVehicle?: Vehicle;
}

const VehicleSelectorDialog: React.FC<VehicleSelectorDialogProps> = ({
  isOpen,
  onClose,
  onSelectVehicle,
  targetVehicle
}) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { userVehicles, isLoading, fetchUserVehicles } = useExchangeVehicles();
  
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [compensation, setCompensation] = useState<number>(0);
  const [conditions, setConditions] = useState<string>('');
  
  // Fetch user's vehicles when dialog opens
  useEffect(() => {
    if (isOpen && user?.id) {
      fetchUserVehicles(user.id);
    }
  }, [isOpen, user?.id, fetchUserVehicles]);
  
  const handleSubmit = () => {
    const selectedVehicle = userVehicles.find(v => v.id === selectedVehicleId);
    if (!selectedVehicle) {
      toast.error(t('exchanges.selectVehicleToOffer'));
      return;
    }
    
    onSelectVehicle(selectedVehicle, compensation, conditions);
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t('exchanges.proposeExchange')}</DialogTitle>
          <DialogDescription>
            {targetVehicle ? 
              t('exchanges.proposeExchangeFor', { vehicle: `${targetVehicle.brand} ${targetVehicle.model}` }) : 
              t('exchanges.selectVehicleToExchange')
            }
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-6">
          {isLoading ? (
            <div className="text-center p-4">{t('common.loading')}</div>
          ) : userVehicles.length === 0 ? (
            <div className="text-center p-4">
              <p>{t('exchanges.noVehiclesToOffer')}</p>
              <p className="text-sm text-muted-foreground mt-2">
                {t('exchanges.addVehicleFirst')}
              </p>
            </div>
          ) : (
            <>
              <div>
                <h3 className="mb-3 font-medium">{t('exchanges.selectVehicleToOffer')}</h3>
                <RadioGroup value={selectedVehicleId || ''} onValueChange={setSelectedVehicleId}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {userVehicles.map(vehicle => (
                      <div key={vehicle.id} className="relative flex items-center space-x-2 bg-slate-50 dark:bg-slate-800 p-3 rounded-lg">
                        <RadioGroupItem value={vehicle.id} id={`vehicle-${vehicle.id}`} />
                        <Label htmlFor={`vehicle-${vehicle.id}`} className="flex-1 cursor-pointer">
                          <div className="font-medium">
                            {vehicle.brand} {vehicle.model}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {vehicle.year} - {vehicle.price} €
                          </div>
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>
              
              <div className="space-y-3">
                <h3 className="font-medium">{t('exchanges.compensation')}</h3>
                <Input
                  type="number"
                  min="0"
                  value={compensation}
                  onChange={(e) => setCompensation(Number(e.target.value))}
                  placeholder="0"
                />
                <p className="text-sm text-muted-foreground">
                  {t('exchanges.compensationDescription')}
                </p>
              </div>
              
              <div className="space-y-3">
                <h3 className="font-medium">{t('exchanges.additionalConditions')}</h3>
                <Textarea
                  placeholder={t('exchanges.conditionsPlaceholder')}
                  value={conditions}
                  onChange={(e) => setConditions(e.target.value)}
                  rows={3}
                />
                <p className="text-sm text-muted-foreground">
                  {t('exchanges.conditionsDescription')}
                </p>
              </div>
            </>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>{t('common.cancel')}</Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isLoading || !selectedVehicleId || userVehicles.length === 0}
          >
            {t('exchanges.sendProposal')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default VehicleSelectorDialog;
