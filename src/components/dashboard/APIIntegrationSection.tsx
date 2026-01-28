import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Key, Plus, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import RequestAPIKeyDialog from './RequestAPIKeyDialog';

const APIIntegrationSection: React.FC = () => {
  const { t } = useLanguage();
  const [showRequestDialog, setShowRequestDialog] = useState(false);

  // Get user's API keys
  const { data: apiKeys } = useQuery({
    queryKey: ['my-api-keys'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('partner_api_keys')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    }
  });

  // Get user's pending requests
  const { data: requests } = useQuery({
    queryKey: ['my-api-key-requests'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('api_key_requests')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    }
  });

  const activeKeys = apiKeys?.filter(k => k.is_active) || [];
  const pendingRequests = requests?.filter(r => r.status === 'pending') || [];
  const canRequestMore = activeKeys.length < 5;

  const getMinimalStyles = () => ({
    card: 'card-minimal',
    iconContainer: 'icon-container-minimal',
    titleHover: 'group-hover:text-foreground'
  });

  const styles = getMinimalStyles();

  return (
    <>
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-foreground tracking-tight">
            {t('api.integration.title', { fallback: 'Integración API' })}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* API Status Card */}
          <Card className={`h-full transition-all duration-300 hover:scale-[1.01] ${styles.card}`}>
            <CardContent className="p-8">
              <div className="mb-6 flex justify-center">
                <div className={`transition-all duration-300 ${styles.iconContainer}`}>
                  <Key className="w-12 h-12 text-muted-foreground" strokeWidth={0.8} />
                </div>
              </div>
              <h4 className={`text-lg font-semibold text-foreground mb-4 text-center transition-colors duration-300`}>
                {t('api.integration.status', { fallback: 'Estado de APIs' })}
              </h4>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-muted/30 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>{t('api.card.activeKeys', { fallback: 'Activas' })}</span>
                  </div>
                  <div className="text-2xl font-bold">
                    {activeKeys.length}
                    <span className="text-sm text-muted-foreground font-normal">/5</span>
                  </div>
                </div>
                <div className="bg-muted/30 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <Clock className="h-4 w-4 text-orange-600" />
                    <span>{t('api.card.pendingRequests', { fallback: 'Pendientes' })}</span>
                  </div>
                  <div className="text-2xl font-bold">{pendingRequests.length}</div>
                </div>
              </div>

              <p className="text-sm text-gray-600 leading-relaxed text-center">
                {t('api.integration.description', { fallback: 'Gestiona tus API keys para sincronización automática de stock' })}
              </p>
            </CardContent>
          </Card>

          {/* Request/Recent Requests Card */}
          <Card className={`h-full transition-all duration-300 hover:scale-[1.01] ${styles.card}`}>
            <CardContent className="p-8">
              <div className="mb-6 flex justify-center">
                <div className={`transition-all duration-300 ${styles.iconContainer}`}>
                  <Plus className="w-12 h-12 text-muted-foreground" strokeWidth={0.8} />
                </div>
              </div>
              <h4 className={`text-lg font-semibold text-foreground mb-4 text-center transition-colors duration-300`}>
                {t('api.integration.requests', { fallback: 'Solicitudes' })}
              </h4>

              {/* Request Button */}
              {canRequestMore && (
                <div className="mb-6 flex justify-center">
                  <Button 
                    onClick={() => setShowRequestDialog(true)}
                    className="gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    {t('api.card.requestNew', { fallback: 'Solicitar Nueva API Key' })}
                  </Button>
                </div>
              )}

              {/* Recent requests */}
              {requests && requests.length > 0 ? (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-center mb-3">
                    {t('api.card.recentRequests', { fallback: 'Solicitudes Recientes' })}
                  </p>
                  <div className="space-y-2">
                    {requests.slice(0, 3).map((request) => (
                      <div key={request.id} className="flex items-center justify-between p-2 rounded bg-muted/30">
                        <div className="flex items-center gap-2">
                          {request.status === 'pending' && <Clock className="h-4 w-4 text-orange-500" />}
                          {request.status === 'approved' && <CheckCircle className="h-4 w-4 text-green-500" />}
                          {request.status === 'rejected' && <XCircle className="h-4 w-4 text-red-500" />}
                          <span className="text-sm font-medium truncate max-w-[120px]">{request.name}</span>
                        </div>
                        <Badge variant={
                          request.status === 'pending' ? 'secondary' :
                          request.status === 'approved' ? 'default' : 
                          'destructive'
                        } className="text-xs">
                          {t(`api.status.${request.status}`, { fallback: request.status })}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-600 text-center">
                  {t('api.integration.noRequests', { fallback: 'No hay solicitudes aún' })}
                </p>
              )}

              {/* Limit reached message */}
              {!canRequestMore && (
                <div className="mt-4 p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
                  <p className="text-xs text-orange-800 dark:text-orange-200 text-center">
                    {t('api.card.limitReached', { fallback: 'Límite de 5 API keys alcanzado' })}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <RequestAPIKeyDialog 
        open={showRequestDialog}
        onOpenChange={setShowRequestDialog}
      />
    </>
  );
};

export default APIIntegrationSection;
