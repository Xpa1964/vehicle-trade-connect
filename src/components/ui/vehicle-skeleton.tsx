
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface VehicleCardSkeletonProps {
  className?: string;
  compact?: boolean;
}

const VehicleCardSkeleton: React.FC<VehicleCardSkeletonProps> = ({ 
  className,
  compact = false 
}) => {
  return (
    <div className={cn(
      "overflow-hidden rounded-lg border bg-white shadow-sm animate-pulse",
      className
    )}>
      {/* Image skeleton */}
      <div className={cn(
        "relative bg-gray-200",
        compact ? "aspect-[4/3]" : "h-48"
      )}>
        <Skeleton className="w-full h-full" />
        
        {/* Badge skeletons */}
        <div className="absolute top-2 right-2">
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        <div className="absolute top-2 left-2">
          <Skeleton className="h-4 w-6 rounded-sm" />
        </div>
      </div>

      {/* Content skeleton */}
      <div className="p-3 sm:p-4 space-y-3">
        {/* Title and price */}
        <div className="flex justify-between items-start">
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-6 w-20" />
          </div>
          {!compact && (
            <div className="ml-2 space-y-1">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 w-16" />
            </div>
          )}
        </div>

        {/* Details skeleton */}
        <div className="flex flex-wrap gap-1 sm:gap-2">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-14" />
        </div>

        {!compact && (
          <>
            {/* Description skeleton */}
            <div className="space-y-1">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-2/3" />
            </div>

            {/* Footer skeleton */}
            <div className="pt-2 border-t border-gray-100">
              <Skeleton className="h-4 w-24" />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default VehicleCardSkeleton;
