import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import RequestAPIKeyDialog from './RequestAPIKeyDialog';
import apiKeysImage from '@/assets/api-keys-image.png';

const APIKeyCard: React.FC = () => {
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

  return (
    <>
      <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                <img 
                  src={apiKeysImage} 
                  alt="API Keys" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <CardTitle className="text-lg">API Keys</CardTitle>
                <CardDescription>
                  {t('api.card.subtitle') || 'Manage your API integration'}
                </CardDescription>
              </div>
            </div>
            {canRequestMore && (
              <Button 
                size="sm" 
                onClick={() => setShowRequestDialog(true)}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                {t('api.card.requestNew') || 'Request Key'}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-background/50 rounded-lg p-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <CheckCircle className="h-4 w-4 text-green-600" />
                {t('api.card.activeKeys') || 'Active Keys'}
              </div>
              <div className="text-2xl font-bold">
                {activeKeys.length}
                <span className="text-sm text-muted-foreground font-normal">/5</span>
              </div>
            </div>
            <div className="bg-background/50 rounded-lg p-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <Clock className="h-4 w-4 text-orange-600" />
                {t('api.card.pendingRequests') || 'Pending'}
              </div>
              <div className="text-2xl font-bold">{pendingRequests.length}</div>
            </div>
          </div>

          {/* Recent requests status */}
          {requests && requests.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">{t('api.card.recentRequests') || 'Recent Requests'}</p>
              <div className="space-y-2">
                {requests.slice(0, 3).map((request) => (
                  <div key={request.id} className="flex items-center justify-between p-2 rounded bg-background/50">
                    <div className="flex items-center gap-2">
                      {request.status === 'pending' && <Clock className="h-4 w-4 text-orange-500" />}
                      {request.status === 'approved' && <CheckCircle className="h-4 w-4 text-green-500" />}
                      {request.status === 'rejected' && <XCircle className="h-4 w-4 text-red-500" />}
                      <span className="text-sm font-medium">{request.name}</span>
                    </div>
                    <Badge variant={
                      request.status === 'pending' ? 'secondary' :
                      request.status === 'approved' ? 'default' : 
                      'destructive'
                    }>
                      {request.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Info message */}
          {!canRequestMore && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
              <AlertCircle className="h-4 w-4 text-orange-600 mt-0.5" />
              <p className="text-sm text-orange-800 dark:text-orange-200">
                {t('api.card.limitReached') || 'You have reached the maximum limit of 5 API keys'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <RequestAPIKeyDialog 
        open={showRequestDialog}
        onOpenChange={setShowRequestDialog}
      />
    </>
  );
};

export default APIKeyCard;
