import { motion } from "framer-motion";
import { Radio, Wifi, WifiOff, AlertTriangle, Activity } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import { products } from "@/data/mockData";
import { cn } from "@/lib/utils";

const RfidMonitor = () => {
  const active = products.filter((p) => p.rfidStatus === "active");
  const inactive = products.filter((p) => p.rfidStatus === "inactive");
  const error = products.filter((p) => p.rfidStatus === "error");

  return (
    <AppLayout title="RFID Monitor">
      <div className="space-y-6">
        {/* Summary */}
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-xl border border-border bg-card p-5 glow-success">
            <div className="flex items-center gap-3">
              <Wifi className="h-5 w-5 text-success" />
              <div>
                <p className="text-2xl font-bold text-foreground">{active.length}</p>
                <p className="text-xs text-muted-foreground">Active Tags</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-5 glow-warning">
            <div className="flex items-center gap-3">
              <WifiOff className="h-5 w-5 text-warning" />
              <div>
                <p className="text-2xl font-bold text-foreground">{inactive.length}</p>
                <p className="text-xs text-muted-foreground">Inactive Tags</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-5 glow-danger">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-critical" />
              <div>
                <p className="text-2xl font-bold text-foreground">{error.length}</p>
                <p className="text-xs text-muted-foreground">Error Tags</p>
              </div>
            </div>
          </div>
        </div>

        {/* Live Feed */}
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="mb-4 flex items-center gap-2">
            <Activity className="h-4 w-4 text-success animate-pulse-glow" />
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Live RFID Feed</h3>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {products.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className={cn(
                  "rounded-lg border border-border p-4 transition-all",
                  product.rfidStatus === "active" && "hover:border-success/40",
                  product.rfidStatus === "inactive" && "hover:border-warning/40 opacity-70",
                  product.rfidStatus === "error" && "border-critical/30 bg-critical/5"
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Radio className={cn(
                      "h-4 w-4",
                      product.rfidStatus === "active" && "text-success",
                      product.rfidStatus === "inactive" && "text-warning",
                      product.rfidStatus === "error" && "text-critical"
                    )} />
                    <span className="font-mono text-xs text-primary">{product.rfidTag}</span>
                  </div>
                  <div className={cn(
                    "h-2 w-2 rounded-full",
                    product.rfidStatus === "active" && "bg-success animate-pulse-glow",
                    product.rfidStatus === "inactive" && "bg-warning",
                    product.rfidStatus === "error" && "bg-critical animate-pulse-glow"
                  )} />
                </div>
                <p className="mt-2 text-sm font-medium text-foreground">{product.name}</p>
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{product.shelfLocation}</span>
                  <span className="font-mono text-xs text-muted-foreground">
                    {new Date(product.lastScanned).toLocaleTimeString()}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default RfidMonitor;
