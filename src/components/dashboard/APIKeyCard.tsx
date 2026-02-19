import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Clock, CheckCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useStaticImage } from '@/hooks/useStaticImage';
import RequestAPIKeyDialog from './RequestAPIKeyDialog';

const APIKeyCard: React.FC = () => {
  const { t } = useLanguage();
  const [showRequestDialog, setShowRequestDialog] = useState(false);
  const { src } = useStaticImage('services.api');

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

  return (
    <>
      <div className="group overflow-hidden rounded-xl border border-border bg-[hsl(222,33%,13%)] text-card-foreground shadow-lg">
        {/* Image - same as DashboardServiceCard */}
        <div className="aspect-video overflow-hidden">
          <img
            src={src}
            alt="API Keys"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            decoding="async"
          />
        </div>

        {/* Content below image - matching dark style */}
        <div className="p-4 bg-[hsl(222,33%,10%)]">
          <h3 className="text-lg font-semibold text-foreground mb-2">API Keys</h3>
          
          {/* Mini stats */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
            <span className="flex items-center gap-1">
              <CheckCircle className="h-3.5 w-3.5 text-green-500" />
              {activeKeys.length}/5 {t('api.card.activeKeys', { fallback: 'Activas' })}
            </span>
            {pendingRequests.length > 0 && (
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-orange-500" />
                {pendingRequests.length} {t('api.card.pendingRequests', { fallback: 'Pendientes' })}
              </span>
            )}
          </div>

          {/* Buttons - matching DashboardServiceCard style */}
          <div className="flex gap-2">
            <Link to="/dashboard">
              <Button size="sm" variant="secondary" className="bg-primary/20 text-primary hover:bg-primary/30 border-primary/30">
                {t('common.view', { fallback: 'Ver' })}
              </Button>
            </Link>
            {activeKeys.length < 5 && (
              <Button
                size="sm"
                variant="outline"
                className="border-border text-muted-foreground hover:bg-secondary hover:text-foreground gap-1"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowRequestDialog(true);
                }}
              >
                <Plus className="h-3.5 w-3.5" />
                {t('api.card.requestNew', { fallback: 'Solicitar' })}
              </Button>
            )}
          </div>
        </div>
      </div>

      <RequestAPIKeyDialog 
        open={showRequestDialog}
        onOpenChange={setShowRequestDialog}
      />
    </>
  );
};

export default APIKeyCard;
