import { useState } from "react";
import { Search, Filter, Radio, Wifi, WifiOff, AlertTriangle } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { products } from "@/data/mockData";
import { cn } from "@/lib/utils";

const statusConfig = {
  active: { label: "Active", icon: Wifi, className: "bg-success/10 text-success border-success/20" },
  inactive: { label: "Inactive", icon: WifiOff, className: "bg-warning/10 text-warning border-warning/20" },
  error: { label: "Error", icon: AlertTriangle, className: "bg-critical/10 text-critical border-critical/20" },
};

const Inventory = () => {
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  const categories = ["all", ...new Set(products.map((p) => p.category))];

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase()) || p.rfidTag.toLowerCase().includes(search.toLowerCase());
    const matchCategory = filterCategory === "all" || p.category === filterCategory;
    return matchSearch && matchCategory;
  });

  return (
    <AppLayout title="Inventory">
      <div className="space-y-4">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[250px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name, SKU, or RFID tag..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-card pl-9 border-border"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors capitalize",
                  filterCategory === cat
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Product</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">SKU</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">RFID Tag</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Location</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Stock</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">RFID Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Last Scanned</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => {
                const status = statusConfig[product.rfidStatus];
                const StatusIcon = status.icon;
                const stockPercent = Math.round((product.currentStock / product.maxCapacity) * 100);
                const isLow = product.currentStock <= product.minThreshold;
                const isEmpty = product.currentStock === 0;

                return (
                  <tr key={product.id} className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors">
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm font-medium text-foreground">{product.name}</p>
                        <p className="text-xs text-muted-foreground">{product.category}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-sm text-muted-foreground">{product.sku}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1.5 font-mono text-xs">
                        <Radio className="h-3 w-3 text-primary" />
                        {product.rfidTag}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-sm text-muted-foreground">{product.shelfLocation}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-16 rounded-full bg-secondary overflow-hidden">
                          <div
                            className={cn("h-full rounded-full", isEmpty ? "bg-critical" : isLow ? "bg-warning" : "bg-success")}
                            style={{ width: `${stockPercent}%` }}
                          />
                        </div>
                        <span className={cn("text-sm font-mono font-medium", isEmpty ? "text-critical" : isLow ? "text-warning" : "text-foreground")}>
                          {product.currentStock}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className={cn("gap-1 text-[10px]", status.className)}>
                        <StatusIcon className="h-3 w-3" />
                        {status.label}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {new Date(product.lastScanned).toLocaleTimeString()}
                    </td>
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

export default Inventory;
