"use client"

import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"

import { cn } from "@/lib/utils"

/* ── Types ─────────────────────────────────────────────── */
type StatusPresence = "online" | "offline" | "away" | "busy"

interface AvatarProps
  extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> {
  /** Presence indicator — positioned bottom-end, RTL-aware */
  status?: StatusPresence
  /** Ring colour override (default: --background) */
  statusRing?: string
}

interface AvatarGroupProps {
  /** Ordered list of avatar elements to overlap */
  children: React.ReactNode
  /** Max avatars shown before +N overflow indicator */
  max?: number
  /** Size class for overflow avatar */
  size?: string
  /** Additional classNames */
  className?: string
}

/* ── Locals ────────────────────────────────────────────── */

/** Map presence → colour */
const STATUS_COLORS: Record<StatusPresence, string> = {
  online: "bg-emerald-500",
  offline: "bg-muted-foreground/40",
  away: "bg-amber-500",
  busy: "bg-red-500",
}

/** Element used as the status dot */
function StatusDot({
  presence,
  ring,
}: {
  presence: StatusPresence
  ring?: string
}) {
  return (
    <span
      className={cn(
        "absolute bottom-0 inset-inline-end-0 z-2 block h-2.5 w-2.5 rounded-full border-2",
        STATUS_COLORS[presence],
      )}
      style={{ borderColor: ring ?? "hsl(var(--background))" }}
      role="status"
      aria-label={presence}
    />
  )
}

/* ── Avatar Root ───────────────────────────────────────── */
const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  AvatarProps
>(({ className, status, statusRing, style, ...props }, ref) => (
  <span className="relative inline-flex shrink-0">
    <AvatarPrimitive.Root
      ref={ref}
      className={cn(
        "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
        className,
      )}
      style={style}
      {...props}
    />
    {status && <StatusDot presence={status} ring={statusRing} />}
  </span>
))
Avatar.displayName = AvatarPrimitive.Root.displayName

/* ── Image & Fallback ──────────────────────────────────── */
const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square h-full w-full", className)}
    {...props}
  />
))
AvatarImage.displayName = AvatarPrimitive.Image.displayName

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted text-xs font-medium",
      className,
    )}
    {...props}
  />
))
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

/* ── Group (stacked display) ───────────────────────────── */
function AvatarGroup({
  children,
  max = 4,
  size = "h-10 w-10",
  className,
}: AvatarGroupProps) {
  const items = React.Children.toArray(children).filter(Boolean)
  const visible = items.slice(0, max)
  const overflow = items.length - max

  return (
    <div
      className={cn("flex flex-row-reverse justify-end ps-2", className)}
      dir="ltr"
    >
      {/* Overflow indicator */}
      {overflow > 0 && (
        <span
          className={cn(
            "relative flex shrink-0 items-center justify-center rounded-full border-2 border-background bg-muted text-[10px] font-medium text-muted-foreground -me-2",
            size,
          )}
        >
          +{overflow}
        </span>
      )}

      {/* Stacked avatars — each overlaps the next via negative margin */}
      {visible.map((child, i) => (
        <div
          key={i}
          className={cn("-me-2 [&>span]:-me-0")}
        >
          {child}
        </div>
      ))}
    </div>
  )
}
AvatarGroup.displayName = "AvatarGroup"

/* ── Exports ───────────────────────────────────────────── */
export { Avatar, AvatarImage, AvatarFallback, AvatarGroup }
export type { AvatarProps, AvatarGroupProps, StatusPresence }
