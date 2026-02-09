import React from 'react';
import ControlPanelCard from './ControlPanelCard';
import { LucideIcon } from 'lucide-react';

interface ControlPanelItem {
  icon?: LucideIcon;
  imageUrl?: string;
  imageId?: string;
  title: string;
  description: string;
  href: string;
}

interface ControlPanelSectionProps {
  title: string;
  items: ControlPanelItem[];
  colorClass?: string;
}

const ControlPanelSection: React.FC<ControlPanelSectionProps> = ({
  title,
  items,
  colorClass = "border-border bg-secondary/30"
}) => {
  return (
    <div className={`rounded-lg border p-6 ${colorClass}`}>
      <h2 className="text-xl font-semibold text-foreground mb-4">
        {title}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {items.map((item, index) => (
          <ControlPanelCard
            key={index}
            icon={item.icon}
            imageUrl={item.imageUrl}
            imageId={item.imageId}
            title={item.title}
            description={item.description}
            href={item.href}
          />
        ))}
      </div>
    </div>
  );
};

export default ControlPanelSection;