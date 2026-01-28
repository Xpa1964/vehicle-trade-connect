import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Power, Trash2, MoreVertical } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es, fr, it, pt, de, pl } from 'date-fns/locale';
import { enUS } from 'date-fns/locale';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import APIKeyDetails from './APIKeyDetails';
import { useToggleAPIKey } from '@/hooks/useToggleAPIKey';
import { useDeleteAPIKey } from '@/hooks/useDeleteAPIKey';

interface APIKeyRowProps {
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
  };
}

const APIKeyRow: React.FC<APIKeyRowProps> = ({ apiKey }) => {
  const { t, currentLanguage } = useLanguage();
  const [showDetails, setShowDetails] = useState(false);
  const toggleMutation = useToggleAPIKey();
  const deleteMutation = useDeleteAPIKey();

  const localeMap: Record<string, any> = {
    es, en: enUS, fr, it, pt, de, pl,
    dk: enUS, no: enUS, se: enUS
  };

  const maskAPIKey = (key: string) => {
    if (key.length < 12) return key;
    return `${key.substring(0, 8)}${'*'.repeat(20)}${key.substring(key.length - 4)}`;
  };

  const handleToggle = () => {
    toggleMutation.mutate({ 
      id: apiKey.id, 
      isActive: !apiKey.is_active 
    });
  };

  const handleDelete = () => {
    if (confirm(t('api.keyRow.confirmDelete'))) {
      deleteMutation.mutate(apiKey.id);
    }
  };

  return (
    <>
      <div className="border border-border rounded-lg p-4 hover:bg-accent/50 transition-colors">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-foreground">{apiKey.name}</h3>
              <Badge variant={apiKey.is_active ? "default" : "secondary"}>
                {apiKey.is_active ? t('api.status.active') : t('api.status.inactive')}
              </Badge>
            </div>
            
            {apiKey.company_name && (
              <p className="text-sm text-muted-foreground">
                {apiKey.company_name} • {apiKey.user_email}
              </p>
            )}
            
            <p className="text-sm font-mono text-muted-foreground">
              {maskAPIKey(apiKey.api_key)}
            </p>
            
            <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
              <span>
                {t('api.keyRow.requests')}: <strong>{apiKey.request_count}</strong>
              </span>
              <span>
                {t('api.keyRow.created')}: {formatDistanceToNow(new Date(apiKey.created_at), { 
                  addSuffix: true,
                  locale: localeMap[currentLanguage] || enUS
                })}
              </span>
              {apiKey.last_used_at && (
                <span>
                  {t('api.keyRow.lastUsed')}: {formatDistanceToNow(new Date(apiKey.last_used_at), { 
                    addSuffix: true,
                    locale: localeMap[currentLanguage] || enUS
                  })}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDetails(true)}
            >
              <Eye className="h-4 w-4" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleToggle}>
                  <Power className="h-4 w-4 mr-2" />
                  {apiKey.is_active ? t('api.actions.deactivate') : t('api.actions.activate')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  {t('api.actions.delete')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <APIKeyDetails
        apiKey={apiKey}
        open={showDetails}
        onOpenChange={setShowDetails}
      />
    </>
  );
};

export default APIKeyRow;
