
import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ServiceCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  linkText: string;
  linkPath: string;
  className?: string;
  backgroundImage?: string;
  gradient?: string;
  imagePosition?: string;
  badge?: string;
}

const ServiceCard: React.FC<ServiceCardProps> = memo(({
  icon: Icon,
  title,
  description,
  linkText,
  linkPath,
  className,
  backgroundImage,
  gradient,
  imagePosition = 'center 35%',
  badge
}) => (
  <div 
    className={cn(
      "rounded-lg shadow-lg transition-all duration-300", 
      "hover:-translate-y-1 sm:hover:-translate-y-2 hover:shadow-xl",
      "h-full flex flex-col min-h-[240px] sm:min-h-[280px]",
      "border border-border group touch-manipulation overflow-hidden",
      "bg-card relative",
      className
    )}
  >
    {/* Badge flotante */}
    {badge && (
      <div className="absolute top-3 right-3 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-3 py-1.5 rounded-full text-xs font-bold shadow-lg z-20 uppercase tracking-wide">
        {badge}
      </div>
    )}
    
    {/* Image section - fixed aspect ratio to prevent cropping */}
    {backgroundImage ? (
      <div className="w-full aspect-[16/10] relative overflow-hidden">
        <img 
          src={backgroundImage} 
          alt={title}
          className="w-full h-full object-cover object-center"
          style={{ objectPosition: imagePosition }}
          loading="lazy"
        />
      </div>
    ) : (
      <div className="w-full aspect-[16/10] flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10">
        <div className="transform transition-transform group-hover:scale-110 duration-300 text-primary">
          <Icon size={48} className="w-12 h-12 sm:w-16 sm:h-16" />
        </div>
      </div>
    )}
    
    {/* Content section - 20% height */}
    <div className="p-3 sm:p-4 flex flex-col flex-1 bg-card">
      <h3 className="text-sm sm:text-base font-semibold mb-1.5 leading-tight text-foreground">
        {title}
      </h3>
      <p className="text-xs sm:text-xs mb-2 leading-relaxed flex-1 text-muted-foreground">
        {description}
      </p>
      <Link to={linkPath} className="mt-auto">
        <Button 
          variant="outline"
          className="w-full group/btn h-8 sm:h-9 text-xs touch-manipulation font-medium"
        >
          {linkText}
          <ExternalLink className="ml-2 h-3 w-3 transition-transform group-hover/btn:translate-x-1" />
        </Button>
      </Link>
    </div>
  </div>
));

ServiceCard.displayName = 'ServiceCard';

export default ServiceCard;
