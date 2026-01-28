
import { toast } from 'sonner';
import { logActivity } from '@/utils/activityLogger';

export interface QueuedMessage {
  id: string;
  senderId: string;
  recipients: string[];
  content: string;
  attachments?: string[];
  priority: 'low' | 'normal' | 'high';
  retryCount: number;
  maxRetries: number;
  scheduledAt?: Date;
  createdAt: Date;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
}

export interface QueueStatus {
  pending: number;
  processing: number;
  completed: number;
  failed: number;
}

class MessagingQueue {
  private queue: QueuedMessage[] = [];
  private processing = false;
  private batchSize = 5; // Procesar 5 mensajes a la vez
  private processingDelay = 1000; // 1 segundo entre lotes

  addToQueue(message: Omit<QueuedMessage, 'id' | 'createdAt' | 'status' | 'retryCount'>): string {
    const queuedMessage: QueuedMessage = {
      ...message,
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      status: 'pending',
      retryCount: 0,
      maxRetries: message.maxRetries || 3
    };

    this.queue.push(queuedMessage);
    
    // Log queue addition
    logActivity({
      action_type: 'message_queued',
      entity_type: 'messaging_queue',
      entity_id: queuedMessage.id,
      details: {
        recipientCount: message.recipients.length,
        priority: message.priority
      }
    });

    // Start processing if not already running
    if (!this.processing) {
      this.startProcessing();
    }

    return queuedMessage.id;
  }

  private async startProcessing(): Promise<void> {
    if (this.processing) return;
    
    this.processing = true;
    console.log('[MessagingQueue] Starting queue processing...');

    while (this.hasPendingMessages()) {
      const batch = this.getNextBatch();
      if (batch.length === 0) break;

      await this.processBatch(batch);
      
      // Pequeña pausa entre lotes
      if (this.hasPendingMessages()) {
        await new Promise(resolve => setTimeout(resolve, this.processingDelay));
      }
    }

    this.processing = false;
    console.log('[MessagingQueue] Queue processing completed');
  }

  private hasPendingMessages(): boolean {
    return this.queue.some(msg => 
      msg.status === 'pending' && 
      (!msg.scheduledAt || msg.scheduledAt <= new Date())
    );
  }

  private getNextBatch(): QueuedMessage[] {
    return this.queue
      .filter(msg => 
        msg.status === 'pending' && 
        (!msg.scheduledAt || msg.scheduledAt <= new Date())
      )
      .sort((a, b) => {
        // Prioridad: high > normal > low
        const priorityOrder = { high: 3, normal: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      })
      .slice(0, this.batchSize);
  }

  private async processBatch(batch: QueuedMessage[]): Promise<void> {
    console.log(`[MessagingQueue] Processing batch of ${batch.length} messages`);
    
    const promises = batch.map(message => this.processMessage(message));
    await Promise.allSettled(promises);
  }

  private async processMessage(message: QueuedMessage): Promise<void> {
    try {
      message.status = 'processing';
      
      console.log(`[MessagingQueue] Processing message ${message.id} for ${message.recipients.length} recipients`);
      
      // Simular envío del mensaje (aquí iría la lógica real de envío)
      await this.sendMessage(message);
      
      message.status = 'completed';
      
      // Log successful completion
      await logActivity({
        action_type: 'bulk_message_sent',
        entity_type: 'messaging_queue',
        entity_id: message.id,
        details: {
          recipientCount: message.recipients.length,
          retryCount: message.retryCount,
          priority: message.priority
        },
        severity: 'success'
      });

      console.log(`[MessagingQueue] Message ${message.id} completed successfully`);
      
    } catch (error) {
      console.error(`[MessagingQueue] Error processing message ${message.id}:`, error);
      
      message.retryCount++;
      
      if (message.retryCount >= message.maxRetries) {
        message.status = 'failed';
        
        // Log permanent failure
        await logActivity({
          action_type: 'bulk_message_failed',
          entity_type: 'messaging_queue',
          entity_id: message.id,
          details: {
            error: error instanceof Error ? error.message : 'Unknown error',
            finalRetryCount: message.retryCount,
            recipientCount: message.recipients.length
          },
          severity: 'error'
        });

        toast.error(`Error al enviar mensaje masivo: ${error instanceof Error ? error.message : 'Error desconocido'}`);
      } else {
        message.status = 'pending';
        
        // Log retry attempt
        await logActivity({
          action_type: 'bulk_message_retry',
          entity_type: 'messaging_queue',
          entity_id: message.id,
          details: {
            retryCount: message.retryCount,
            maxRetries: message.maxRetries,
            error: error instanceof Error ? error.message : 'Unknown error'
          },
          severity: 'warning'
        });

        console.log(`[MessagingQueue] Message ${message.id} queued for retry (${message.retryCount}/${message.maxRetries})`);
      }
    }
  }

  private async sendMessage(message: QueuedMessage): Promise<void> {
    // Importar dinámicamente para evitar dependencias circulares
    const { directChatService } = await import('@/services/directChat');
    
    return directChatService.createBulkConversations(
      message.senderId,
      message.recipients,
      message.content,
      message.attachments
    );
  }

  getQueueStatus(): QueueStatus {
    const status: QueueStatus = {
      pending: 0,
      processing: 0,
      completed: 0,
      failed: 0
    };

    this.queue.forEach(message => {
      status[message.status]++;
    });

    return status;
  }

  getQueuedMessages(): QueuedMessage[] {
    return [...this.queue].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  cancelMessage(messageId: string): boolean {
    const message = this.queue.find(msg => msg.id === messageId);
    if (message && message.status === 'pending') {
      message.status = 'cancelled';
      
      logActivity({
        action_type: 'bulk_message_cancelled',
        entity_type: 'messaging_queue',
        entity_id: messageId,
        details: { cancelledAt: new Date().toISOString() }
      });

      return true;
    }
    return false;
  }

  clearCompleted(): void {
    const beforeCount = this.queue.length;
    this.queue = this.queue.filter(msg => !['completed', 'failed', 'cancelled'].includes(msg.status));
    const removedCount = beforeCount - this.queue.length;
    
    if (removedCount > 0) {
      console.log(`[MessagingQueue] Removed ${removedCount} completed/failed messages from queue`);
    }
  }
}

export const messagingQueue = new MessagingQueue();
