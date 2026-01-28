import React from 'react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

interface StatusOverlayProps {
  status: 'sold' | 'reserved' | 'unavailable';
  position?: 'diagonal' | 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const StatusOverlay: React.FC<StatusOverlayProps> = ({ 
  status, 
  position = 'diagonal',
  size = 'md',
  className 
}) => {
  const { t } = useLanguage();

  const getStatusConfig = () => {
    switch (status) {
      case 'sold':
        return {
          text: t('vehicles.statusSold', { fallback: 'VENDIDO' }),
          bgColor: 'bg-red-600/85',
          textColor: 'text-white',
          borderColor: 'border-red-700/50',
          shadowColor: 'shadow-red-900/40'
        };
      case 'reserved':
        return {
          text: t('vehicles.statusReserved', { fallback: 'RESERVADO' }),
          bgColor: 'bg-orange-500/85',
          textColor: 'text-white',
          borderColor: 'border-orange-600/50',
          shadowColor: 'shadow-orange-900/40'
        };
      case 'unavailable':
        return {
          text: t('vehicles.statusUnavailable', { fallback: 'NO DISPONIBLE' }),
          bgColor: 'bg-gray-500/85',
          textColor: 'text-white',
          borderColor: 'border-gray-600/50',
          shadowColor: 'shadow-gray-900/40'
        };
      default:
        return {
          text: 'N/A',
          bgColor: 'bg-gray-500/85',
          textColor: 'text-white',
          borderColor: 'border-gray-600/50',
          shadowColor: 'shadow-gray-900/40'
        };
    }
  };

  const getPositionClasses = () => {
    switch (position) {
      case 'top-right':
        return 'top-0 right-0 origin-top-right';
      case 'top-left':
        return 'top-0 left-0 origin-top-left -rotate-45';
      case 'bottom-right':
        return 'bottom-0 right-0 origin-bottom-right rotate-45';
      case 'bottom-left':
        return 'bottom-0 left-0 origin-bottom-left';
      default:
        return 'top-0 right-0 origin-top-right';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'text-xs py-1.5 px-8 min-w-[140px]';
      case 'md':
        return 'text-sm py-2 px-10 min-w-[160px]';
      case 'lg':
        return 'text-base py-2.5 px-12 min-w-[180px]';
      default:
        return 'text-sm py-2 px-10 min-w-[160px]';
    }
  };

  const statusConfig = getStatusConfig();

  // Nuevo estilo diagonal - sello de tinta
  if (position === 'diagonal') {
    return (
      <div className={cn(
        'absolute inset-0 z-20 pointer-events-none flex items-center justify-center',
        className
      )}>
        <div className={cn(
          'transform -rotate-45',
          'font-black uppercase tracking-widest',
          'border-4 border-double',
          'shadow-2xl backdrop-blur-[1px]',
          statusConfig.bgColor,
          statusConfig.textColor,
          statusConfig.borderColor,
          statusConfig.shadowColor,
          getSizeClasses()
        )}>
          {statusConfig.text}
        </div>
      </div>
    );
  }

  // Mantener compatibilidad con estilo antiguo (triángulo)
  const sizeConfig = {
    triangle: size === 'sm' ? 'w-16 h-16' : size === 'lg' ? 'w-24 h-24' : 'w-20 h-20',
    text: size === 'sm' ? 'text-[8px] font-bold' : size === 'lg' ? 'text-[10px] font-bold' : 'text-[9px] font-bold'
  };

  return (
    <div className={cn(
      'absolute z-20 overflow-hidden pointer-events-none',
      getPositionClasses(),
      className
    )}>
      <div 
        className={cn(
          'relative transform rotate-45',
          sizeConfig.triangle,
          statusConfig.bgColor,
          statusConfig.borderColor,
          'border-b border-r'
        )}
        style={{
          clipPath: position === 'top-right' ? 'polygon(0 0, 100% 0, 100% 100%)' : undefined
        }}
      >
        <div className={cn(
          'absolute inset-0 flex items-center justify-center',
          'transform -rotate-45',
          sizeConfig.text,
          'leading-none tracking-tight'
        )}>
          <span className="whitespace-nowrap">
            {statusConfig.text}
          </span>
        </div>
      </div>
    </div>
  );
};

export default StatusOverlay;