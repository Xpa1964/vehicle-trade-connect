
import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';

interface MessageInputProps {
  onSendMessage: (content: string) => Promise<void>;
  t: (key: string, options?: Record<string, string | number | undefined>) => string;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, t }) => {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const {
    isListening,
    hasSupport: hasVoiceSupport,
    startListening,
    stopListening,
    transcript,
    resetTranscript
  } = useSpeechRecognition('es-ES');

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [message]);

  // Handle transcript updates
  useEffect(() => {
    if (transcript) {
      setMessage(prev => prev + (prev ? ' ' : '') + transcript);
      resetTranscript();
    }
  }, [transcript, resetTranscript]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isSending) return;

    setIsSending(true);
    try {
      await onSendMessage(message.trim());
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const toggleVoiceRecognition = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <div className="border-t border-border p-3 sm:p-4 bg-card sticky bottom-0 safe-area-padding-bottom">
      <form onSubmit={handleSubmit} className="flex gap-2 sm:gap-3 items-end">
        <div className="flex-1 relative">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={t('messages.typeMessage', { fallback: 'Escribe un mensaje...' })}
            className="min-h-[48px] max-h-[120px] resize-none text-base border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent pr-12 sm:pr-14"
            rows={1}
          />
          
          {hasVoiceSupport && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={toggleVoiceRecognition}
              className={`absolute right-2 top-1/2 transform -translate-y-1/2 touch-manipulation min-h-[40px] min-w-[40px] p-2 rounded-lg ${
                isListening ? 'text-destructive bg-destructive/10' : 'text-muted-foreground hover:bg-secondary'
              }`}
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
          )}
        </div>
        
        <Button
          type="submit"
          disabled={!message.trim() || isSending}
          size="sm"
          className="touch-manipulation min-h-[48px] min-w-[48px] px-3 sm:px-4 rounded-xl bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Send className="h-5 w-5" />
          <span className="sr-only">Enviar mensaje</span>
        </Button>
      </form>
      
      {isListening && (
        <div className="mt-2 text-center">
          <span className="text-sm text-destructive animate-pulse">
            🎤 Escuchando...
          </span>
        </div>
      )}
    </div>
  );
};

export default MessageInput;
