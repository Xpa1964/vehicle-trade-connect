import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { AlertCircle, CheckCircle, Clock, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { es, fr, de, it, pt, pl, enUS } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';

const APISyncStatusBanner: React.FC = () => {
  const { t, currentLanguage } = useLanguage();
  const navigate = useNavigate();

  const localeMap: Record<string, any> = {
    es, fr, de, it, pt, pl, en: enUS
  };

  const { data: lastSync, isLoading } = useQuery({
    queryKey: ['last-api-sync'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      // Get user's API key IDs first
      const { data: keys } = await supabase
        .from('api_keys')
        .select('id')
        .eq('user_id', user.id);

      if (!keys || keys.length === 0) return null;

      const keyIds = keys.map(k => k.id);

      // Get the most recent sync log
      const { data, error } = await supabase
        .from('api_sync_logs')
        .select('*')
        .in('api_key_id', keyIds)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data;
    }
  });

  if (isLoading) return null;

  const locale = localeMap[currentLanguage] || enUS;

  // No sync yet
  if (!lastSync) {
    return (
      <div className="bg-muted/50 border border-border rounded-lg p-4 flex items-center gap-3">
        <Clock className="h-5 w-5 text-muted-foreground flex-shrink-0" />
        <p className="text-sm text-muted-foreground flex-1">
          {t('api.sync.noSyncs')}
        </p>
      </div>
    );
  }

  const hasErrors = (lastSync.error_count ?? 0) > 0;
  const syncDate = lastSync.created_at ? format(new Date(lastSync.created_at), 'dd MMM yyyy, HH:mm', { locale }) : '—';
  const totalVehicles = lastSync.vehicle_count ?? 0;
  const successCount = lastSync.success_count ?? 0;
  const errorCount = lastSync.error_count ?? 0;

  return (
    <div className={`border rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3 ${
      hasErrors 
        ? 'bg-destructive/5 border-destructive/20' 
        : 'bg-accent/50 border-border'
    }`}>
      {hasErrors ? (
        <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0" />
      ) : (
        <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
      )}
      
      <div className="flex-1 space-y-1">
        <p className="text-sm font-medium text-foreground">
          {t('api.sync.lastSync')}: {syncDate}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="text-xs">
            {totalVehicles} {t('api.sync.vehiclesProcessed')}
          </Badge>
          <Badge variant="secondary" className="text-xs">
            {successCount} {t('api.sync.success')}
          </Badge>
          {errorCount > 0 && (
            <Badge variant="destructive" className="text-xs">
              {errorCount} {t('api.sync.errors')}
            </Badge>
          )}
        </div>
      </div>

      {hasErrors && (
        <Button
          variant="ghost"
          size="sm"
          className="text-xs gap-1"
          onClick={() => navigate('/api-management')}
        >
          {t('api.sync.viewDetails')}
          <ArrowRight className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
};

export default APISyncStatusBanner;
