import { useState, useEffect } from "react";
import SupplierLayout from "@/components/layout/SupplierLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { api } from "@/data/api";
import { toast } from "sonner";
import { FileText, Plus } from "lucide-react";

const SupplierInvoices = () => {
  const [invList, setInvList] = useState<any[]>([]);
  const [supplierOrders, setSupplierOrders] = useState<any[]>([]);

  const loadData = () => {
    api.supplier.getInvoices().then(setInvList);
    api.orders.getAll().then(setSupplierOrders);
  };

  useEffect(() => { loadData(); }, []);

  const deliveredWithoutInvoice = supplierOrders.filter(
    (o) => o.supplier_status === "delivered" && !invList.find((i) => i.orderId === o.id)
  );

  const generateInvoice = async (orderId: string) => {
    const order = supplierOrders.find((o) => o.id === orderId);
    if (!order) return;
    const newInv = {
      id: `INV-${String(invList.length + 1).padStart(3, "0")}`,
      orderId,
      productName: order.product_name,
      quantity: order.quantity,
      unitPrice: order.unit_price,
      totalAmount: order.total_price,
      status: "draft",
      createdAt: new Date().toISOString(),
      dueDate: "2026-04-15",
    };
    await api.supplier.createInvoice(newInv);
    toast.success(`Invoice ${newInv.id} generated for order ${orderId}`);
    loadData();
  };

  const sendInvoice = async (id: string) => {
    await api.supplier.updateInvoiceStatus(id, "sent");
    toast.success(`Invoice ${id} sent`);
    loadData();
  };

  return (
    <SupplierLayout title="Invoices">
      {deliveredWithoutInvoice.length > 0 && (
        <Card className="bg-card border-border mb-6">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-warning flex items-center gap-2">
              <Plus className="h-4 w-4" /> Generate Invoices
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {deliveredWithoutInvoice.map((o) => (
              <div key={o.id} className="flex items-center justify-between rounded-lg bg-secondary/50 p-3">
                <div>
                  <p className="text-sm text-foreground">{o.product_name}</p>
                  <p className="text-xs text-muted-foreground">{o.id} · ${parseFloat(o.total_price).toFixed(2)}</p>
                </div>
                <Button size="sm" onClick={() => generateInvoice(o.id)} className="text-xs">
                  <FileText className="h-3.5 w-3.5 mr-1" /> Generate
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-sm font-semibold text-foreground">All Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead className="text-muted-foreground">Invoice ID</TableHead>
                <TableHead className="text-muted-foreground">Order</TableHead>
                <TableHead className="text-muted-foreground">Product</TableHead>
                <TableHead className="text-muted-foreground">Qty</TableHead>
                <TableHead className="text-muted-foreground">Total</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
                <TableHead className="text-muted-foreground">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invList.map((inv) => (
                <TableRow key={inv.id} className="border-border">
                  <TableCell className="font-mono text-xs text-foreground">{inv.id}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{inv.orderId}</TableCell>
                  <TableCell className="text-foreground">{inv.productName}</TableCell>
                  <TableCell className="text-foreground">{inv.quantity}</TableCell>
                  <TableCell className="text-foreground">${parseFloat(inv.totalAmount).toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={inv.status === "paid" ? "default" : inv.status === "sent" ? "secondary" : "outline"} className="text-xs capitalize">
                      {inv.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {inv.status === "draft" && (
                      <Button size="sm" variant="outline" className="text-xs border-border" onClick={() => sendInvoice(inv.id)}>
                        Send
                      </Button>
                    )}
                    {inv.status === "sent" && <span className="text-xs text-muted-foreground">Awaiting payment</span>}
                    {inv.status === "paid" && <span className="text-xs text-success">Paid ✓</span>}
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

export default SupplierInvoices;
