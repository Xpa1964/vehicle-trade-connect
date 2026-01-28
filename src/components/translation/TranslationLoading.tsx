
import React from 'react';

interface TranslationLoadingProps {
  loadingMessage: string;
}

const TranslationLoading: React.FC<TranslationLoadingProps> = ({ loadingMessage }) => {
  return <p className="text-sm opacity-70">{loadingMessage}</p>;
};

export default TranslationLoading;
