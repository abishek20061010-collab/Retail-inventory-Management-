import { useState, useEffect } from "react";
import CustomerLayout from "@/components/layout/CustomerLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { api } from "@/data/api";
import { cartStore } from "@/data/cartStore";
import { Minus, Plus, Trash2, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const CustomerCart = () => {
  const navigate = useNavigate();
  const [customerProducts, setCustomerProducts] = useState<any[]>([]);
  const [cartItems, setCartItems] = useState(cartStore.getItems());

  useEffect(() => {
    api.customer.getProducts().then(setCustomerProducts);
  }, []);

  const items = cartItems
    .map((ci) => {
      const p = customerProducts.find((cp) => cp.id === ci.productId);
      return p ? { ...p, qty: ci.qty } : null;
    })
    .filter(Boolean) as (typeof customerProducts[0] & { qty: number })[];

  const total = items.reduce((s, i) => s + Number(i.price) * i.qty, 0);

  const updateQty = (id: string, delta: number) => {
    const updated = cartStore.updateQty(id, delta);
    setCartItems(updated);
  };

  const remove = (id: string) => {
    const updated = cartStore.removeItem(id);
    setCartItems(updated);
    toast.info("Item removed from cart");
  };

  const placeOrder = async () => {
    if (items.length === 0) return;
    
    const delivery = new Date();
    delivery.setDate(delivery.getDate() + 2);

    const payload = {
      id: `CO-${Math.floor(Math.random() * 10000).toString().padStart(4, "0")}`,
      items: items.map(i => ({ name: i.name, qty: i.qty, price: i.price })),
      total,
      status: "placed",
      placedAt: new Date().toISOString().split(".")[0].replace("T", " "),
      estimatedDelivery: delivery.toISOString().split("T")[0],
    };

    try {
      await api.customer.placeOrder(payload);
      toast.success("Order placed successfully!");
      cartStore.clear();
      setCartItems([]);
      setTimeout(() => navigate("/customer/orders"), 1000);
    } catch (e: any) {
      toast.error(e.message || "Failed to place order");
    }
  };

  return (
    <CustomerLayout title="My Cart">
      {items.length === 0 ? (
        <Card className="bg-card border-border">
          <CardContent className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <ShoppingCart className="h-12 w-12 mb-4 opacity-30" />
            <p className="text-sm">Your cart is empty</p>
            <Button variant="outline" className="mt-4 border-border" onClick={() => navigate("/customer")}>
              Browse Products
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="bg-card border-border lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-sm font-semibold text-foreground">Cart Items</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-border">
                    <TableHead className="text-muted-foreground">Product</TableHead>
                    <TableHead className="text-muted-foreground">Price</TableHead>
                    <TableHead className="text-muted-foreground">Qty</TableHead>
                    <TableHead className="text-muted-foreground">Subtotal</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.id} className="border-border">
                      <TableCell className="text-foreground font-medium">{item.name}</TableCell>
                      <TableCell className="text-foreground">₹{Number(item.price).toFixed(2)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button size="icon" variant="outline" className="h-7 w-7 border-border" onClick={() => updateQty(item.id, -1)}>
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="text-sm text-foreground w-6 text-center">{item.qty}</span>
                          <Button size="icon" variant="outline" className="h-7 w-7 border-border" onClick={() => updateQty(item.id, 1)}>
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="text-foreground font-medium">₹{(Number(item.price) * item.qty).toFixed(2)}</TableCell>
                      <TableCell>
                        <Button size="icon" variant="ghost" className="h-7 w-7 text-critical" onClick={() => remove(item.id)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="bg-card border-border h-fit">
            <CardHeader>
              <CardTitle className="text-sm font-semibold text-foreground">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-foreground">₹{total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Delivery</span>
                <span className="text-success">Free</span>
              </div>
              <div className="border-t border-border pt-3 flex justify-between">
                <span className="font-semibold text-foreground">Total</span>
                <span className="font-bold text-lg text-foreground">₹{total.toFixed(2)}</span>
              </div>
              <Button onClick={placeOrder} className="w-full bg-gradient-to-r from-warning to-[hsl(25,95%,53%)] text-primary-foreground">
                Place Order
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </CustomerLayout>
  );
};

export default CustomerCart;
