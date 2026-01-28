
import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

export interface LabelProps
  extends React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>,
    VariantProps<typeof labelVariants> {
  required?: boolean;
}

const labelVariants = cva(
  "text-base md:text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 touch-manipulation"
)

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  LabelProps
>(({ className, required, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants(), "select-none", className)}
    aria-required={required ? "true" : undefined}
    {...props}
  >
    {props.children}
    {required ? (
      <span aria-hidden="true" className="ml-1 text-red-500 font-bold">*</span>
    ) : null}
  </LabelPrimitive.Root>
))
Label.displayName = LabelPrimitive.Root.displayName

export { Label }
