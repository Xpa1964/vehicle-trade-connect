
import React from 'react';
import { Button } from '@/components/ui/button';

interface TranslationToggleProps {
  showOriginal: boolean;
  onToggle: () => void;
  showOriginalText: string;
  showTranslationText: string;
  className?: string;
}

const TranslationToggle: React.FC<TranslationToggleProps> = ({
  showOriginal,
  onToggle,
  showOriginalText,
  showTranslationText,
  className = ''
}) => {
  return (
    <Button 
      variant="link" 
      onClick={onToggle} 
      className={`text-xs p-0 h-auto ${className}`}
    >
      {showOriginal ? showTranslationText : showOriginalText}
    </Button>
  );
};

export default TranslationToggle;
