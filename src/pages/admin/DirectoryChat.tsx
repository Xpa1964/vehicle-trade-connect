
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import UsersDirectoryWithSelection from '@/components/shared/UsersDirectoryWithSelection';
import PageHeader from '@/components/layout/PageHeader';
import { useLanguage } from '@/contexts/LanguageContext';

const AdminDirectoryChat: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigate('/admin/control-panel')}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t('messages.backToAdminPanel', { fallback: 'Volver al Panel de Control' })}
        </Button>
      </div>

      <PageHeader 
        title={t('messages.adminDirectoryTitle', { fallback: 'Directorio con Chat de KONTACT VO' })} 
        subtitle={t('messages.adminDirectorySubtitle', { fallback: 'Comunícate directamente con los usuarios registrados enviando mensajes de KONTACT VO' })}
      />

      <UsersDirectoryWithSelection />
    </div>
  );
};

export default AdminDirectoryChat;
