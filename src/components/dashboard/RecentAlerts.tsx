import { AlertTriangle, AlertCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { alerts } from "@/data/mockData";

const iconMap = {
  critical: AlertTriangle,
  warning: AlertCircle,
  info: Info,
};

const colorMap = {
  critical: "text-critical",
  warning: "text-warning",
  info: "text-primary",
};

const RecentAlerts = () => {
  const recent = alerts.slice(0, 5);

  return (
    <div className="space-y-3">
      {recent.map((alert) => {
        const Icon = iconMap[alert.type];
        return (
          <div
            key={alert.id}
            className={cn(
              "flex items-start gap-3 rounded-lg border border-border bg-secondary/50 p-3 transition-colors",
              !alert.read && "border-l-2",
              !alert.read && alert.type === "critical" && "border-l-critical",
              !alert.read && alert.type === "warning" && "border-l-warning",
              !alert.read && alert.type === "info" && "border-l-primary"
            )}
          >
            <Icon className={cn("mt-0.5 h-4 w-4 shrink-0", colorMap[alert.type])} />
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground">{alert.productName}</p>
              <p className="text-xs text-muted-foreground">{alert.message}</p>
              <p className="mt-1 text-[10px] font-mono text-muted-foreground">
                {new Date(alert.timestamp).toLocaleTimeString()}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RecentAlerts;
