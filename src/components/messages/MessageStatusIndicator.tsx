
import React from 'react';
import { Check, CheckCheck, Clock, AlertCircle } from 'lucide-react';
import { MessageStatus } from '@/types/messageStatus';

interface MessageStatusIndicatorProps {
  status: MessageStatus;
  className?: string;
}

const MessageStatusIndicator: React.FC<MessageStatusIndicatorProps> = ({ status, className = '' }) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'sending':
        return <Clock className={`h-3 w-3 animate-pulse ${className}`} />;
      case 'sent':
        return <Check className={`h-3 w-3 ${className}`} />;
      case 'read':
        return <CheckCheck className={`h-3 w-3 ${className}`} />;
      case 'failed':
        return <AlertCircle className={`h-3 w-3 text-red-500 ${className}`} />;
      default:
        return null;
    }
  };

  return (
    <span className="inline-flex items-center">
      {getStatusIcon()}
    </span>
  );
};

export default MessageStatusIndicator;
