
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, MessageSquare } from 'lucide-react';
import UserCardWithSelection from './UserCardWithSelection';
import UserSelectionToolbar from './UserSelectionToolbar';
import BulkMessageComposer from './BulkMessageComposer';

interface Profile {
  id: string;
  full_name: string | null;
  company_name: string | null;
  contact_phone: string | null;
  country: string | null;
  business_type: string | null;
  trader_type: string | null;
  company_logo: string | null;
  total_operations: number;
  email: string;
}

const UsersDirectoryWithSelection: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [showBulkComposer, setShowBulkComposer] = useState(false);

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, company_name, contact_phone, country, business_type, trader_type, company_logo, total_operations, email')
        .order('full_name', { ascending: true });

      if (error) {
        console.error('Error fetching profiles:', error);
        return;
      }

      // Filter out current user
      const filteredProfiles = data?.filter(profile => profile.id !== user?.id) || [];
      setProfiles(filteredProfiles);
    } catch (error) {
      console.error('Error in fetchProfiles:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProfiles = profiles.filter(profile => {
    const searchLower = searchTerm.toLowerCase();
    return (
      profile.full_name?.toLowerCase().includes(searchLower) ||
      profile.company_name?.toLowerCase().includes(searchLower) ||
      profile.country?.toLowerCase().includes(searchLower)
    );
  });

  const handleUserSelection = (userId: string, selected: boolean) => {
    const newSelectedUsers = new Set(selectedUsers);
    if (selected) {
      newSelectedUsers.add(userId);
    } else {
      newSelectedUsers.delete(userId);
    }
    setSelectedUsers(newSelectedUsers);
  };

  const handleSelectAll = () => {
    if (selectedUsers.size === filteredProfiles.length) {
      setSelectedUsers(new Set());
    } else {
      const allUserIds = filteredProfiles.map(profile => profile.id);
      setSelectedUsers(new Set(allUserIds));
    }
  };

  const handleClearSelection = () => {
    setSelectedUsers(new Set());
  };

  const handleSendMessage = () => {
    setShowBulkComposer(true);
  };

  const handleMessageSent = () => {
    setSelectedUsers(new Set());
    setShowBulkComposer(false);
  };

  const getSelectedUsersData = () => {
    return profiles.filter(profile => selectedUsers.has(profile.id));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800"></div>
        <span className="ml-2">{t('messages.loadingDirectory', { fallback: 'Cargando directorio...' })}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            {t('messages.directoryTitle', { fallback: 'Directorio de Usuarios - KONTACT VO' })}
          </CardTitle>
          <CardDescription>
            {t('messages.directoryDescription', { fallback: 'Selecciona un usuario para enviarle un mensaje de KONTACT VO' })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('messages.searchUsers', { fallback: 'Buscar por nombre, empresa o país...' })}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProfiles.map((profile) => (
              <UserCardWithSelection
                key={profile.id}
                userId={profile.id}
                userName={profile.full_name}
                companyName={profile.company_name}
                businessType={profile.business_type}
                country={profile.country}
                showSelection={true}
                isSelected={selectedUsers.has(profile.id)}
                onSelectionChange={(userId: string, selected: boolean) => handleUserSelection(userId, selected)}
              />
            ))}
          </div>

          {filteredProfiles.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {searchTerm ? t('messages.noUsersFound', { fallback: 'No se encontraron usuarios con ese criterio' }) : t('messages.noUsersInDirectory', { fallback: 'No hay usuarios en el directorio' })}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <UserSelectionToolbar
        selectedCount={selectedUsers.size}
        totalCount={filteredProfiles.length}
        isAllSelected={selectedUsers.size === filteredProfiles.length && filteredProfiles.length > 0}
        onSelectAll={handleSelectAll}
        onClearSelection={handleClearSelection}
        onSendMessage={handleSendMessage}
      />

      <BulkMessageComposer
        isOpen={showBulkComposer}
        onClose={() => setShowBulkComposer(false)}
        selectedUsers={getSelectedUsersData()}
        onMessageSent={handleMessageSent}
      />
    </div>
  );
};

export default UsersDirectoryWithSelection;
