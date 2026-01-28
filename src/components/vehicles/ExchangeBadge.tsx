
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { ArrowLeftRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface ExchangeBadgeProps {
  acceptsExchange: boolean;
  className?: string;
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  compact?: boolean;
}

const ExchangeBadge: React.FC<ExchangeBadgeProps> = ({ 
  acceptsExchange, 
  className = '',
  variant = 'default',
  compact = false
}) => {
  const { t } = useLanguage();

  console.log('🔍 ExchangeBadge Debug:', { acceptsExchange, compact });

  if (!acceptsExchange) {
    // Show "No" status only in non-compact mode
    if (compact) return null;
    
    return (
      <Badge 
        variant={variant} 
        className={`flex items-center gap-1 bg-gray-100 text-gray-600 border-gray-200 text-xs px-2 py-1 w-fit min-w-0 max-w-full ${className}`}
        title={t('vehicles.noExchange')}
      >
        <ArrowLeftRight className="h-3 w-3 flex-shrink-0" />
        <span className="truncate">{t('vehicles.noExchange')}</span>
      </Badge>
    );
  }

  return (
    <Badge 
      variant={variant} 
      className={`flex items-center gap-1 ${
        compact 
          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 text-xs px-1.5 py-0.5 w-fit min-w-0 max-w-full' 
          : 'bg-emerald-100 text-emerald-800 border-emerald-300 text-xs px-2 py-1 w-fit min-w-0 max-w-full'
      } ${className}`}
      title={compact ? t('vehicles.exchange') : t('vehicles.acceptExchange')}
    >
      <ArrowLeftRight className={compact ? "h-2.5 w-2.5 flex-shrink-0" : "h-3 w-3 flex-shrink-0"} />
      <span className="truncate">{compact ? t('vehicles.exchange') : t('vehicles.acceptExchange')}</span>
    </Badge>
  );
};

export default ExchangeBadge;
