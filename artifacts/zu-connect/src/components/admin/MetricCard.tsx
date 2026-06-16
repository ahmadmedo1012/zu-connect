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
    up: { text: "text-green-600", bg: "bg-green-500/10", icon: TrendingUp },
    down: { text: "text-red-600", bg: "bg-red-500/10", icon: TrendingDown },
    stable: { text: "text-yellow-600", bg: "bg-yellow-500/10", icon: Minus },
  };

  const t = trend || "stable";
  const tc = trendColors[t];

  return (
    <Card className="overflow-hidden border-border/50 hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs text-muted-foreground font-medium tracking-wide">{title}</p>
          <div className={cn("p-2 rounded-lg", tc.bg)}>
            {Icon && <Icon className={cn("h-4 w-4", tc.text)} />}
          </div>
        </div>
        <p className="text-2xl font-bold tabular-nums tracking-tight">{value}</p>
        {change !== undefined && (
          <div className="flex items-center gap-1 mt-2">
            <span className={cn("inline-flex items-center gap-0.5 text-xs font-medium px-1.5 py-0.5 rounded-full", tc.bg, tc.text)}>
              <tc.icon className="h-3 w-3" />
              {change > 0 ? "+" : ""}{change}%
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
