import { useState } from "react";
import SupplierLayout from "@/components/layout/SupplierLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { type SupplierOrder } from "@/data/supplierData";
import { toast } from "sonner";
import { fetchOrders, syncStatus } from "@/data/orderManager";

const statusColors: Record<string, string> = {
  new: "bg-warning/10 text-warning border-warning/30",
  accepted: "bg-primary/10 text-primary border-primary/30",
  processing: "bg-primary/10 text-primary border-primary/30",
  shipped: "bg-success/10 text-success border-success/30",
  delivered: "bg-success/20 text-success border-success/40",
};

const nextStatus: Record<string, SupplierOrder["status"] | null> = {
  new: "accepted",
  accepted: "processing",
  processing: "shipped",
  shipped: "delivered",
  delivered: null,
};

const SupplierOrders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const loadOrders = async () => {
      const data = await fetchOrders();
      const formatted = data.map((o: any) => ({
        id: o.id,
        productName: o.product_name,
        sku: o.sku,
        quantity: o.quantity,
        totalPrice: Number(o.total_price),
        status: o.supplier_status,
        orderedBy: o.ordered_by,
        orderedAt: o.created_at,
        estimatedDelivery: new Date(o.estimated_delivery).toISOString().split('T')[0]
      }));
      setOrders(formatted);
    };
    loadOrders();
  }, []);

  const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  const advanceOrder = async (id: string) => {
    const order = orders.find((o) => o.id === id);
    if (order && nextStatus[order.status as keyof typeof nextStatus]) {
      const newStatus = nextStatus[order.status as keyof typeof nextStatus]!;
      await syncStatus(id, newStatus);
      const msg = newStatus === "delivered" 
        ? `Order ${id} delivered. MFG/EXP dates generated automatically.`
        : `Order ${id} updated to ${newStatus}`;
      toast.success(msg);
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o)));
    }
  };

  return (
    <SupplierLayout title="Incoming Orders">
      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-semibold text-foreground">Orders from Managers</CardTitle>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-40 bg-secondary border-border text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="accepted">Accepted</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead className="text-muted-foreground">Order ID</TableHead>
                <TableHead className="text-muted-foreground">Product</TableHead>
                <TableHead className="text-muted-foreground">Qty</TableHead>
                <TableHead className="text-muted-foreground">Total</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
                <TableHead className="text-muted-foreground">Est. Delivery</TableHead>
                <TableHead className="text-muted-foreground">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((o) => (
                <TableRow key={o.id} className="border-border">
                  <TableCell className="font-mono text-xs text-foreground">{o.id}</TableCell>
                  <TableCell className="text-foreground">{o.productName}</TableCell>
                  <TableCell className="text-foreground">{o.quantity}</TableCell>
                  <TableCell className="text-foreground">₹{Number(o.totalPrice).toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge className={`text-xs capitalize border ${statusColors[o.status]}`}>{o.status}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{o.estimatedDelivery}</TableCell>
                  <TableCell>
                    {nextStatus[o.status] ? (
                      <Button size="sm" variant="outline" className="text-xs border-border" onClick={() => advanceOrder(o.id)}>
                        Mark {nextStatus[o.status]}
                      </Button>
                    ) : (
                      <span className="text-xs text-muted-foreground">Complete</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </SupplierLayout>
  );
};

export default SupplierOrders;
