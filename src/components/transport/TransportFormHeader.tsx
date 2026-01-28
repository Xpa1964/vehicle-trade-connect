
import React from 'react';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

const TransportFormHeader: React.FC = () => {
  const { t } = useLanguage();

  return (
    <CardHeader className="text-center px-4 py-6 md:px-6">
      <CardTitle className="text-lg md:text-xl lg:text-2xl font-bold">
        {t('transport.form.title')}
      </CardTitle>
      <CardDescription className="text-sm md:text-base mt-2 max-w-2xl mx-auto">
        {t('transport.form.description', { fallback: 'Complete the form to request a transport quote' })}
      </CardDescription>
    </CardHeader>
  );
};

export default TransportFormHeader;
