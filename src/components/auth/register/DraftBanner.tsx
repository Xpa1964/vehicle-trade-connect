
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { FileCheck, Clock, X } from 'lucide-react';

interface DraftBannerProps {
  draftId: string;
  updatedAt: string;
  onLoad: () => void;
  onDismiss: () => void;
}

const DraftBanner: React.FC<DraftBannerProps> = ({
  draftId,
  updatedAt,
  onLoad,
  onDismiss
}) => {
  const { t } = useLanguage();
  const formattedDate = new Date(updatedAt).toLocaleString();
  
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileCheck className="h-5 w-5 text-blue-600" />
          <div>
            <h3 className="font-medium text-blue-900">
              {t('auth.register.draftFound')}
            </h3>
            <p className="text-sm text-blue-700 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {t('auth.register.savedOn')} {formattedDate}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onLoad}
          >
            {t('auth.register.continueDraft')}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onDismiss}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DraftBanner;
