
import * as React from "react"

import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, "aria-invalid": ariaInvalid, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[100px] md:min-h-[80px] w-full rounded-md border border-input bg-background px-4 md:px-3 py-3 md:py-2 text-base md:text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 resize-y touch-manipulation",
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
Textarea.displayName = "Textarea"

export { Textarea }
