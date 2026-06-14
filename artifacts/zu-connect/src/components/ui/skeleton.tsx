import { cn } from "@/lib/utils"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import type { LucideIcon } from "lucide-react"

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "card" | "circle" | "rect"
  icon?: LucideIcon
}

function Skeleton({
  className,
  variant = "rect",
  icon: Icon,
  ...props
}: SkeletonProps) {
  const prefersReducedMotion = useReducedMotion()

  if (Icon) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-primary/5 rounded-2xl",
          className
        )}
        {...props}
      >
        <Icon className={cn("text-primary/30", variant === "circle" ? "w-8 h-8" : "w-10 h-10")} />
      </div>
    )
  }

  return (
    <div
      className={cn(
        prefersReducedMotion ? "bg-primary/10" : "animate-pulse bg-primary/10",
        variant === "circle" && "rounded-full",
        variant === "card" && "rounded-2xl",
        variant === "text" && "h-4 w-full rounded-md",
        variant === "rect" && "rounded-md",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
