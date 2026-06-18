import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/* ── Variants ──────────────────────────────────────────── */
const badgeVariants = cva(
  "inline-flex items-center whitespace-nowrap text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow-xs",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow-xs",
        outline:
          "text-foreground border [border-color:var(--badge-outline,var(--border))]",
        /* New semantic variants */
        success:
          "border-transparent bg-emerald-600/15 text-emerald-700 dark:text-emerald-400 shadow-xs",
        warning:
          "border-transparent bg-amber-500/15 text-amber-700 dark:text-amber-400 shadow-xs",
        error:
          "border-transparent bg-red-600/15 text-red-700 dark:text-red-400 shadow-xs",
        info:
          "border-transparent bg-sky-600/15 text-sky-700 dark:text-sky-400 shadow-xs",
        neutral:
          "border-transparent bg-muted text-muted-foreground",
      },
      size: {
        sm: "px-1.5 py-0.5 text-[10px]",
        md: "px-2.5 py-0.5 text-xs",
        lg: "px-3 py-1 text-sm",
      },
    },
    compoundVariants: [
      /* Dot variant: none of the size padding, just the dot */
    ],
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
)

/* ── Dot variant (used via `dot` prop, a small circle indicator) */
const dotVariants = cva(
  "inline-block shrink-0 rounded-full",
  {
    variants: {
      variant: {
        default: "bg-primary",
        secondary: "bg-secondary",
        destructive: "bg-destructive",
        outline: "bg-foreground/60",
        success: "bg-emerald-500",
        warning: "bg-amber-500",
        error: "bg-red-500",
        info: "bg-sky-500",
        neutral: "bg-muted-foreground",
      },
      size: {
        sm: "h-1.5 w-1.5",
        md: "h-2 w-2",
        lg: "h-2.5 w-2.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
)

/* ── Props ─────────────────────────────────────────────── */
export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  /** Show a dot indicator instead of text (or alongside text) */
  dot?: boolean
  /** Render as a dot-only indicator (no text wrapper) */
  dotOnly?: boolean
  /** Apply gradient background */
  gradient?: boolean
}

/* ── Component ─────────────────────────────────────────── */
function Badge({
  className,
  variant = "default",
  size,
  dot,
  dotOnly,
  gradient,
  children,
  ...props
}: BadgeProps) {
  /* Dot-only badge */
  if (dotOnly) {
    return (
      <span
        className={cn(dotVariants({ variant, size }), className)}
        role="status"
        aria-label={typeof children === "string" ? children : undefined}
        {...props}
      />
    )
  }

  return (
    <div
      className={cn(
        badgeVariants({ variant, size }),
        gradient && "bg-gradient-to-r from-primary via-[hsl(262_80%_60%)] to-primary text-primary-foreground border-transparent",
        className,
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn(dotVariants({ variant, size }), "me-1.5")}
          aria-hidden
        />
      )}
      {children}
    </div>
  )
}

export { Badge, badgeVariants }
