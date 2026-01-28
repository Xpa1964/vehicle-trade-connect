import React from 'react';
import { cn } from '@/lib/utils';

interface HighlightBoxProps {
  children: React.ReactNode;
  variant?: 'orange' | 'red' | 'green' | 'blue';
  className?: string;
}

const HighlightBox: React.FC<HighlightBoxProps> = ({
  children,
  variant = 'orange',
  className
}) => {
  const variantStyles = {
    orange: 'border-brand-orange/30 bg-brand-orange/5 shadow-sm',
    red: 'border-error-400/30 bg-error/5 shadow-sm',
    green: 'border-brand-green/30 bg-brand-green/5 shadow-sm',
    blue: 'border-brand-blue/30 bg-brand-blue/5 shadow-sm'
  };

  return (
    <div className={cn(
      'border-2 rounded-lg p-4',
      variantStyles[variant],
      className
    )}>
      {children}
    </div>
  );
};

export default HighlightBox;