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
    <div className="group overflow-hidden rounded-xl border border-border bg-card">
      {/* Imagen 100% limpia - sin overlay */}
      <div className="aspect-video overflow-hidden">
        <img
          src={src}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Contenido debajo de la imagen */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-card-foreground mb-3">{title}</h3>
        <div className="flex gap-2">
          {onClick ? (
            <Button
              size="sm"
              variant="secondary"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              {primaryAction.label}
            </Button>
          ) : (
            <Link to={primaryAction.href} onClick={(e) => e.stopPropagation()}>
              <Button size="sm" variant="secondary">
                {primaryAction.label}
              </Button>
            </Link>
          )}
          {secondaryAction && (
            <Link to={secondaryAction.href} onClick={(e) => e.stopPropagation()}>
              <Button size="sm" variant="outline">
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
      <div onClick={onClick} className="cursor-pointer">
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
