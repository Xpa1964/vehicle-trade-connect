
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { X, Send, Users, Paperclip, FileText, Eye, BarChart3, AlertTriangle } from 'lucide-react';
import { directChatService } from '@/services/directChat';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import SecureFileUpload from './SecureFileUpload';
import RichTextEditor from './RichTextEditor';
import MessageTemplatesSelector from './MessageTemplatesSelector';
import MessagePreview from './MessagePreview';
import RecipientsSummary from './RecipientsSummary';
import SendingProgressDialog from './SendingProgressDialog';
import ConfirmationDialog from './ConfirmationDialog';
import { rateLimiter } from '@/services/messaging/rateLimiter';
import { messagingQueue } from '@/services/messaging/messagingQueue';
import { auditLogger } from '@/services/messaging/auditLogger';

interface BulkMessageComposerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedUsers: Array<{
    id: string;
    full_name?: string;
    company_name?: string;
    business_type?: string;
    country?: string;
  }>;
  onMessageSent?: () => void;
}

const BulkMessageComposer: React.FC<BulkMessageComposerProps> = ({
  isOpen,
  onClose,
  selectedUsers,
  onMessageSent
}) => {
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState<string[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [activeTab, setActiveTab] = useState('compose');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [currentMessageId, setCurrentMessageId] = useState<string | undefined>();

  const handleSend = async () => {
    if (!user || !message.trim()) return;

    // Verificar rate limiting
    const rateLimitResult = rateLimiter.checkLimit(user.id);
    if (!rateLimitResult.allowed) {
      toast.error(`Rate limit excedido: ${rateLimitResult.reason}`);
      await auditLogger.logRateLimitHit(user.id, rateLimitResult.reason || 'Rate limit exceeded');
      return;
    }

    setShowConfirmation(true);
  };

  const handleConfirmSend = async () => {
    if (!user || !message.trim()) return;

    setShowConfirmation(false);
    setIsSending(true);

    try {
      // Incrementar contador de rate limiting
      rateLimiter.incrementCount(user.id);

      // Determinar prioridad basada en el número de destinatarios
      let priority: 'low' | 'normal' | 'high' = 'normal';
      if (selectedUsers.length > 100) {
        priority = 'low';
      } else if (selectedUsers.length < 10) {
        priority = 'high';
      }

      // Añadir a la cola de mensajes
      const messageId = messagingQueue.addToQueue({
        senderId: user.id,
        recipients: selectedUsers.map(u => u.id),
        content: message.trim(),
        attachments,
        priority,
        maxRetries: 3
      });

      setCurrentMessageId(messageId);

      // Log en auditoría
      await auditLogger.logQueueAdded(user.id, messageId, selectedUsers.length, priority);
      await auditLogger.logBulkMessageSent(user.id, messageId, selectedUsers.length, {
        priority,
        hasAttachments: attachments.length > 0,
        messageLength: message.length
      });

      // Mostrar diálogo de progreso
      setShowProgress(true);

      // Limpiar formulario
      setMessage('');
      setAttachments([]);
      onMessageSent?.();

      toast.success(`Mensaje añadido a la cola de envío para ${selectedUsers.length} destinatarios`);

    } catch (error) {
      console.error('Error starting bulk message send:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      
      if (currentMessageId) {
        await auditLogger.logSendFailed(user.id, currentMessageId, errorMessage);
      }
      
      toast.error(`Error al programar envío masivo: ${errorMessage}`);
    } finally {
      setIsSending(false);
    }
  };

  const handleAttachmentUpload = (path: string, fullPath: string) => {
    setAttachments(prev => [...prev, fullPath]);
  };

  const handleTemplateSelect = (template: any) => {
    setMessage(template.content);
    setActiveTab('compose');
    
    if (user) {
      auditLogger.logTemplateUsed(user.id, template.id, {
        templateTitle: template.title,
        templateCategory: template.category
      });
    }
  };

  const removeUser = (userId: string) => {
    // Esta función será manejada por el componente padre
  };

  const getUserDisplayName = (user: any) => {
    return user.company_name || user.full_name || 'Usuario';
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const getEstimatedTime = () => {
    const recipientCount = selectedUsers.length;
    if (recipientCount <= 10) return '< 1 minuto';
    if (recipientCount <= 50) return '1-3 minutos';
    if (recipientCount <= 100) return '3-5 minutos';
    return '5-10 minutos';
  };

  const handleProgressClose = () => {
    setShowProgress(false);
    onClose();
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Send className="h-5 w-5" />
              Compositor de Mensajes Avanzado
              {selectedUsers.length > 50 && (
                <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Envío Masivo
                </Badge>
              )}
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-hidden">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="compose" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Redactar
                </TabsTrigger>
                <TabsTrigger value="templates" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Plantillas
                </TabsTrigger>
                <TabsTrigger value="preview" className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Vista Previa
                </TabsTrigger>
                <TabsTrigger value="recipients" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Destinatarios
                </TabsTrigger>
              </TabsList>

              <div className="flex-1 overflow-hidden mt-4">
                <TabsContent value="compose" className="h-full overflow-y-auto space-y-4">
                  {/* Destinatarios */}
                  <div>
                    <Label className="flex items-center gap-2 mb-2">
                      <Users className="h-4 w-4" />
                      Destinatarios ({selectedUsers.length})
                    </Label>
                    <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 border rounded-md">
                      {selectedUsers.map((user) => (
                        <Badge key={user.id} variant="secondary" className="flex items-center gap-1">
                          {getUserDisplayName(user)}
                          <button
                            type="button"
                            onClick={() => removeUser(user.id)}
                            className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Editor de mensaje */}
                  <div>
                    <Label htmlFor="message">Mensaje</Label>
                    <RichTextEditor
                      value={message}
                      onChange={setMessage}
                      placeholder="Escribe tu mensaje aquí... Puedes usar **negrita**, *cursiva*, • listas"
                      maxLength={2000}
                      className="mt-1"
                    />
                  </div>

                  {/* Adjuntos */}
                  <div>
                    <Label className="flex items-center gap-2 mb-2">
                      <Paperclip className="h-4 w-4" />
                      Adjuntos (opcional)
                    </Label>
                    <SecureFileUpload
                      bucket="announcement_attachments"
                      folder="direct-messages"
                      onUploadComplete={handleAttachmentUpload}
                      maxFiles={3}
                      className="mb-2"
                    />
                    
                    {/* Lista de adjuntos */}
                    {attachments.length > 0 && (
                      <div className="space-y-2 mt-3">
                        <Label className="text-sm">Adjuntos añadidos:</Label>
                        {attachments.map((attachment, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <span className="text-sm truncate">{attachment.split('/').pop()}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeAttachment(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="templates" className="h-full overflow-y-auto">
                  <MessageTemplatesSelector onSelectTemplate={handleTemplateSelect} />
                </TabsContent>

                <TabsContent value="preview" className="h-full overflow-y-auto">
                  <MessagePreview
                    message={message}
                    recipientCount={selectedUsers.length}
                    attachments={attachments}
                  />
                </TabsContent>

                <TabsContent value="recipients" className="h-full overflow-y-auto">
                  <RecipientsSummary recipients={selectedUsers} />
                </TabsContent>
              </div>
            </Tabs>
          </div>

          {/* Acciones */}
          <div className="flex justify-between items-center pt-4 border-t mt-4">
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {selectedUsers.length} destinatarios
              </span>
              <span className="flex items-center gap-1">
                <Paperclip className="h-4 w-4" />
                {attachments.length} adjuntos
              </span>
              <span>{message.length}/2000 caracteres</span>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose} disabled={isSending}>
                Cancelar
              </Button>
              <Button 
                onClick={handleSend} 
                disabled={!message.trim() || isSending || selectedUsers.length === 0}
                className="min-w-[120px]"
              >
                {isSending ? 'Procesando...' : `Enviar a ${selectedUsers.length}`}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Diálogo de confirmación */}
      <ConfirmationDialog
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={handleConfirmSend}
        title="Confirmar Envío Masivo"
        description="¿Estás seguro de que quieres enviar este mensaje a todos los destinatarios seleccionados?"
        recipientCount={selectedUsers.length}
        estimatedTime={getEstimatedTime()}
        isDestructive={selectedUsers.length > 100}
        isLoading={isSending}
      />

      {/* Diálogo de progreso */}
      <SendingProgressDialog
        isOpen={showProgress}
        onClose={handleProgressClose}
        messageId={currentMessageId}
        recipientCount={selectedUsers.length}
      />
    </>
  );
};

export default BulkMessageComposer;
