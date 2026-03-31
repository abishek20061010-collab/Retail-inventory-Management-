import { Clock, CheckCircle, Truck, PackageCheck } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import { Badge } from "@/components/ui/badge";
import { reorderRequests } from "@/data/mockData";
import { cn } from "@/lib/utils";

const statusConfig = {
  pending: { label: "Pending", icon: Clock, className: "bg-warning/10 text-warning border-warning/20" },
  approved: { label: "Approved", icon: CheckCircle, className: "bg-primary/10 text-primary border-primary/20" },
  shipped: { label: "Shipped", icon: Truck, className: "bg-info/10 text-info border-info/20" },
  delivered: { label: "Delivered", icon: PackageCheck, className: "bg-success/10 text-success border-success/20" },
};

const Reorders = () => {
  return (
    <AppLayout title="Reorders">
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          {(["pending", "approved", "shipped", "delivered"] as const).map((status) => {
            const config = statusConfig[status];
            const count = reorderRequests.filter((r) => r.status === status).length;
            return (
              <div key={status} className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2">
                <config.icon className={cn("h-4 w-4", config.className.includes("text-") ? config.className.split(" ").find(c => c.startsWith("text-")) : "")} />
                <span className="text-sm font-medium text-foreground">{count}</span>
                <span className="text-xs text-muted-foreground capitalize">{status}</span>
              </div>
            );
          })}
        </div>

        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Order ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Product</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Supplier</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Quantity</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Est. Delivery</th>
              </tr>
            </thead>
            <tbody>
              {reorderRequests.map((order) => {
                const config = statusConfig[order.status];
                const StatusIcon = config.icon;
                return (
                  <tr key={order.id} className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors">
                    <td className="px-4 py-3 font-mono text-sm font-medium text-primary">{order.id}</td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-foreground">{order.productName}</p>
                      <p className="text-xs text-muted-foreground font-mono">{order.sku}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{order.supplier}</td>
                    <td className="px-4 py-3 font-mono text-sm font-medium text-foreground">{order.quantity}</td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className={cn("gap-1 text-[10px]", config.className)}>
                        <StatusIcon className="h-3 w-3" />
                        {config.label}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{order.estimatedDelivery}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
};

export default Reorders;
