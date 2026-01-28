import { Skeleton } from "@/components/ui/skeleton";

export const VehicleCardSkeleton = () => {
  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden shadow-sm">
      {/* Image skeleton */}
      <Skeleton className="w-full h-48 bg-secondary" />
      
      {/* Content skeleton */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <Skeleton className="h-6 w-3/4 bg-secondary" />
        
        {/* Price and details */}
        <div className="flex justify-between items-center">
          <Skeleton className="h-5 w-24 bg-secondary" />
          <Skeleton className="h-5 w-20 bg-secondary" />
        </div>
        
        {/* Specs */}
        <div className="flex gap-2">
          <Skeleton className="h-4 w-16 bg-secondary" />
          <Skeleton className="h-4 w-16 bg-secondary" />
          <Skeleton className="h-4 w-16 bg-secondary" />
        </div>
        
        {/* Action buttons */}
        <div className="flex gap-2 pt-2">
          <Skeleton className="h-10 flex-1 bg-secondary" />
          <Skeleton className="h-10 w-10 bg-secondary" />
        </div>
      </div>
    </div>
  );
};

export const VehicleCardSkeletonGrid = ({ count = 6 }: { count?: number }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <VehicleCardSkeleton key={i} />
      ))}
    </div>
  );
};
