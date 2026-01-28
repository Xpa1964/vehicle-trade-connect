
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { useUserRole } from '@/hooks/useUserRole';
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
  const navigate = useNavigate();
  
  // Check if user is authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" />;
  }
  
  // Check if user has admin role or logs.view permission
  const canViewLogs = hasPermission('logs.view');
  const isAdmin = currentRole === 'admin' || 
                 currentRole === 'moderator' || 
                 hasPermission('logs.view');
                 
  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Acceso Denegado</AlertTitle>
          <AlertDescription>
            No tienes permiso para acceder al registro de actividades.
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
        Volver al Panel de Control
      </Button>

      <Tabs defaultValue="all-logs" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="all-logs">Todos los Registros</TabsTrigger>
          <TabsTrigger value="conversation-deletions">Conversaciones Eliminadas</TabsTrigger>
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
