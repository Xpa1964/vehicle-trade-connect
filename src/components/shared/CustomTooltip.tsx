
import React from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface CustomTooltipProps {
  content: string | React.ReactNode;
  children: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({
  content,
  children,
  side = "bottom",
  align = "start",
}) => {
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          {children}
        </TooltipTrigger>
        <TooltipContent 
          side={side} 
          align={align}
          className="max-w-md p-4 text-sm z-[99999] border border-border shadow-xl bg-popover text-popover-foreground rounded-lg"
          sideOffset={12}
          avoidCollisions={true}
          sticky="always"
        >
          <div className="space-y-2">
            {content}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default CustomTooltip;
