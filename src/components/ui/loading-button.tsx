import * as React from "react";
import { Button, ButtonProps } from "./button";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * LoadingButton - Button with built-in loading state
 * Simplifies common pattern of buttons that trigger async operations
 */

export interface LoadingButtonProps extends ButtonProps {
  isLoading?: boolean;
  loadingText?: string;
}

export const LoadingButton = React.forwardRef<
  HTMLButtonElement,
  LoadingButtonProps
>(({ children, isLoading, loadingText, disabled, className, ...props }, ref) => {
  return (
    <Button
      ref={ref}
      disabled={disabled || isLoading}
      className={cn(className)}
      aria-busy={isLoading ? "true" : "false"}
      {...props}
    >
      {isLoading && (
        <Loader2 
          className="mr-2 h-4 w-4 animate-spin" 
          aria-hidden="true"
        />
      )}
      {isLoading && loadingText ? loadingText : children}
    </Button>
  );
});

LoadingButton.displayName = "LoadingButton";
