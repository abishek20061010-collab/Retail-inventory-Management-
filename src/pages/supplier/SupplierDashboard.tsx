import SupplierLayout from "@/components/layout/SupplierLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supplierOrders, invoices, supplierProducts } from "@/data/supplierData";
import { Package, ClipboardList, FileText, DollarSign } from "lucide-react";

const SupplierDashboard = () => {
  const newOrders = supplierOrders.filter((o) => o.status === "new").length;
  const activeOrders = supplierOrders.filter((o) => ["accepted", "processing", "shipped"].includes(o.status)).length;
  const totalRevenue = invoices.reduce((s, i) => s + i.totalAmount, 0);
  const unpaidInvoices = invoices.filter((i) => i.status !== "paid").length;

  const kpis = [
    { label: "Total Products", value: supplierProducts.length, icon: Package, color: "text-primary" },
    { label: "New Orders", value: newOrders, icon: ClipboardList, color: "text-warning" },
    { label: "Active Orders", value: activeOrders, icon: ClipboardList, color: "text-success" },
    { label: "Total Revenue", value: `$${totalRevenue.toFixed(2)}`, icon: DollarSign, color: "text-primary" },
  ];

  return (
    <SupplierLayout title="Supplier Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {kpis.map((kpi) => (
          <Card key={kpi.label} className="bg-card border-border">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
              </div>
              <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{kpi.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-foreground">Recent Orders</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {supplierOrders.slice(0, 4).map((order) => (
              <div key={order.id} className="flex items-center justify-between rounded-lg bg-secondary/50 p-3">
                <div>
                  <p className="text-sm font-medium text-foreground">{order.productName}</p>
                  <p className="text-xs text-muted-foreground">{order.id} · Qty: {order.quantity}</p>
                </div>
                <Badge variant={order.status === "new" ? "destructive" : order.status === "delivered" ? "default" : "secondary"} className="text-xs capitalize">
                  {order.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-foreground">Recent Invoices</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {invoices.map((inv) => (
              <div key={inv.id} className="flex items-center justify-between rounded-lg bg-secondary/50 p-3">
                <div>
                  <p className="text-sm font-medium text-foreground">{inv.id}</p>
                  <p className="text-xs text-muted-foreground">{inv.productName} · ${inv.totalAmount.toFixed(2)}</p>
                </div>
                <Badge variant={inv.status === "paid" ? "default" : "secondary"} className="text-xs capitalize">
                  {inv.status}
                </Badge>
              </div>
            ))}
            {unpaidInvoices > 0 && (
              <p className="text-xs text-warning">{unpaidInvoices} unpaid invoice(s)</p>
            )}
          </CardContent>
        </Card>
      </div>
    </SupplierLayout>
  );
};

export default SupplierDashboard;
