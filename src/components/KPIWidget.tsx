import { cn } from "@/lib/utils";
import { type LucideIcon } from "lucide-react";

interface KPIWidgetProps {
  title: string;
  value: string;
  unit?: string;
  icon: LucideIcon;
  trend?: { value: string; positive: boolean };
  color: "success" | "warning" | "info" | "primary";
}

const colorMap = {
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  info: "bg-info/10 text-info",
  primary: "bg-primary/10 text-primary",
};

const KPIWidget = ({ title, value, unit, icon: Icon, trend, color }: KPIWidgetProps) => {
  return (
    <div className="kpi-card flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">{title}</span>
        <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", colorMap[color])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="flex items-end gap-1.5">
        <span className="text-3xl font-bold font-display text-card-foreground">{value}</span>
        {unit && <span className="mb-1 text-sm text-muted-foreground">{unit}</span>}
      </div>
      {trend && (
        <div className="flex items-center gap-1.5">
          <span
            className={cn(
              "text-xs font-medium px-2 py-0.5 rounded-full",
              trend.positive
                ? "bg-success/10 text-success"
                : "bg-destructive/10 text-destructive"
            )}
          >
            {trend.positive ? "↑" : "↓"} {trend.value}
          </span>
          <span className="text-xs text-muted-foreground">vs last hour</span>
        </div>
      )}
    </div>
  );
};

export default KPIWidget;
