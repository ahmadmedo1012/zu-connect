import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus, type LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: number | string;
  change?: number;
  icon?: LucideIcon;
  trend?: "up" | "down" | "stable";
}

export function MetricCard({ title, value, change, icon: Icon, trend }: MetricCardProps) {
  const trendColors = {
    up: { text: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-500/10 dark:bg-emerald-500/15", icon: TrendingUp },
    down: { text: "text-red-600 dark:text-red-400", bg: "bg-red-500/10 dark:bg-red-500/15", icon: TrendingDown },
    stable: { text: "text-amber-600 dark:text-amber-400", bg: "bg-amber-500/10 dark:bg-amber-500/15", icon: Minus },
  };

  const t = trend || "stable";
  const tc = trendColors[t];

  return (
    <Card className="group relative overflow-hidden border-border/50 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 cursor-pointer">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <CardContent className="p-5 relative">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-medium text-muted-foreground tracking-wide uppercase">{title}</p>
          <div className={cn("p-2.5 rounded-xl transition-transform duration-300 group-hover:scale-110", tc.bg)}>
            {Icon && <Icon className={cn("h-4 w-4", tc.text)} />}
          </div>
        </div>
        <p className="text-2xl font-bold tabular-nums tracking-tight">{value}</p>
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
