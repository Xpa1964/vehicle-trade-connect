
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface ErrorStateProps {
  message?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ message }) => {
  const { t } = useLanguage();
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center text-red-500">
        <h2 className="text-2xl font-bold mb-4">{t('common.error')}</h2>
        <p>{message || t('vehicles.notFound')}</p>
      </div>
    </div>
  );
};
