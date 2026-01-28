import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Users } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useLanguage } from '@/contexts/LanguageContext';

interface CommissionSaleBadgeProps {
  isCommissionSale: boolean;
  compact?: boolean;
  className?: string;
}

const CommissionSaleBadge: React.FC<CommissionSaleBadgeProps> = ({ 
  isCommissionSale, 
  compact = false,
  className = ''
}) => {
  const { t } = useLanguage();
  
  if (!isCommissionSale) return null;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge 
            className={`flex items-center gap-1 bg-purple-500/20 text-purple-400 border-purple-500/30 ${
              compact ? 'text-xs px-1.5 py-0.5 w-fit min-w-0 max-w-full' : 'text-xs px-2 py-1 w-fit min-w-0 max-w-full'
            } ${className}`}
          >
            <Users className={compact ? 'h-2.5 w-2.5 flex-shrink-0' : 'h-3 w-3 flex-shrink-0'} />
            <span className="truncate">{compact ? t('vehicles.commission') : t('vehicles.commissionSale')}</span>
          </Badge>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs bg-card border-border text-foreground">
          <p className="text-sm">
            {t('vehicles.commissionSaleTooltip')}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default CommissionSaleBadge;