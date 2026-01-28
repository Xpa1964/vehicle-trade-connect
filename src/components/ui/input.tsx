
import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, "aria-invalid": ariaInvalid, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 md:h-10 w-full rounded-md border border-input bg-background px-4 md:px-3 py-3 md:py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 touch-manipulation",
          ariaInvalid ? "border-red-600 bg-red-50" : "",
          className
        )}
        aria-invalid={ariaInvalid || undefined}
        aria-describedby={props["aria-describedby"] || undefined}
        aria-required={props.required ? "true" : undefined}
        ref={ref}
        {...props}
      />
    );
  }
)
Input.displayName = "Input"

export { Input }
