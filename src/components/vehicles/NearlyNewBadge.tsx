import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Sparkles } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface NearlyNewBadgeProps {
  isNearlyNew: boolean;
}

const NearlyNewBadge: React.FC<NearlyNewBadgeProps> = ({ isNearlyNew }) => {
  const { t } = useLanguage();
  
  if (!isNearlyNew) return null;

  return (
    <Badge 
      variant="outline" 
      className="bg-amber-500/20 text-amber-400 border-amber-500/30 flex items-center gap-1 text-xs px-2 py-1 w-fit min-w-0 max-w-full"
      title={t('vehicles.nearlyNew')}
    >
      <Sparkles className="h-3 w-3 flex-shrink-0" />
      <span className="truncate">{t('vehicles.nearlyNew')}</span>
    </Badge>
  );
};

export default NearlyNewBadge;