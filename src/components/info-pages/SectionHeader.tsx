
import React, { memo } from 'react';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = memo(({ title, subtitle, description }) => {
  return (
    <div className="text-center mb-8 sm:mb-10 lg:mb-12 px-4 sm:px-0">
      <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4 text-auto-blue leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 mb-4 sm:mb-6 leading-relaxed">
          {subtitle}
        </p>
      )}
      {description && (
        <p className="max-w-3xl mx-auto text-sm sm:text-base text-gray-600 leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
});

SectionHeader.displayName = 'SectionHeader';

export default SectionHeader;
