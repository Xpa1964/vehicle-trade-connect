
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
      "border border-gray-100 group touch-manipulation overflow-hidden",
      "bg-white relative",
      className
    )}
  >
    {/* Badge flotante */}
    {badge && (
      <div className="absolute top-3 right-3 bg-gradient-to-r from-blue-600 to-blue-800 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg z-20 uppercase tracking-wide">
        {badge}
      </div>
    )}
    
    {/* Image section - 80% height */}
    {backgroundImage ? (
      <div 
        className="w-full h-[80%] bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${backgroundImage})`, backgroundPosition: imagePosition }}
      />
    ) : (
      <div className="w-full h-[80%] flex items-center justify-center bg-gradient-to-br from-auto-blue/5 to-auto-blue/10">
        <div className="transform transition-transform group-hover:scale-110 duration-300 text-auto-blue">
          <Icon size={48} className="w-12 h-12 sm:w-16 sm:h-16" />
        </div>
      </div>
    )}
    
    {/* Content section - 20% height */}
    <div className="p-3 sm:p-4 flex flex-col flex-1 bg-white">
      <h3 className="text-sm sm:text-base font-semibold mb-1.5 leading-tight text-gray-800">
        {title}
      </h3>
      <p className="text-xs sm:text-xs mb-2 leading-relaxed flex-1 text-gray-700">
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
