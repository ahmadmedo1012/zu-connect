import * as React from "react"
import { cn } from "@/lib/utils"

/* ── Constants ────────────────────────────────────────── */
const LABEL_IDLE = "text-muted-foreground peer-placeholder-shown:text-muted-foreground peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm"
const LABEL_UP   = "text-primary/80 peer-not-placeholder-shown:top-1.5 peer-not-placeholder-shown:text-[11px] peer-not-placeholder-shown:leading-none peer-focus:top-1.5 peer-focus:text-[11px] peer-focus:leading-none peer-focus:text-primary/80"

/* ── Types ─────────────────────────────────────────────── */
interface InputProps extends Omit<React.ComponentProps<"input">, "size"> {
  /** Floating label — overrides placeholder */
  label?: string
  /** Leading icon (left side, RTL-aware) */
  icon?: React.ReactNode
  /** Action element (right side, RTL-aware) */
  suffix?: React.ReactNode
  /** Error state — applies red border + optional shake */
  error?: string | boolean
  /** Disables animation on the error shake */
  noShake?: boolean
}

/* ── Component ─────────────────────────────────────────── */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, icon, suffix, error, noShake, ...props }, ref) => {
    const id = React.useId()
    const hasError = error !== undefined && error !== false && error !== ""
    const errorMsg = typeof error === "string" ? error : undefined

    return (
      <div className="relative">
        <div
          className={cn(
            "relative flex items-center rounded-md border bg-transparent shadow-sm transition-all duration-200",
            "focus-within:ring-1 focus-within:ring-ring focus-within:border-ring",
            "has-[:focus-visible]:ring-[3px] has-[:focus-visible]:ring-ring/30 has-[:focus-visible]:border-ring",
            hasError && [
              "border-destructive focus-within:ring-destructive/40 focus-within:border-destructive",
              !noShake && "animate-[shake_0.4s_ease-in-out]",
            ],
            "group",
            className,
          )}
        >
          {/* Leading icon / prefix */}
          {icon && (
            <span
              className={cn(
                "pointer-events-none absolute inset-inline-start-3 flex items-center",
                "text-muted-foreground/60 transition-colors",
                "group-focus-within:text-primary/70",
                hasError && "group-focus-within:text-destructive/70",
              )}
            >
              {icon}
            </span>
          )}

          <input
            id={id}
            type={type}
            ref={ref}
            placeholder={label ? " " : props.placeholder ?? " "}
            className={cn(
              "peer w-full bg-transparent text-base md:text-sm transition-colors",
              "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
              "placeholder:text-transparent focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
              label ? "pt-5 pb-1.5" : "py-1.5",
              icon ? "ps-9" : "px-3",
              suffix ? "pe-9" : "px-3",
              hasError && "text-destructive",
            )}
            aria-invalid={hasError || undefined}
            aria-describedby={errorMsg ? `${id}-error` : undefined}
            {...props}
          />

          {/* Floating label */}
          {label && (
            <label
              htmlFor={id}
              className={cn(
                "pointer-events-none absolute inset-inline-start-3 origin-left select-none transition-all duration-200",
                LABEL_IDLE,
                LABEL_UP,
                hasError && "peer-focus:text-destructive",
              )}
            >
              {label}
            </label>
          )}

          {/* Suffix action */}
          {suffix && (
            <span className="absolute inset-inline-end-3 flex items-center text-muted-foreground/60">
              {suffix}
            </span>
          )}
        </div>

        {/* Error message */}
        {errorMsg && (
          <p
            id={`${id}-error`}
            role="alert"
            className="mt-1 text-xs text-destructive animate-[shake_0.3s_ease-in-out]"
          >
            {errorMsg}
          </p>
        )}
      </div>
    )
  },
)
Input.displayName = "Input"

export { Input }
export type { InputProps }
