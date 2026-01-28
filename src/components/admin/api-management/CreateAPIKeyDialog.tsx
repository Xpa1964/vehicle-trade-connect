import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCreateAPIKey } from '@/hooks/useCreateAPIKey';
import { useAllUsers } from '@/hooks/useAllUsers';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

interface CreateAPIKeyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateAPIKeyDialog: React.FC<CreateAPIKeyDialogProps> = ({ open, onOpenChange }) => {
  const { t } = useLanguage();
  const { users, isLoading: usersLoading } = useAllUsers();
  const createMutation = useCreateAPIKey();
  
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [keyName, setKeyName] = useState('');
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCreate = async () => {
    if (!selectedUserId || !keyName.trim()) {
      toast.error(t('api.create.fillAllFields'));
      return;
    }

    createMutation.mutate(
      { userId: selectedUserId, name: keyName },
      {
        onSuccess: (data) => {
          setGeneratedKey(data.api_key);
        }
      }
    );
  };

  const handleCopy = () => {
    if (generatedKey) {
      navigator.clipboard.writeText(generatedKey);
      setCopied(true);
      toast.success(t('api.create.copied'));
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClose = () => {
    setSelectedUserId('');
    setKeyName('');
    setGeneratedKey(null);
    setCopied(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('api.create.title')}</DialogTitle>
          <DialogDescription>{t('api.create.description')}</DialogDescription>
        </DialogHeader>

        {!generatedKey ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="user">{t('api.create.selectUser')}</Label>
              <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                <SelectTrigger id="user">
                  <SelectValue placeholder={t('api.create.selectUserPlaceholder')} />
                </SelectTrigger>
                <SelectContent>
                  {usersLoading ? (
                    <SelectItem value="loading" disabled>
                      {t('api.create.loadingUsers')}
                    </SelectItem>
                  ) : users && users.length > 0 ? (
                    users.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.company_name || user.email} ({user.email})
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="empty" disabled>
                      {t('api.create.noUsers')}
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">{t('api.create.keyName')}</Label>
              <Input
                id="name"
                value={keyName}
                onChange={(e) => setKeyName(e.target.value)}
                placeholder={t('api.create.keyNamePlaceholder')}
              />
            </div>

            <Button 
              onClick={handleCreate}
              disabled={createMutation.isPending || !selectedUserId || !keyName.trim()}
              className="w-full"
            >
              {createMutation.isPending ? t('api.create.creating') : t('api.create.generate')}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm font-medium text-green-800 mb-2">
                {t('api.create.success')}
              </p>
              <p className="text-xs text-green-700">
                {t('api.create.copyWarning')}
              </p>
            </div>

            <div className="space-y-2">
              <Label>{t('api.create.generatedKey')}</Label>
              <div className="flex gap-2">
                <code className="flex-1 p-3 bg-muted rounded text-xs break-all">
                  {generatedKey}
                </code>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCopy}
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <Button onClick={handleClose} className="w-full">
              {t('api.create.close')}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CreateAPIKeyDialog;
