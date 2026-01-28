
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-gray-200 text-gray-900 hover:bg-gray-300",
        secondary:
          "border-transparent bg-gray-300 text-gray-900 hover:bg-gray-400",
        destructive:
          "border-transparent bg-red-200 text-red-900 hover:bg-red-300",
        outline: "text-gray-900 border-gray-300",
        primary:
          "border-transparent bg-gray-800 text-white hover:bg-gray-900",
        gold: 
          "border-transparent bg-auto-gold text-white hover:bg-auto-gold/90"
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
