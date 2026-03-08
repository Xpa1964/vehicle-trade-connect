import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/contexts/LanguageContext';
import { useRequestAPIKey } from '@/hooks/useRequestAPIKey';
import { toast } from 'sonner';

interface RequestAPIKeyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const RequestAPIKeyDialog: React.FC<RequestAPIKeyDialogProps> = ({ open, onOpenChange }) => {
  const { t } = useLanguage();
  const requestMutation = useRequestAPIKey();
  
  const [keyName, setKeyName] = useState('');
  const [reason, setReason] = useState('');

  const handleSubmit = async () => {
    if (!keyName.trim()) {
      toast.error(t('api.request.nameRequired') || 'Please enter a key name');
      return;
    }

    requestMutation.mutate(
      { name: keyName, reason },
      {
        onSuccess: () => {
          setKeyName('');
          setReason('');
          onOpenChange(false);
        }
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('api.request.title') || 'Solicitar nueva API key'}</DialogTitle>
          <DialogDescription>
            {t('api.request.description') || 'Envía una solicitud para obtener una nueva API key. Un administrador revisará tu solicitud.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="keyName">
              {t('api.request.keyName') || 'Nombre de la key'} <span className="text-red-500">*</span>
            </Label>
            <Input
              id="keyName"
              value={keyName}
              onChange={(e) => setKeyName(e.target.value)}
              placeholder={t('api.request.keyNamePlaceholder') || 'e.g., Production API'}
              maxLength={50}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">
              {t('api.request.reason') || 'Reason (Optional)'}
            </Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={t('api.request.reasonPlaceholder') || 'Tell us why you need this API key...'}
              rows={4}
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground">
              {reason.length}/500
            </p>
          </div>

          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>{t('api.request.infoTitle') || 'Important'}:</strong>{' '}
              {t('api.request.infoMessage') || 'Your request will be reviewed by an administrator. You will be notified once approved.'}
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
              disabled={requestMutation.isPending}
            >
              {t('common.cancel') || 'Cancel'}
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={requestMutation.isPending || !keyName.trim()}
              className="flex-1"
            >
              {requestMutation.isPending 
                ? (t('api.request.submitting') || 'Submitting...') 
                : (t('api.request.submit') || 'Submit Request')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RequestAPIKeyDialog;
