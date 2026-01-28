
import React from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: number;
  showValue?: boolean;
  className?: string;
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxRating = 5,
  size = 16,
  showValue = false,
  className,
  interactive = false,
  onRatingChange
}) => {
  const [hoveredRating, setHoveredRating] = React.useState(0);

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= maxRating; i++) {
      const isFilled = i <= (interactive ? (hoveredRating || rating) : rating);
      const isHalfFilled = !interactive && i - 0.5 === rating;

      stars.push(
        <button
          key={i}
          type="button"
          disabled={!interactive}
          className={cn(
            "focus:outline-none transition-all duration-200",
            interactive && "hover:scale-125 cursor-pointer transform",
            !interactive && "cursor-default"
          )}
          onMouseEnter={interactive ? () => setHoveredRating(i) : undefined}
          onMouseLeave={interactive ? () => setHoveredRating(0) : undefined}
          onClick={interactive ? () => onRatingChange?.(i) : undefined}
        >
          <Star
            size={size}
            className={cn(
              "transition-all duration-200",
              isFilled || isHalfFilled
                ? "text-yellow-400 fill-yellow-400 drop-shadow-sm"
                : "text-gray-300 hover:text-yellow-300",
              interactive && "hover:drop-shadow-md"
            )}
          />
        </button>
      );
    }
    return stars;
  };

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex items-center">
        {renderStars()}
      </div>
      {showValue && (
        <span className="ml-2 text-sm font-bold text-gray-700">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
};

export default StarRating;
