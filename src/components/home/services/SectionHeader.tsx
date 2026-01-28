
import React, { memo } from 'react';

interface SectionHeaderProps {
  title: string;
  subtitle: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = memo(({
  title,
  subtitle
}) => (
  <div className="text-center mb-8 sm:mb-10 lg:mb-12 px-4 sm:px-0">
    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 text-primary leading-tight">
      {title}
    </h2>
    <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
      {subtitle}
    </p>
  </div>
));

SectionHeader.displayName = 'SectionHeader';

export default SectionHeader;
