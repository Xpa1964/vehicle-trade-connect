
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface ActivityLogHeaderProps {
  totalLogs: number;
  onExport: () => void;
  canExport: boolean;
}

const ActivityLogHeader: React.FC<ActivityLogHeaderProps> = ({ totalLogs, onExport, canExport }) => {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold">{t('admin.activityLog.title')}</h1>
        <p className="text-muted-foreground mt-1">{t('admin.activityLog.description')}</p>
        {totalLogs > 0 && (
          <p className="text-sm mt-2">
            {t('admin.activityLog.totalResults', { count: totalLogs })}
          </p>
        )}
      </div>
      
      {canExport && (
        <Button 
          variant="outline" 
          onClick={onExport} 
          className="flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          {t('admin.activityLog.export')}
        </Button>
      )}
    </div>
  );
};

export default ActivityLogHeader;
