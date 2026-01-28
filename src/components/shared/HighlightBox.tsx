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
    orange: 'border-primary/30 bg-primary/10 shadow-sm',
    red: 'border-destructive/30 bg-destructive/10 shadow-sm',
    green: 'border-[#22C55E]/30 bg-[#22C55E]/10 shadow-sm',
    blue: 'border-[#0EA5E9]/30 bg-[#0EA5E9]/10 shadow-sm'
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