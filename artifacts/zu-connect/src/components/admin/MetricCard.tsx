import { useCallback, useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { TrendingUp, TrendingDown, Minus, type LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: number | string;
  change?: number;
  icon?: LucideIcon;
  trend?: "up" | "down" | "stable";
}

export function MetricCard({ title, value, icon: Icon, change, trend }: MetricCardProps) {
  const prefersReducedMotion = useReducedMotion();
  const cardRef = useRef<HTMLDivElement>(null);
  const [displayValue, setDisplayValue] = useState(prefersReducedMotion ? value : 0);
  const [hasAnimated, setHasAnimated] = useState(false);

  const numericValue = typeof value === "number" ? value : parseFloat(value as string);
  const shouldAnimate = !prefersReducedMotion && !isNaN(numericValue);

  const animateCountUp = useCallback(() => {
    if (hasAnimated || !shouldAnimate) return;
    setHasAnimated(true);

    const startTime = performance.now();
    const duration = 800;
    const startValue = 0;

    function step(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out quad
      const eased = 1 - (1 - progress) * (1 - progress);
      const current = Math.round(startValue + (numericValue - startValue) * eased);

      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }

    requestAnimationFrame(step);
  }, [hasAnimated, numericValue, shouldAnimate]);

  useEffect(() => {
    const el = cardRef.current;
    if (!el || !shouldAnimate) {
      if (!shouldAnimate) setDisplayValue(value);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          animateCountUp();
          observer.unobserve(el);
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [animateCountUp, shouldAnimate, value]);

  const trendColors = {
    up: { text: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-500/10 dark:bg-emerald-500/15", icon: TrendingUp },
    down: { text: "text-red-600 dark:text-red-400", bg: "bg-red-500/10 dark:bg-red-500/15", icon: TrendingDown },
    stable: { text: "text-amber-600 dark:text-amber-400", bg: "bg-amber-500/10 dark:bg-amber-500/15", icon: Minus },
  };

  const t = trend || "stable";
  const tc = trendColors[t];

  return (
    <Card
      ref={cardRef}
      className="group relative overflow-hidden border-border/50 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 cursor-pointer"
    >
      {/* Shimmer bar */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-accent-gold/50 to-transparent opacity-0 group-hover:opacity-100 translate-x-[-100%] group-hover:translate-x-[100%] transition-all duration-700 pointer-events-none" />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      <CardContent className="p-4 md:p-5 relative">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-medium text-muted-foreground tracking-wide uppercase">{title}</p>
          <div className={cn("p-2.5 rounded-xl transition-transform duration-300 group-hover:scale-110", tc.bg)}>
            {Icon && <Icon className={cn("h-4 w-4", tc.text)} />}
          </div>
        </div>
        <p className="text-2xl font-bold tabular-nums tracking-tight" dir="ltr">
          {shouldAnimate ? displayValue : value}
        </p>
        {change !== undefined && (
          <div className="flex items-center gap-1.5 mt-2.5">
            <span className={cn("inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full", tc.bg, tc.text)}>
              <tc.icon className="h-3 w-3" />
              {change > 0 ? "+" : ""}{change}%
            </span>
            <span className="text-[11px] text-muted-foreground">مقارنة بالشهر الماضي</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
