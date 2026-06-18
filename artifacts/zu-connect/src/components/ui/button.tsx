import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const spinner = (
  <svg
    className="size-4 animate-spin"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
  </svg>
)

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all " +
  "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring " +
  "disabled:pointer-events-none disabled:opacity-50 " +
  "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 " +
  "hover:opacity-90 active:scale-[0.98] " +
  "[dir=\"rtl\"]&:flex-row-reverse",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground border border-primary-border",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm border-destructive-border",
        outline:
          "border [border-color:var(--button-outline)] shadow-xs active:shadow-none",
        secondary:
          "border bg-secondary text-secondary-foreground border border-secondary-border",
        ghost: "border border-transparent",
        link: "text-primary underline-offset-4 hover:underline",
        /* premium variants */
        glass:
          "glass-card hover:shadow-glass active:scale-[0.97]",
        gradient:
          "relative overflow-hidden text-white border-0 " +
          "bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(262_80%_54%)] " +
          "shadow-md hover:shadow-lg hover:opacity-95 active:scale-[0.97] " +
          "before:absolute before:inset-0 before:bg-gradient-to-r " +
          "before:from-transparent before:via-white/15 before:to-transparent " +
          "before:-translate-x-full hover:before:translate-x-full " +
          "before:transition-transform before:duration-700",
        clay:
          "clay-button",
        glow:
          "relative bg-primary text-primary-foreground border border-primary-border " +
          "shadow-[0_0_12px_hsl(var(--primary)/0.3)] " +
          "hover:shadow-[0_0_24px_hsl(var(--primary)/0.5)] active:scale-[0.97]",
      },
      size: {
        default: "min-h-9 px-4 py-2",
        sm: "min-h-8 rounded-md px-3 text-xs",
        lg: "min-h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && spinner}
        {children}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
