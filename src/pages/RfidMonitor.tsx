import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Radio, Wifi, WifiOff, AlertTriangle, Activity } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import { api } from "@/data/api";
import { cn } from "@/lib/utils";

const RfidMonitor = () => {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    api.inventory.getAll().then(setProducts);
  }, []);

  const active = products.filter((p) => p.rfidStatus === "active");
  const inactive = products.filter((p) => p.rfidStatus === "inactive");
  const error = products.filter((p) => p.rfidStatus === "error");

  const parseLocation = (location: string) => {
    const match = location.match(/^([A-Za-z]+)(\d+)(?:-(.*))?$/);
    if (match) {
      return {
        rack: match[1].toUpperCase(),
        row: parseInt(match[2], 10),
        sub: match[3] || ""
      };
    }
    return { rack: "?", row: 0, sub: location };
  };

  const gridData: Record<number, Record<string, any[]>> = {};
  const allRacks = new Set<string>();
  const allRows = new Set<number>();

  products.forEach((product) => {
    const { rack, row } = parseLocation(product.shelfLocation || "");
    allRacks.add(rack);
    allRows.add(row);
    if (!gridData[row]) gridData[row] = {};
    if (!gridData[row][rack]) gridData[row][rack] = [];
    gridData[row][rack].push(product);
  });

  const sortedRacks = Array.from(allRacks).sort();
  const sortedRows = Array.from(allRows).sort((a, b) => a - b);

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

        {/* Live Feed Grid */}
        <div className="rounded-xl border border-border bg-card px-2 py-4 overflow-hidden flex flex-col h-[calc(100vh-170px)]">
          <div className="mb-4 px-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-success animate-pulse-glow" />
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Live RFID Feed Grid</h3>
            </div>
            <div className="flex items-center gap-4 text-[10px] uppercase font-bold tracking-tighter">
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-success"></span> ACTIVE</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-warning"></span> INACTIVE</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-critical"></span> ERROR</span>
            </div>
          </div>
          
          <div className="flex-1 overflow-auto custom-scrollbar border rounded-lg bg-black/20">
            <table className="w-full border-collapse">
              <thead className="sticky top-0 z-20 bg-card/90 backdrop-blur-sm shadow-sm">
                <tr>
                  <th className="p-3 border border-border/40 bg-muted/30 text-xs font-bold text-muted-foreground text-center sticky left-0 z-30">
                    RACKS →<br/>ROWS ↓
                  </th>
                  {sortedRacks.map(rack => (
                    <th key={rack} className="p-4 border border-border/40 min-w-[380px] text-lg font-black text-primary text-center uppercase tracking-widest bg-primary/5">
                      RACK {rack}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sortedRows.map(row => (
                  <tr key={row}>
                    <th className="p-3 border border-border/40 bg-muted/10 text-base font-black text-muted-foreground text-center sticky left-0 z-10 bg-card/90 backdrop-blur-sm min-w-[100px]">
                      ROW {row}
                    </th>
                    {sortedRacks.map(rack => {
                      const shelfProducts = gridData[row][rack] || [];
                      return (
                        <td key={`${row}-${rack}`} className="p-4 border border-border/20 align-top min-w-[380px]">
                          <div className="space-y-4">
                            {shelfProducts.length > 0 ? (
                              shelfProducts.map((product, i) => (
                                <motion.div
                                  key={product.id}
                                  initial={{ opacity: 0, y: 5 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: i * 0.05 }}
                                  className={cn(
                                    "rounded-xl border border-border p-4 transition-all bg-card shadow-sm",
                                    product.rfidStatus === "active" && "hover:border-success/60 hover:shadow-success/10",
                                    product.rfidStatus === "inactive" && "hover:border-warning/60 opacity-80",
                                    product.rfidStatus === "error" && "border-critical/30 bg-critical/5"
                                  )}
                                >
                                  <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-2 overflow-hidden">
                                      <Radio className={cn(
                                        "h-4 w-4 shrink-0",
                                        product.rfidStatus === "active" && "text-success",
                                        product.rfidStatus === "inactive" && "text-warning",
                                        product.rfidStatus === "error" && "text-critical"
                                      )} />
                                      <span className="font-mono text-[10px] text-primary truncate font-bold tracking-tight">{product.rfidTag}</span>
                                    </div>
                                    <div className={cn(
                                      "h-2 w-2 rounded-full shrink-0",
                                      product.rfidStatus === "active" && "bg-success animate-pulse-glow",
                                      product.rfidStatus === "inactive" && "bg-warning",
                                      product.rfidStatus === "error" && "bg-critical animate-pulse-glow"
                                    )} />
                                  </div>
                                  <p className="mt-2 text-sm font-black text-foreground leading-snug">{product.name}</p>
                                  <div className="mt-3 flex items-center justify-between text-[10px] text-muted-foreground border-t border-border/30 pt-2">
                                    <span className="bg-primary/10 px-2 py-0.5 rounded-full text-primary font-black uppercase tracking-tighter shadow-sm">{product.shelfLocation}</span>
                                    <span className="font-mono font-bold">
                                      {new Date(product.lastScanned).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                    </span>
                                  </div>
                                </motion.div>
                              ))
                            ) : (
                              <div className="py-16 text-center border-2 border-dashed border-border/10 rounded-xl flex flex-col items-center justify-center opacity-30 bg-muted/5 min-h-[120px]">
                                <Activity className="h-6 w-6 text-muted-foreground mb-2 opacity-20" />
                                <span className="text-[11px] font-black tracking-[0.2em] text-muted-foreground">VACANT</span>
                              </div>
                            )}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default RfidMonitor;
