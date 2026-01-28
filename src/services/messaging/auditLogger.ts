
import { logActivity } from '@/utils/activityLogger';

export interface MessageAuditEntry {
  id: string;
  userId: string;
  action: 'bulk_send' | 'template_used' | 'rate_limit_hit' | 'queue_added' | 'send_failed';
  messageId?: string;
  recipientCount?: number;
  templateId?: string;
  errorMessage?: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

class AuditLogger {
  private auditTrail: MessageAuditEntry[] = [];

  async logBulkMessageSent(userId: string, messageId: string, recipientCount: number, metadata?: Record<string, any>): Promise<void> {
    const entry: MessageAuditEntry = {
      id: this.generateId(),
      userId,
      action: 'bulk_send',
      messageId,
      recipientCount,
      timestamp: new Date(),
      metadata
    };

    this.auditTrail.push(entry);
    
    await logActivity({
      action_type: 'bulk_message_audit',
      entity_type: 'messaging_audit',
      entity_id: messageId,
      details: {
        action: 'bulk_send',
        recipientCount,
        ...metadata
      },
      severity: 'info'
    });

    console.log(`[AuditLogger] Bulk message sent: ${recipientCount} recipients`);
  }

  async logTemplateUsed(userId: string, templateId: string, metadata?: Record<string, any>): Promise<void> {
    const entry: MessageAuditEntry = {
      id: this.generateId(),
      userId,
      action: 'template_used',
      templateId,
      timestamp: new Date(),
      metadata
    };

    this.auditTrail.push(entry);
    
    await logActivity({
      action_type: 'message_template_used',
      entity_type: 'messaging_audit',
      entity_id: templateId,
      details: {
        templateId,
        ...metadata
      },
      severity: 'info'
    });
  }

  async logRateLimitHit(userId: string, errorMessage: string, metadata?: Record<string, any>): Promise<void> {
    const entry: MessageAuditEntry = {
      id: this.generateId(),
      userId,
      action: 'rate_limit_hit',
      errorMessage,
      timestamp: new Date(),
      metadata
    };

    this.auditTrail.push(entry);
    
    await logActivity({
      action_type: 'rate_limit_exceeded',
      entity_type: 'messaging_audit',
      details: {
        errorMessage,
        ...metadata
      },
      severity: 'warning'
    });

    console.warn(`[AuditLogger] Rate limit hit for user ${userId}: ${errorMessage}`);
  }

  async logQueueAdded(userId: string, messageId: string, recipientCount: number, priority: string): Promise<void> {
    const entry: MessageAuditEntry = {
      id: this.generateId(),
      userId,
      action: 'queue_added',
      messageId,
      recipientCount,
      timestamp: new Date(),
      metadata: { priority }
    };

    this.auditTrail.push(entry);
    
    await logActivity({
      action_type: 'message_queued_audit',
      entity_type: 'messaging_audit',
      entity_id: messageId,
      details: {
        recipientCount,
        priority
      },
      severity: 'info'
    });
  }

  async logSendFailed(userId: string, messageId: string, errorMessage: string, metadata?: Record<string, any>): Promise<void> {
    const entry: MessageAuditEntry = {
      id: this.generateId(),
      userId,
      action: 'send_failed',
      messageId,
      errorMessage,
      timestamp: new Date(),
      metadata
    };

    this.auditTrail.push(entry);
    
    await logActivity({
      action_type: 'bulk_message_send_failed',
      entity_type: 'messaging_audit',
      entity_id: messageId,
      details: {
        errorMessage,
        ...metadata
      },
      severity: 'error'
    });

    console.error(`[AuditLogger] Message send failed: ${errorMessage}`);
  }

  getAuditTrail(userId?: string, limit?: number): MessageAuditEntry[] {
    let filtered = this.auditTrail;
    
    if (userId) {
      filtered = filtered.filter(entry => entry.userId === userId);
    }
    
    filtered = filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    
    if (limit) {
      filtered = filtered.slice(0, limit);
    }
    
    return filtered;
  }

  getAuditStats(userId?: string): {
    totalMessages: number;
    totalRecipients: number;
    templatesUsed: number;
    rateLimitHits: number;
    failures: number;
  } {
    const entries = userId ? 
      this.auditTrail.filter(entry => entry.userId === userId) : 
      this.auditTrail;

    return {
      totalMessages: entries.filter(e => e.action === 'bulk_send').length,
      totalRecipients: entries
        .filter(e => e.action === 'bulk_send')
        .reduce((sum, e) => sum + (e.recipientCount || 0), 0),
      templatesUsed: entries.filter(e => e.action === 'template_used').length,
      rateLimitHits: entries.filter(e => e.action === 'rate_limit_hit').length,
      failures: entries.filter(e => e.action === 'send_failed').length
    };
  }

  private generateId(): string {
    return `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Método para limpiar entradas antiguas (mantener solo últimos 30 días)
  cleanupOldEntries(): void {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const beforeCount = this.auditTrail.length;
    this.auditTrail = this.auditTrail.filter(entry => entry.timestamp > thirtyDaysAgo);
    const removedCount = beforeCount - this.auditTrail.length;
    
    if (removedCount > 0) {
      console.log(`[AuditLogger] Cleaned up ${removedCount} old audit entries`);
    }
  }
}

export const auditLogger = new AuditLogger();
