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
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">{title}</p>
          {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
        </div>
        <p className="text-xl font-bold mt-1">{value}</p>
        {change !== undefined && (
          <div className="flex items-center gap-1 mt-1">
            {trend === "up" && <TrendingUp className="h-3 w-3 text-green-500" />}
            {trend === "down" && <TrendingDown className="h-3 w-3 text-red-500" />}
            {trend === "stable" && <Minus className="h-3 w-3 text-yellow-500" />}
            <span
              className={cn(
                "text-xs",
                trend === "up" && "text-green-500",
                trend === "down" && "text-red-500",
                trend === "stable" && "text-yellow-500"
              )}
            >
              {change > 0 ? "+" : ""}{change}%
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
