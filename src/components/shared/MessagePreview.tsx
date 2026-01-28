
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, FileText, Users, Calendar, AlertTriangle } from 'lucide-react';
import { SafeMessageRenderer } from './SafeMessageRenderer';

interface MessagePreviewProps {
  message: string;
  recipientCount: number;
  attachments: string[];
  className?: string;
}

const MessagePreview: React.FC<MessagePreviewProps> = ({
  message,
  recipientCount,
  attachments,
  className = ''
}) => {
  const getMessageStats = () => {
    const wordCount = message.trim().split(/\s+/).length;
    const charCount = message.length;
    const estimatedReadTime = Math.max(1, Math.ceil(wordCount / 200)); // 200 palabras por minuto
    
    return { wordCount, charCount, estimatedReadTime };
  };

  const getMessageWarnings = () => {
    const warnings = [];
    const { charCount } = getMessageStats();
    
    if (charCount > 1500) {
      warnings.push('Mensaje muy largo - considera dividirlo');
    }
    
    if (recipientCount > 50) {
      warnings.push('Envío masivo - verifica el contenido cuidadosamente');
    }
    
    if (message.includes('http://') && !message.includes('https://')) {
      warnings.push('Enlace no seguro detectado');
    }
    
    const uppercaseRatio = (message.match(/[A-Z]/g) || []).length / message.length;
    if (uppercaseRatio > 0.3) {
      warnings.push('Demasiado texto en mayúsculas');
    }
    
    return warnings;
  };

  const stats = getMessageStats();
  const warnings = getMessageWarnings();

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <Eye className="h-5 w-5 text-foreground" />
        <h3 className="font-medium text-foreground">Vista Previa del Mensaje</h3>
      </div>

      {/* Estadísticas del mensaje */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Estadísticas del Mensaje
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="font-semibold text-lg text-foreground">{stats.charCount}</div>
              <div className="text-muted-foreground">Caracteres</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-lg text-foreground">{stats.wordCount}</div>
              <div className="text-muted-foreground">Palabras</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-lg text-foreground">{recipientCount}</div>
              <div className="text-muted-foreground">Destinatarios</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-lg text-foreground">{stats.estimatedReadTime}min</div>
              <div className="text-muted-foreground">Lectura est.</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Advertencias si las hay */}
      {warnings.length > 0 && (
        <Card className="border-warning/30 bg-warning/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2 text-amber-400">
              <AlertTriangle className="h-4 w-4" />
              Advertencias
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ul className="space-y-1">
              {warnings.map((warning, index) => (
                <li key={index} className="text-sm text-amber-400/80 flex items-center gap-2">
                  <span className="w-1 h-1 bg-amber-400 rounded-full"></span>
                  {warning}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Vista previa del mensaje */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Cómo se verá tu mensaje</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="bg-secondary p-4 rounded-lg border border-border">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-medium">
                Tú
              </div>
              <div className="flex-1">
                <div className="bg-card p-3 rounded-lg border border-border shadow-sm">
                  <SafeMessageRenderer 
                    message={message || 'Escribe tu mensaje para ver la vista previa...'}
                    className="text-sm prose prose-sm max-w-none text-foreground"
                  />
                  
                  {/* Adjuntos en la vista previa */}
                  {attachments.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-border space-y-2">
                      <div className="text-xs text-muted-foreground font-medium">Adjuntos:</div>
                      {attachments.map((attachment, index) => (
                        <div key={index} className="flex items-center gap-2 text-xs bg-secondary p-2 rounded text-foreground">
                          <FileText className="h-3 w-3" />
                          <span className="truncate">{attachment.split('/').pop()}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  <Calendar className="h-3 w-3 inline mr-1" />
                  Ahora
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Información de envío */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-foreground">Se enviará a <strong>{recipientCount}</strong> destinatario{recipientCount !== 1 ? 's' : ''}</span>
            </div>
            <Badge variant="outline">
              {attachments.length} adjunto{attachments.length !== 1 ? 's' : ''}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MessagePreview;
