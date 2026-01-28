
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export const LoadingState: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <div className="container mx-auto px-4 py-12 flex items-center justify-center">
      <div className="animate-pulse text-xl">{t('common.loading')}</div>
    </div>
  );
};
