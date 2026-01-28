import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Receipt } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useLanguage } from '@/contexts/LanguageContext';

interface IvaBadgeProps {
  ivaStatus: 'included' | 'notIncluded' | 'deductible' | 'rebu';
  compact?: boolean;
  className?: string;
}

const IvaBadge: React.FC<IvaBadgeProps> = ({ 
  ivaStatus, 
  compact = false,
  className = ''
}) => {
  const { t } = useLanguage();
  
  const getIvaText = (status: string) => {
    switch (status) {
      case 'included':
        return compact ? t('vehicles.ivaIncludedShort') : t('vehicles.ivaIncluded');
      case 'notIncluded':
        return compact ? t('vehicles.ivaNotIncludedShort') : t('vehicles.ivaNotIncluded');
      case 'deductible':
        return compact ? t('vehicles.ivaDeductibleShort') : t('vehicles.ivaDeductible');
      case 'rebu':
        return compact ? t('vehicles.rebuShort') : t('vehicles.rebu');
      default:
        return compact ? t('vehicles.ivaIncludedShort') : t('vehicles.ivaIncluded');
    }
  };

  const getIvaColor = (status: string) => {
    switch (status) {
      case 'included':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'notIncluded':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'deductible':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'rebu':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      default:
        return 'bg-green-100 text-green-800 border-green-300';
    }
  };

  const getTooltipText = (status: string) => {
    switch (status) {
      case 'included':
        return t('vehicles.ivaIncludedTooltip');
      case 'notIncluded':
        return t('vehicles.ivaNotIncludedTooltip');
      case 'deductible':
        return t('vehicles.ivaDeductibleTooltip');
      case 'rebu':
        return t('vehicles.rebuTooltip');
      default:
        return t('vehicles.ivaIncludedTooltip');
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge 
            className={`flex items-center gap-1 ${getIvaColor(ivaStatus)} ${
              compact ? 'text-xs px-1.5 py-0.5 w-fit min-w-0 max-w-full' : 'text-xs px-2 py-1 w-fit min-w-0 max-w-full'
            } ${className}`}
          >
            <Receipt className={compact ? 'h-2.5 w-2.5 flex-shrink-0' : 'h-3 w-3 flex-shrink-0'} />
            <span className="truncate">{getIvaText(ivaStatus)}</span>
          </Badge>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <p className="text-sm">
            {getTooltipText(ivaStatus)}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default IvaBadge;