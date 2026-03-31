import CustomerLayout from "@/components/layout/CustomerLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { customerOrders } from "@/data/customerData";
import { format } from "date-fns";

const statusColors: Record<string, string> = {
  placed: "bg-warning/10 text-warning border-warning/30",
  confirmed: "bg-primary/10 text-primary border-primary/30",
  "out-for-delivery": "bg-success/10 text-success border-success/30",
  delivered: "bg-success/20 text-success border-success/40",
};

const CustomerOrders = () => {
  return (
    <CustomerLayout title="My Orders">
      <div className="space-y-4">
        {customerOrders.map((order) => (
          <Card key={order.id} className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-sm font-semibold text-foreground">{order.id}</CardTitle>
                <p className="text-xs text-muted-foreground">
                  Placed {format(new Date(order.placedAt), "MMM d, yyyy 'at' h:mm a")}
                </p>
              </div>
              <Badge className={`text-xs capitalize border ${statusColors[order.status]}`}>
                {order.status.replace("-", " ")}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-3">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {item.name} × {item.qty}
                    </span>
                    <span className="text-foreground">${(item.price * item.qty).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between border-t border-border pt-3">
                <span className="text-sm font-medium text-foreground">Total</span>
                <span className="text-sm font-bold text-foreground">${order.total.toFixed(2)}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Est. delivery: {format(new Date(order.estimatedDelivery), "MMM d, yyyy")}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </CustomerLayout>
  );
};

export default CustomerOrders;
