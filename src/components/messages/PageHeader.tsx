
import React from 'react';
import { MessageSquare } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const PageHeader: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center space-x-3">
        <MessageSquare className="h-8 w-8 text-blue-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {t('messages.title')}
          </h1>
          <p className="text-gray-600">
            {t('messages.description')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
