import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-none text-sm font-display lowercase focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 transition-all active:translate-y-1",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-white border-4 border-foreground shadow-[0_4px_0_0_rgba(0,0,0,0.1)] hover:bg-primary/90",
        destructive:
          "bg-health-critical text-white border-4 border-foreground shadow-[0_4px_0_0_rgba(0,0,0,0.1)]",
        outline:
          "bg-white border-4 border-foreground text-foreground shadow-[0_4px_0_0_rgba(0,0,0,0.1)] hover:bg-muted",
        secondary: "bg-secondary text-secondary-foreground border-4 border-foreground shadow-[0_4px_0_0_rgba(0,0,0,0.1)]",
        ghost: "border-4 border-transparent hover:bg-muted",
      },
      size: {
        default: "h-12 px-6 py-2",
        sm: "h-10 px-4 text-xs",
        lg: "h-14 px-10 text-base",
        icon: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  },
)
Button.displayName = "Button"

export { Button, buttonVariants }
