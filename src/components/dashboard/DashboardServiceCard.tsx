import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useStaticImage } from '@/hooks/useStaticImage';

interface DashboardServiceCardProps {
  imageId: string;
  title: string;
  primaryAction: { label: string; href: string };
  secondaryAction?: { label: string; href: string };
  onClick?: () => void;
}

const DashboardServiceCard: React.FC<DashboardServiceCardProps> = ({
  imageId,
  title,
  primaryAction,
  secondaryAction,
  onClick
}) => {
  const { src } = useStaticImage(imageId);

  const cardContent = (
    <div className="group relative overflow-hidden rounded-xl border border-border/50 aspect-video cursor-pointer">
      {/* Background Image */}
      <img
        src={src}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />

      {/* Overlay Gradiente */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

      {/* Contenido */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h3 className="text-lg font-semibold text-white mb-3">{title}</h3>
        <div className="flex gap-2">
          {onClick ? (
            <Button
              size="sm"
              variant="secondary"
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-white/30"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              {primaryAction.label}
            </Button>
          ) : (
            <Link to={primaryAction.href} onClick={(e) => e.stopPropagation()}>
              <Button
                size="sm"
                variant="secondary"
                className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-white/30"
              >
                {primaryAction.label}
              </Button>
            </Link>
          )}
          {secondaryAction && (
            <Link to={secondaryAction.href} onClick={(e) => e.stopPropagation()}>
              <Button
                size="sm"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10"
              >
                {secondaryAction.label}
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );

  if (onClick) {
    return (
      <div onClick={onClick}>
        {cardContent}
      </div>
    );
  }

  return (
    <Link to={primaryAction.href} className="block">
      {cardContent}
    </Link>
  );
};

export default DashboardServiceCard;
