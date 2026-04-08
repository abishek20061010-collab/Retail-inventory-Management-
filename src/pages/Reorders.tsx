import { useEffect, useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { fetchOrders } from "@/data/orderManager";
import { CreateBulkOrderDialog } from "@/components/CreateBulkOrderDialog";

const statusConfig = {
  pending: { label: "Pending", className: "bg-warning/10 text-warning border-warning/20" },
  approved: { label: "Approved", className: "bg-primary/10 text-primary border-primary/20" },
  shipped: { label: "Shipped", className: "bg-info/10 text-info border-info/20" },
  delivered: { label: "Delivered", className: "bg-success/10 text-success border-success/20" },
};

const Reorders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  
  const loadOrders = async () => {
    const data = await fetchOrders();
    setOrders(data);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const refreshOrders = () => {
    loadOrders();
  };

  return (
    <AppLayout title="Reorders">
      <div className="flex items-center justify-between space-y-2 mb-4">
        <h2 className="text-2xl font-bold tracking-tight">Reorder Requests</h2>
        <CreateBulkOrderDialog onOrderCreated={refreshOrders} />
      </div>
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          {(["pending", "approved", "shipped", "delivered"] as const).map((status) => {
            const config = statusConfig[status];
            const count = orders.filter((r) => r.status === status).length;
            return (
              <div key={status} className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2">
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
              {orders.map((order) => {
                const config = statusConfig[order.status as keyof typeof statusConfig] || statusConfig.pending;
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
