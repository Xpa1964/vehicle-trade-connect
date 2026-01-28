
import React, { ReactNode, memo } from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = memo(({ icon, title, description }) => {
  return (
    <Card className="p-3 sm:p-4 hover:shadow-lg transition-shadow duration-300 touch-manipulation h-full">
      <CardContent className="p-4 sm:p-6 flex flex-col items-center text-center h-full">
        <div className="h-10 w-10 sm:h-12 sm:w-12 text-primary mb-3 sm:mb-4 flex-shrink-0">
          {icon}
        </div>
        <h3 className="text-base sm:text-lg font-semibold mb-2 leading-tight text-foreground">{title}</h3>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed flex-1">{description}</p>
      </CardContent>
    </Card>
  );
});

FeatureCard.displayName = 'FeatureCard';

export default FeatureCard;
