import React from 'react';
import { Link } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import SafeImage from '@/components/shared/SafeImage';

interface ControlPanelCardProps {
  icon?: LucideIcon;
  imageUrl?: string;
  imageId?: string;
  title: string;
  description: string;
  href: string;
}

const ControlPanelCard: React.FC<ControlPanelCardProps> = ({
  icon: Icon,
  imageUrl,
  imageId,
  title,
  description,
  href
}) => {
  return (
    <Link to={href}>
      <Card className="h-full hover:shadow-lg transition-all duration-200 hover:scale-105 cursor-pointer border-border bg-card text-card-foreground">
        <CardContent className="p-4">
          <div className="flex flex-col items-center text-center space-y-3">
            <div className={imageUrl || imageId ? "w-16 h-16 rounded-full overflow-hidden bg-muted" : "p-3 rounded-full bg-primary/10"}>
              {imageId ? (
                <SafeImage
                  imageId={imageId}
                  alt={title}
                  className="w-full h-full object-contain"
                />
              ) : imageUrl ? (
                <SafeImage
                  src={imageUrl}
                  alt={title}
                  className="w-full h-full object-contain"
                />
              ) : Icon ? (
                <Icon className="h-6 w-6 text-primary" />
              ) : null}
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">
                {title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {description}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ControlPanelCard;