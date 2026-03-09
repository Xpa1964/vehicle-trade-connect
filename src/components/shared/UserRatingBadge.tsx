
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Shield } from 'lucide-react';
import StarRating from '@/components/ratings/StarRating';
import { useLanguage } from '@/contexts/LanguageContext';

interface UserRatingBadgeProps {
  averageRating: number;
  totalRatings: number;
  verifiedRatings?: number;
  compact?: boolean;
  showVerified?: boolean;
  starSize?: number;
}

const UserRatingBadge: React.FC<UserRatingBadgeProps> = ({
  averageRating,
  totalRatings,
  verifiedRatings = 0,
  compact = false,
  showVerified = true,
  starSize
}) => {
  const { t } = useLanguage();

  if (totalRatings === 0) {
    return (
      <Badge variant="outline" className="text-xs text-muted-foreground">
        {t('rating.noRatings')}
      </Badge>
    );
  }

  const getReputationLevel = (rating: number, count: number) => {
    if (count < 5) return { label: t('rating.reputationNew'), color: 'bg-muted text-foreground' };
    if (rating >= 4.5 && count >= 20) return { label: t('rating.reputationExpert'), color: 'bg-green-900/30 text-green-400' };
    if (rating >= 4.0 && count >= 10) return { label: t('rating.reputationTrusted'), color: 'bg-blue-900/30 text-blue-400' };
    if (rating >= 3.5) return { label: t('rating.reputationGood'), color: 'bg-yellow-900/30 text-yellow-400' };
    return { label: t('rating.reputationRegular'), color: 'bg-orange-900/30 text-orange-400' };
  };

  const reputation = getReputationLevel(averageRating, totalRatings);

  if (compact) {
    return (
      <div className="flex items-center gap-1">
        <StarRating rating={averageRating} size={starSize || 14} />
        <span className="text-xs text-foreground">
          {averageRating.toFixed(1)} ({totalRatings})
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <StarRating rating={averageRating} size={starSize || 20} showValue />
        <span className="text-sm text-foreground">({totalRatings} {t('rating.ratings')})</span>
      </div>
      
      <div className="flex items-center gap-2">
        <Badge className={reputation.color} variant="outline">
          {reputation.label}
        </Badge>
        
        {showVerified && verifiedRatings > 0 && (
          <Badge variant="outline" className="text-xs text-green-400 border-green-700">
            <Shield className="w-3 h-3 mr-1" />
            {verifiedRatings} {t('rating.verifiedCount')}
          </Badge>
        )}
      </div>
    </div>
  );
};

export default UserRatingBadge;
