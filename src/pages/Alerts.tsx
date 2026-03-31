import { AlertTriangle, AlertCircle, Info, Bell } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import { alerts } from "@/data/mockData";
import { cn } from "@/lib/utils";

const iconMap = { critical: AlertTriangle, warning: AlertCircle, info: Info };
const colorMap = { critical: "text-critical", warning: "text-warning", info: "text-primary" };
const bgMap = { critical: "bg-critical/5 border-critical/20", warning: "bg-warning/5 border-warning/20", info: "bg-primary/5 border-primary/20" };

const Alerts = () => {
  const unread = alerts.filter((a) => !a.read);
  const read = alerts.filter((a) => a.read);

  return (
    <AppLayout title="Alerts">
      <div className="space-y-6">
        {unread.length > 0 && (
          <div>
            <div className="mb-3 flex items-center gap-2">
              <Bell className="h-4 w-4 text-critical" />
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Unread ({unread.length})
              </h3>
            </div>
            <div className="space-y-2">
              {unread.map((alert) => {
                const Icon = iconMap[alert.type];
                return (
                  <div key={alert.id} className={cn("flex items-start gap-4 rounded-lg border p-4", bgMap[alert.type])}>
                    <Icon className={cn("mt-0.5 h-5 w-5 shrink-0", colorMap[alert.type])} />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{alert.productName}</p>
                      <p className="text-sm text-muted-foreground">{alert.message}</p>
                    </div>
                    <span className="shrink-0 font-mono text-xs text-muted-foreground">
                      {new Date(alert.timestamp).toLocaleString()}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            History
          </h3>
          <div className="space-y-2">
            {read.map((alert) => {
              const Icon = iconMap[alert.type];
              return (
                <div key={alert.id} className="flex items-start gap-4 rounded-lg border border-border bg-card p-4 opacity-60">
                  <Icon className={cn("mt-0.5 h-5 w-5 shrink-0", colorMap[alert.type])} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{alert.productName}</p>
                    <p className="text-sm text-muted-foreground">{alert.message}</p>
                  </div>
                  <span className="shrink-0 font-mono text-xs text-muted-foreground">
                    {new Date(alert.timestamp).toLocaleString()}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Alerts;
