
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { useUserRole } from '@/hooks/useUserRole';
import { useLanguage } from '@/contexts/LanguageContext';
import ActivityLogManager from '@/components/admin/activity-log';
import { ConversationDeletionLogs } from '@/components/admin/conversation-deletion-logs/ConversationDeletionLogs';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const ActivityLogsPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { currentRole, hasPermission } = useUserRole();
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" />;
  }
  
  const canViewLogs = hasPermission('logs.view');
  const isAdmin = currentRole === 'admin' || 
                 currentRole === 'analyst' || 
                 hasPermission('logs.view');
                 
  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{t('common.accessDenied', { fallback: 'Acceso Denegado' })}</AlertTitle>
          <AlertDescription>
            {t('common.noPermissionActivityLogs', { fallback: 'No tienes permiso para acceder al registro de actividades.' })}
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  
  return (
    <div className="container px-0 space-y-6">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => navigate('/admin/control-panel')}
        className="mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        {t('navigation.backToControlPanel')}
      </Button>

      <Tabs defaultValue="all-logs" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="all-logs">{t('common.allRecords', { fallback: 'Todos los Registros' })}</TabsTrigger>
          <TabsTrigger value="conversation-deletions">{t('common.deletedConversations', { fallback: 'Conversaciones Eliminadas' })}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all-logs" className="mt-6">
          <ActivityLogManager />
        </TabsContent>
        
        <TabsContent value="conversation-deletions" className="mt-6">
          <ConversationDeletionLogs />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ActivityLogsPage;
