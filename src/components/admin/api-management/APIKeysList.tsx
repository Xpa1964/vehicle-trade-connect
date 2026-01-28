import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';
import { useAPIKeys } from '@/hooks/useAPIKeys';
import { useLanguage } from '@/contexts/LanguageContext';
import APIKeyRow from './APIKeyRow';
import CreateAPIKeyDialog from './CreateAPIKeyDialog';

const APIKeysList: React.FC = () => {
  const { apiKeys, isLoading } = useAPIKeys();
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const filteredKeys = apiKeys?.filter(key => 
    key.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    key.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    key.company_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle className="text-xl font-semibold">
              {t('api.keysList.title')}
            </CardTitle>
            <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              {t('api.keysList.createNew')}
            </Button>
          </div>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('api.keysList.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 animate-pulse bg-muted rounded" />
              ))}
            </div>
          ) : filteredKeys && filteredKeys.length > 0 ? (
            <div className="space-y-4">
              {filteredKeys.map((apiKey) => (
                <APIKeyRow key={apiKey.id} apiKey={apiKey} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm ? t('api.keysList.noResults') : t('api.keysList.empty')}
            </div>
          )}
        </CardContent>
      </Card>

      <CreateAPIKeyDialog 
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />
    </>
  );
};

export default APIKeysList;
