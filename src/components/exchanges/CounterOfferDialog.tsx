
import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface CounterOfferDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (counterOffer: { compensation: number; conditions: string }) => Promise<void>;
  originalCompensation?: number;
  originalConditions?: string;
}

const CounterOfferDialog: React.FC<CounterOfferDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
  originalCompensation = 0,
  originalConditions = ''
}) => {
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [counterOfferData, setCounterOfferData] = useState({
    compensation: originalCompensation,
    conditions: originalConditions
  });

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onSubmit(counterOfferData);
      onOpenChange(false);
      // Reset form
      setCounterOfferData({
        compensation: originalCompensation,
        conditions: originalConditions
      });
    } catch (error) {
      console.error('Error submitting counter offer:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCounterOfferData(prev => ({
      ...prev,
      [name]: name === 'compensation' ? Number(value) : value
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('exchanges.counterOfferTitle')}</DialogTitle>
          <DialogDescription>
            {t('exchanges.counterOfferDescription')}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="compensation">
              {t('exchanges.compensation')} (€)
            </Label>
            <Input
              id="compensation"
              name="compensation"
              type="number"
              min="0"
              step="100"
              value={counterOfferData.compensation}
              onChange={handleChange}
              placeholder="0"
            />
            <p className="text-sm text-muted-foreground">
              {t('exchanges.compensationDescription')}
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="conditions">
              {t('exchanges.additionalConditions')}
            </Label>
            <Textarea
              id="conditions"
              name="conditions"
              value={counterOfferData.conditions}
              onChange={handleChange}
              placeholder={t('exchanges.conditionsPlaceholder')}
              rows={4}
            />
            <p className="text-sm text-muted-foreground">
              {t('exchanges.conditionsDescription')}
            </p>
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            {t('common.cancel')}
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting 
              ? t('common.loading') 
              : t('exchanges.sendCounterOffer', { fallback: 'Enviar Contraoferta' })
            }
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CounterOfferDialog;
