import { cn } from "@/lib/utils"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import type { LucideIcon } from "lucide-react"

/* ── Types ─────────────────────────────────────────────── */
interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?:
    | "text"
    | "card"
    | "circle"
    | "rect"
    | "table-row"
    | "avatar"
  icon?: LucideIcon
}

/* ── Shimmer overlay (shared) ──────────────────────────── */
function ShimmerOverlay({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "absolute inset-0 -translate-x-full animate-[shimmer-sweep_2s_ease-in-out_infinite]",
        "bg-gradient-to-r from-transparent via-white/15 to-transparent",
        "dark:via-white/8",
        className,
      )}
      aria-hidden
    />
  )
}

/* ── Variant map ───────────────────────────────────────── */
const variantStyles: Record<
  NonNullable<SkeletonProps["variant"]>,
  string
> = {
  text:     "h-4 w-full rounded-md",
  card:     "h-32 w-full rounded-2xl",
  circle:   "h-10 w-10 rounded-full",
  rect:     "h-20 w-full rounded-md",
  "table-row": "h-10 w-full rounded-md",
  avatar:   "h-10 w-10 rounded-full",
}

/* ── Component ─────────────────────────────────────────── */
function Skeleton({
  className,
  variant = "rect",
  icon: Icon,
  style,
  ...props
}: SkeletonProps) {
  const prefersReducedMotion = useReducedMotion()

  /* Icon variant — shows an icon instead of shimmer */
  if (Icon) {
    return (
      <div
        className={cn(
          "relative flex items-center justify-center overflow-hidden bg-primary/5 rounded-2xl",
          variant === "circle" || variant === "avatar" ? "rounded-full" : "rounded-2xl",
          variantStyles[variant],
          prefersReducedMotion ? "" : "",
          className,
        )}
        style={style}
        {...props}
      >
        {!prefersReducedMotion && <ShimmerOverlay />}
        <Icon
          className={cn(
            "text-primary/30",
            variant === "circle" || variant === "avatar" ? "w-8 h-8" : "w-10 h-10",
          )}
        />
      </div>
    )
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden",
        prefersReducedMotion
          ? "bg-primary/10"
          : "bg-primary/8",
        variantStyles[variant],
        "table-row" === variant && "min-h-10",
        "avatar" === variant && "shrink-0",
        className,
      )}
      style={style}
      {...props}
    >
      {!prefersReducedMotion && <ShimmerOverlay />}
    </div>
  )
}

export { Skeleton }
export type { SkeletonProps }
