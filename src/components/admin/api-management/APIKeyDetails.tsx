import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { format } from 'date-fns';
import { es, fr, it, pt, de, pl } from 'date-fns/locale';
import { enUS } from 'date-fns/locale';
import { useAPISyncLogs } from '@/hooks/useAPISyncLogs';

interface APIKeyDetailsProps {
  apiKey: {
    id: string;
    name: string;
    api_key: string;
    is_active: boolean;
    created_at: string;
    last_used_at: string | null;
    request_count: number;
    user_email?: string;
    company_name?: string;
    rate_limit_per_hour?: number;
    expires_at?: string | null;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const APIKeyDetails: React.FC<APIKeyDetailsProps> = ({ apiKey, open, onOpenChange }) => {
  const { t, currentLanguage } = useLanguage();
  const { logs, isLoading } = useAPISyncLogs(apiKey.id);

  const localeMap: Record<string, any> = {
    es, en: enUS, fr, it, pt, de, pl,
    dk: enUS, no: enUS, se: enUS
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{apiKey.name}</DialogTitle>
          <DialogDescription>{apiKey.company_name}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t('api.details.status')}</p>
                <Badge variant={apiKey.is_active ? "default" : "secondary"}>
                  {apiKey.is_active ? t('api.status.active') : t('api.status.inactive')}
                </Badge>
              </div>
              
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t('api.details.requests')}</p>
                <p className="text-lg font-semibold">{apiKey.request_count}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">{t('api.details.rateLimit')}</p>
                <p className="text-sm">{apiKey.rate_limit_per_hour || 100} / hora</p>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">{t('api.details.created')}</p>
                <p className="text-sm">
                  {format(new Date(apiKey.created_at), 'PPP', { locale: localeMap[currentLanguage] || enUS })}
                </p>
              </div>

              {apiKey.last_used_at && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t('api.details.lastUsed')}</p>
                  <p className="text-sm">
                    {format(new Date(apiKey.last_used_at), 'PPpp', { locale: localeMap[currentLanguage] || enUS })}
                  </p>
                </div>
              )}

              {apiKey.expires_at && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t('api.details.expires')}</p>
                  <p className="text-sm">
                    {format(new Date(apiKey.expires_at), 'PPP', { locale: localeMap[currentLanguage] || enUS })}
                  </p>
                </div>
              )}
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">{t('api.details.apiKey')}</p>
              <code className="block p-3 bg-muted rounded text-xs break-all">
                {apiKey.api_key}
              </code>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">{t('api.details.syncHistory')}</h3>
            {isLoading ? (
              <div className="space-y-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-16 bg-muted animate-pulse rounded" />
                ))}
              </div>
            ) : logs && logs.length > 0 ? (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {logs.map((log) => (
                  <div key={log.id} className="border border-border rounded p-3 text-sm">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-medium">{log.action}</span>
                      <Badge variant={log.error_count > 0 ? "destructive" : "default"}>
                        {log.success_count}/{log.vehicle_count}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(log.created_at), 'PPpp', { locale: localeMap[currentLanguage] || enUS })}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">{t('api.details.noHistory')}</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default APIKeyDetails;
