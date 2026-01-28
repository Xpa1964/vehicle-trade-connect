
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Link } from 'react-router-dom';
import StarRating from './StarRating';
import { CheckCircle2, User, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReputationBadgeProps {
  rating: number;
  totalRatings: number;
  verifiedRatings: number;
  userId?: string;
  userName?: string;
  className?: string;
  showHoverCard?: boolean;
}

const ReputationBadge: React.FC<ReputationBadgeProps> = ({ 
  rating, 
  totalRatings,
  verifiedRatings,
  userId,
  userName,
  className,
  showHoverCard = false
}) => {
  // Determine badge color based on rating
  const getBadgeColor = () => {
    if (rating >= 4.5) return "bg-green-100 text-green-800 border-green-300";
    if (rating >= 3.5) return "bg-blue-100 text-blue-800 border-blue-300";
    if (rating >= 2.5) return "bg-yellow-100 text-yellow-800 border-yellow-300";
    return "bg-red-100 text-red-800 border-red-300";
  };

  const badgeContent = (
    <div className={cn("flex items-center", className)}>
      <Badge className={cn(getBadgeColor(), "flex items-center gap-1 py-1 px-2")}>
        <StarRating rating={rating} size={12} />
        <span className="ml-0.5">{rating.toFixed(1)}</span>
        {verifiedRatings > 0 && (
          <CheckCircle2 className="h-3 w-3 ml-0.5" />
        )}
      </Badge>
    </div>
  );

  if (showHoverCard && userId) {
    return (
      <HoverCard>
        <HoverCardTrigger asChild>
          {badgeContent}
        </HoverCardTrigger>
        <HoverCardContent className="w-64 p-4">
          <div className="flex items-center space-x-2">
            <div className="rounded-full bg-gray-100 p-2">
              <User className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-sm font-semibold">{userName || 'Usuario'}</h4>
              <StarRating rating={rating} size={16} />
            </div>
          </div>
          
          <div className="mt-2 text-xs text-gray-500">
            <p>{rating.toFixed(1)} de 5 estrellas basado en {totalRatings} valoraciones</p>
            {verifiedRatings > 0 && (
              <p className="text-green-600 flex items-center mt-1">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                {verifiedRatings} valoraciones verificadas
              </p>
            )}
          </div>
          
          <div className="mt-3">
            <Link 
              to={`/user/${userId}`}
              className="text-xs text-auto-blue hover:underline flex items-center"
            >
              <Star className="h-3 w-3 mr-1" />
              Ver todas las valoraciones
            </Link>
          </div>
        </HoverCardContent>
      </HoverCard>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {badgeContent}
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs">
            {rating.toFixed(1)} de 5 estrellas basado en {totalRatings} valoraciones
            {verifiedRatings > 0 && (
              <> ({verifiedRatings} verificadas)</>
            )}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ReputationBadge;
