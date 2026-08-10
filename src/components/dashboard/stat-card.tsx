import * as React from "react";
import { ArrowDownRight, ArrowUpRight, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  hint?: string;
  trend?: { value: number; direction: "up" | "down"; positive?: boolean };
}

export function StatCard({
  label,
  value,
  icon: Icon,
  hint,
  trend,
}: StatCardProps) {
  const trendPositive = trend?.positive ?? trend?.direction === "up";
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground text-sm font-medium">{label}</p>
          <span className="bg-primary/10 text-primary flex h-9 w-9 items-center justify-center rounded-lg">
            <Icon className="h-4 w-4" aria-hidden="true" />
          </span>
        </div>
        <div className="mt-3 flex items-end justify-between">
          <p className="text-2xl font-semibold tracking-tight">{value}</p>
          {trend ? (
            <span
              className={cn(
                "flex items-center gap-0.5 text-xs font-medium",
                trendPositive ? "text-success" : "text-destructive",
              )}
            >
              {trend.direction === "up" ? (
                <ArrowUpRight className="h-3.5 w-3.5" />
              ) : (
                <ArrowDownRight className="h-3.5 w-3.5" />
              )}
              {trend.value}%
            </span>
          ) : null}
        </div>
        {hint ? (
          <p className="text-muted-foreground mt-1 text-xs">{hint}</p>
        ) : null}
      </CardContent>
    </Card>
  );
}
