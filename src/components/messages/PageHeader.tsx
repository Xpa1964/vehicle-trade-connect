
import React from 'react';
import { MessageSquare } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const PageHeader: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="bg-card border-b border-border px-6 py-4">
      <div className="flex items-center space-x-3">
        <MessageSquare className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {t('messages.title')}
          </h1>
          <p className="text-muted-foreground">
            {t('messages.description')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
