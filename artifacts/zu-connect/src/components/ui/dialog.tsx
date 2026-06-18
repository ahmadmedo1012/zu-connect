import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

/* ── Primitives ───────────────────────────────────────── */
const Dialog = DialogPrimitive.Root
const DialogTrigger = DialogPrimitive.Trigger
const DialogPortal = DialogPrimitive.Portal
const DialogClose = DialogPrimitive.Close

/* ── Types ─────────────────────────────────────────────── */
interface DialogContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  /** "dialog" (default, centered, sm:rounded-lg) or "sheet" (slides from bottom on mobile, side panel on desktop) */
  variant?: "dialog" | "sheet"
}

/* ── Overlay ───────────────────────────────────────────── */
const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50",
      "bg-black/60 backdrop-blur-sm",
      "data-[state=open]:animate-in data-[state=closed]:animate-out",
      "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      "data-[state=open]:backdrop-blur-[2px] data-[state=closed]:backdrop-blur-none",
      "transition-[backdrop-filter] duration-300",
      className,
    )}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

/* ── Content ───────────────────────────────────────────── */
const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  DialogContentProps
>(({ className, children, variant = "dialog", ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        /* Shared */
        "fixed z-50 gap-4 border bg-background p-6 shadow-modal",
        /* Dialog variant — centered, slide-up */
        variant === "dialog" && [
          "left-1/2 top-1/2 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 sm:rounded-lg",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          "data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]",
          "data-[state=open]:slide-in-from-bottom-[8%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
          "duration-200",
        ],
        /* Sheet variant — bottom sheet on mobile, right panel on desktop */
        variant === "sheet" && [
          "bottom-0 inset-inline-0 max-h-[90dvh] rounded-t-xl",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          "data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
          "duration-300",
          "sm:inset-inline-auto sm:end-0 sm:start-auto sm:top-0 sm:max-h-none sm:max-w-md sm:rounded-none sm:rounded-l-xl",
          "sm:data-[state=closed]:slide-out-to-right sm:data-[state=open]:slide-in-from-right",
          "sm:data-[state=closed]:fade-out-0 sm:data-[state=open]:fade-in-0",
          "[--sheet-width:100%] sm:[--sheet-width:24rem]",
          "w-[var(--sheet-width)]",
        ],
        className,
      )}
      {...props}
    >
      {children}

      {/* Close button */}
      <DialogPrimitive.Close
        className={cn(
          "absolute rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none",
          variant === "dialog" &&
            "inset-inline-end-4 top-4 data-[state=open]:bg-accent data-[state=open]:text-muted-foreground",
          variant === "sheet" &&
            "inset-inline-end-4 top-4",
        )}
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

/* ── Header / Footer ──────────────────────────────────── */
const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-start",
      className,
    )}
    {...props}
  />
)
DialogHeader.displayName = "DialogHeader"

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-reverse sm:space-x-2",
      className,
    )}
    {...props}
  />
)
DialogFooter.displayName = "DialogFooter"

/* ── Title / Description ───────────────────────────────── */
const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className,
    )}
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

/* ── Exports ───────────────────────────────────────────── */
export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}

export type { DialogContentProps }
