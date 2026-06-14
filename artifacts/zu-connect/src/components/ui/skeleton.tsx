import { cn } from "@/lib/utils"
import { useReducedMotion } from "@/hooks/use-reduced-motion"

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "card" | "circle" | "rect"
}

function Skeleton({
  className,
  variant = "rect",
  ...props
}: SkeletonProps) {
  const prefersReducedMotion = useReducedMotion()

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
