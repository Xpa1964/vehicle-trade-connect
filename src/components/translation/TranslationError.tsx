
import React from 'react';

interface TranslationErrorProps {
  originalText: string;
  errorMessage: string;
}

const TranslationError: React.FC<TranslationErrorProps> = ({ originalText, errorMessage }) => {
  return (
    <>
      <p>{originalText}</p>
      <p className="text-xs text-red-500 mt-1">{errorMessage}</p>
    </>
  );
};

export default TranslationError;
