import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Bell, Send, FileText, History, Users, Mail, Clock, CheckCircle, XCircle, AlertCircle, Eye, Edit, Trash2, UserCheck, RefreshCw, Plus, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/layout/AdminLayout';
import { notificationTemplateService, NotificationTemplate } from '@/services/notifications/notificationTemplates';
import { massNotificationService } from '@/services/notifications/massNotifications';
import { RecipientsModal } from '@/components/admin/notifications/RecipientsModal';
import { ViewTemplateModal } from '@/components/admin/notifications/ViewTemplateModal';
import { EditTemplateModal } from '@/components/admin/notifications/EditTemplateModal';
import { DeleteTemplateModal } from '@/components/admin/notifications/DeleteTemplateModal';
import { UserSelectionModal } from '@/components/admin/notifications/UserSelectionModal';
import { useNotificationHistory } from '@/hooks/useNotificationHistory';
import { queryClient } from '@/lib/react-query';

const AdminNotifications: React.FC = () => {
  console.log('AdminNotifications component loaded');
  const { user, hasPermission } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [recipients, setRecipients] = useState<string>('all');
  const [subject, setSubject] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [notificationType, setNotificationType] = useState<string>('general');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [templates, setTemplates] = useState<NotificationTemplate[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  const [userCount, setUserCount] = useState<number>(0);
  
  // Use the new notification history hook
  const { 
    history, 
    statistics, 
    isLoading: historyLoading, 
    refreshHistory,
    createNotification,
    isCreating 
  } = useNotificationHistory();
  
  // Recipients modal state
  const [selectedNotificationId, setSelectedNotificationId] = useState<string | null>(null);
  const [selectedNotificationSubject, setSelectedNotificationSubject] = useState('');
  const [showRecipientsModal, setShowRecipientsModal] = useState(false);

  // Template modals state
  const [selectedTemplate, setSelectedTemplate] = useState<NotificationTemplate | null>(null);
  const [showViewTemplateModal, setShowViewTemplateModal] = useState(false);
  const [showEditTemplateModal, setShowEditTemplateModal] = useState(false);
  const [showDeleteTemplateModal, setShowDeleteTemplateModal] = useState(false);

  // Manual user selection state
  const [showUserSelectionModal, setShowUserSelectionModal] = useState(false);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [sendViaEmail, setSendViaEmail] = useState(false);

  // Check permissions
  if (!hasPermission('notifications.manage')) {
    return (
      <AdminLayout>
        <div className="text-center py-8">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Acceso Denegado</h2>
          <p className="text-muted-foreground">No tienes permisos para gestionar notificaciones.</p>
        </div>
      </AdminLayout>
    );
  }

  // Handle recipient selection change
  const handleRecipientsChange = (value: string) => {
    setRecipients(value);
    if (value === 'manual') {
      setShowUserSelectionModal(true);
    } else {
      setSelectedUserIds([]);
    }
  };

  // Handle manual user selection confirmation
  const handleUserSelectionConfirm = (userIds: string[]) => {
    setSelectedUserIds(userIds);
    setUserCount(userIds.length);
  };

  // Load templates and user count
  useEffect(() => {
    const loadData = async () => {
      try {
        const templatesData = await notificationTemplateService.getTemplates();
        setTemplates(templatesData);

        if (recipients === 'manual') {
          setUserCount(selectedUserIds.length);
        } else {
          const count = await massNotificationService.getUserCount(recipients as any);
          setUserCount(count);
        }
      } catch (error) {
        console.error('Error loading data:', error);
        toast({
          title: 'Error',
          description: 'Error al cargar los datos',
          variant: 'destructive'
        });
      }
    };

    loadData();
  }, [recipients, selectedUserIds, toast]);

  const handleSendNotification = async () => {
    if (!subject.trim() || !message.trim()) {
      toast({
        title: 'Error',
        description: 'Por favor completa todos los campos requeridos',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Determine recipients based on selection type
      const recipientsData = recipients === 'manual' 
        ? selectedUserIds 
        : (recipients as any);

      // Use the massNotificationService instead of createNotification 
      const success = await massNotificationService.sendMassNotification({
        recipients: recipientsData,
        subject,
        content: message,
        type: notificationType,
        templateId: selectedTemplateId || undefined,
        variables: {
          fecha: new Date().toLocaleDateString('es-ES')
        },
        sendViaEmail
      });

      if (success) {
        toast({
          title: 'Notificación enviada',
          description: `Notificación iniciada para ${userCount} usuarios`,
        });

        setSubject('');
        setMessage('');
        setSelectedTemplateId('');
        setNotificationType('general');

        // Force React Query to re-sync with localStorage immediately
        queryClient.invalidateQueries({ queryKey: ['notification-history'] });
        
        // Refresh history to show the new notification
        await refreshHistory();
      } else {
        throw new Error('Failed to send notification');
      }

    } catch (error) {
      console.error('Error sending notification:', error);
      toast({
        title: 'Error',
        description: 'Error al enviar la notificación',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setSubject(template.subject);
      setMessage(template.content);
      setNotificationType(template.type);
      setSelectedTemplateId(templateId);
    }
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      welcome: <Users className="h-3 w-3" />,
      reminder: <Clock className="h-3 w-3" />,
      promotion: <Bell className="h-3 w-3" />,
      system_update: <AlertCircle className="h-3 w-3" />,
      general: <Mail className="h-3 w-3" />
    };
    return icons[type as keyof typeof icons] || icons.general;
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: { variant: 'default' as const, icon: <CheckCircle className="h-3 w-3" />, text: 'Enviado' },
      failed: { variant: 'destructive' as const, icon: <XCircle className="h-3 w-3" />, text: 'Fallido' },
      pending: { variant: 'secondary' as const, icon: <Clock className="h-3 w-3" />, text: 'Pendiente' },
      processing: { variant: 'outline' as const, icon: <Clock className="h-3 w-3" />, text: 'Procesando' }
    };
    
    const config = variants[status as keyof typeof variants] || variants.pending;
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        {config.icon}
        {config.text}
      </Badge>
    );
  };

  // Handle viewing recipients
  const handleViewRecipients = (notificationId: string, subject: string) => {
    setSelectedNotificationId(notificationId);
    setSelectedNotificationSubject(subject);
    setShowRecipientsModal(true);
  };

  const handleCloseRecipientsModal = () => {
    setShowRecipientsModal(false);
    setSelectedNotificationId(null);
    setSelectedNotificationSubject('');
  };

  // Template modal handlers
  const handleViewTemplate = (template: NotificationTemplate) => {
    setSelectedTemplate(template);
    setShowViewTemplateModal(true);
  };

  const handleEditTemplate = (template: NotificationTemplate) => {
    setSelectedTemplate(template);
    setShowEditTemplateModal(true);
  };

  const handleDeleteTemplate = (template: NotificationTemplate) => {
    setSelectedTemplate(template);
    setShowDeleteTemplateModal(true);
  };

  const handleCloseTemplateModals = () => {
    setShowViewTemplateModal(false);
    setShowEditTemplateModal(false);
    setShowDeleteTemplateModal(false);
    setSelectedTemplate(null);
  };

  const handleTemplateSuccess = async () => {
    // Reload templates after any template operation
    try {
      const templatesData = await notificationTemplateService.getTemplates();
      setTemplates(templatesData);
    } catch (error) {
      console.error('Error reloading templates:', error);
    }
  };

  return (
    <AdminLayout>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => navigate('/admin/control-panel')}
        className="mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Volver al Panel de Control
      </Button>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Notificaciones</h1>
            <p className="text-muted-foreground">
              Gestiona las notificaciones masivas del sistema
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              {userCount} usuarios
            </Badge>
          </div>
        </div>

        <Tabs defaultValue="send" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="send" className="flex items-center gap-2">
              <Send className="h-4 w-4" />
              Enviar Notificación
            </TabsTrigger>
            <TabsTrigger value="templates" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Plantillas
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              Historial
            </TabsTrigger>
          </TabsList>

          <TabsContent value="send" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="h-5 w-5" />
                  Enviar Notificación Masiva
                </CardTitle>
                <CardDescription>
                  Envío masivo de notificaciones a {userCount} usuarios ({recipients})
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Destinatarios</label>
                    <Select value={recipients} onValueChange={handleRecipientsChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar destinatarios" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos los usuarios</SelectItem>
                        <SelectItem value="active">Usuarios activos (últimos 30 días)</SelectItem>
                        <SelectItem value="inactive">Usuarios inactivos (+30 días)</SelectItem>
                        <SelectItem value="new_users_24h">Nuevos usuarios (últimas 24h)</SelectItem>
                        <SelectItem value="new_users_7d">Nuevos usuarios (última semana)</SelectItem>
                        <SelectItem value="by_country">Por país</SelectItem>
                        <SelectItem value="manual">Selección manual</SelectItem>
                      </SelectContent>
                    </Select>
                    {recipients === 'manual' && selectedUserIds.length > 0 && (
                      <div className="flex items-center gap-2">
                        <p className="text-xs text-muted-foreground flex-1">
                          {selectedUserIds.length} usuarios seleccionados manualmente
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowUserSelectionModal(true)}
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Editar
                        </Button>
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-2 pt-2">
                      <input
                        type="checkbox"
                        id="sendViaEmail"
                        checked={sendViaEmail}
                        onChange={(e) => setSendViaEmail(e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                      <Label htmlFor="sendViaEmail" className="text-sm font-normal cursor-pointer">
                        Enviar también por email
                      </Label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Plantilla rápida</label>
                    <Select value={selectedTemplateId} onValueChange={handleApplyTemplate}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar plantilla" />
                      </SelectTrigger>
                      <SelectContent>
                        {templates.map((template) => (
                          <SelectItem key={template.id} value={template.id}>
                            {template.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Tipo de notificación</label>
                  <Select value={notificationType} onValueChange={setNotificationType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="welcome">Bienvenida</SelectItem>
                      <SelectItem value="reminder">Recordatorio</SelectItem>
                      <SelectItem value="promotion">Promoción</SelectItem>
                      <SelectItem value="system_update">Actualización</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Asunto</label>
                  <Input
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Escribe el asunto de la notificación"
                    maxLength={100}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Mensaje</label>
                  <Textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Escribe el contenido de la notificación..."
                    rows={6}
                    maxLength={1000}
                  />
                  <p className="text-xs text-muted-foreground">
                    Variables disponibles: {'{nombre}'}, {'{email}'}, {'{empresa}'}, {'{fecha}'}
                  </p>
                </div>

                <Button 
                  onClick={handleSendNotification} 
                  disabled={isLoading || !subject.trim() || !message.trim()}
                  className="w-full"
                  size="lg"
                >
                  {isLoading ? (
                    <>Enviando...</>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Enviar a {userCount} usuarios
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Plantillas de Notificación</CardTitle>
                <CardDescription>
                  Gestiona las plantillas predefinidas para notificaciones
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {templates.map((template) => (
                    <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-medium">{template.name}</h4>
                            <Badge variant="secondary" className="mt-1 flex items-center gap-1">
                              {getTypeIcon(template.type)}
                              <span>{template.type}</span>
                            </Badge>
                          </div>
                          <div className="flex gap-1">
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="p-1 h-8 w-8"
                              onClick={() => handleViewTemplate(template)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="p-1 h-8 w-8"
                              onClick={() => handleEditTemplate(template)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="p-1 h-8 w-8 text-destructive"
                              onClick={() => handleDeleteTemplate(template)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {template.content.substring(0, 100)}...
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            {new Date(template.created_at).toLocaleDateString()}
                          </span>
                          <Button size="sm" onClick={() => handleApplyTemplate(template.id)}>
                            Usar
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Historial de Notificaciones</CardTitle>
                 <CardDescription className="flex items-center justify-between">
                   <span>Revisa las notificaciones enviadas anteriormente</span>
                   <Button 
                     variant="outline" 
                     size="sm" 
                     onClick={refreshHistory}
                     disabled={historyLoading}
                     className="flex items-center gap-2"
                   >
                     <RefreshCw className={`h-4 w-4 ${historyLoading ? 'animate-spin' : ''}`} />
                     Actualizar
                   </Button>
                 </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {history.map((item) => (
                    <Card key={item.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Mail className="h-4 w-4 text-primary" />
                              <h4 className="font-medium">{item.subject}</h4>
                              {getStatusBadge(item.status)}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                {item.recipient_count} destinatarios
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {item.sent_at ? new Date(item.sent_at).toLocaleDateString() : 'Pendiente'}
                              </span>
                              <Badge variant="outline">{item.type}</Badge>
                              {item.template && (
                                <Badge variant="secondary">
                                  <FileText className="h-3 w-3 mr-1" />
                                  {item.template.name}
                                </Badge>
                              )}
                            </div>
                            {(item.sent_count > 0 || item.failed_count > 0) && (
                              <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                                <span className="text-green-600">✓ {item.sent_count} enviados</span>
                                {item.failed_count > 0 && (
                                  <span className="text-red-600">✗ {item.failed_count} fallidos</span>
                                )}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            {item.has_recipients && (
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleViewRecipients(item.id, item.subject)}
                                className="flex items-center gap-1"
                              >
                                <UserCheck className="h-3 w-3" />
                                Ver Destinatarios
                              </Button>
                            )}
                            <Button size="sm" variant="ghost">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Recipients Modal */}
        <RecipientsModal
          isOpen={showRecipientsModal}
          onClose={handleCloseRecipientsModal}
          notificationId={selectedNotificationId}
          notificationSubject={selectedNotificationSubject}
        />

        {/* Template Modals */}
        <ViewTemplateModal
          isOpen={showViewTemplateModal}
          onClose={handleCloseTemplateModals}
          template={selectedTemplate}
        />

        <EditTemplateModal
          isOpen={showEditTemplateModal}
          onClose={handleCloseTemplateModals}
          template={selectedTemplate}
          onSuccess={handleTemplateSuccess}
        />

        <DeleteTemplateModal
          isOpen={showDeleteTemplateModal}
          onClose={handleCloseTemplateModals}
          template={selectedTemplate}
          onSuccess={handleTemplateSuccess}
        />

        {/* User Selection Modal */}
        <UserSelectionModal
          isOpen={showUserSelectionModal}
          onClose={() => setShowUserSelectionModal(false)}
          onConfirm={handleUserSelectionConfirm}
          initialSelectedIds={selectedUserIds}
        />
      </div>
    </AdminLayout>
  );
};

export default AdminNotifications;