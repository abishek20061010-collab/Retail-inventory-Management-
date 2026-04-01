import { useState, useEffect } from "react";
import { Search, Filter, Radio, Wifi, WifiOff, AlertTriangle, Trash2, Loader2 } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { api } from "@/data/api";
import { cn } from "@/lib/utils";
import { AddProductDialog } from "@/components/AddProductDialog";
import { EditProductDialog } from "@/components/EditProductDialog";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

const statusConfig = {
  active: { label: "Active", icon: Wifi, className: "bg-success/10 text-success border-success/20" },
  inactive: { label: "Inactive", icon: WifiOff, className: "bg-warning/10 text-warning border-warning/20" },
  error: { label: "Error", icon: AlertTriangle, className: "bg-critical/10 text-critical border-critical/20" },
};

const Inventory = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const loadProducts = () => {
    api.inventory.getAll().then((data) => {
      setProducts(Array.isArray(data) ? data : []);
    }).catch(err => {
      console.error("Failed to load products:", err);
      setProducts([]);
    });
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = async (id: string) => {
    setIsDeleting(id);
    try {
      const res = await api.inventory.deleteProduct(id);
      
      // If the response is not what we expect (e.g., HTML from 404), res.json() might have failed
      // but api.ts already handles res.json(). If it's a server error JSON, it's here.
      if (res.error) {
        toast.error(res.error);
        console.error("Server deletion error:", res.error);
      } else {
        toast.success("Product deleted successfully");
        loadProducts();
      }
    } catch (e: any) {
      console.error("Deletion API call failed:", e);
      // Fallback for cases where res.json() fails (e.g. server returns 404 HTML)
      toast.error(e.message || "Failed to delete product (Server might need restart)");
    } finally {
      setIsDeleting(null);
    }
  };

  const categories = ["all", ...new Set(products.map((p) => p.category).filter(Boolean))];

  const filtered = products.filter((p) => {
    const name = p.name || "";
    const sku = p.sku || "";
    const tag = p.rfidTag || "";
    const matchSearch = 
      name.toLowerCase().includes(search.toLowerCase()) || 
      sku.toLowerCase().includes(search.toLowerCase()) || 
      tag.toLowerCase().includes(search.toLowerCase());
    const matchCategory = filterCategory === "all" || p.category === filterCategory;
    return matchSearch && matchCategory;
  });

  return (
    <AppLayout title="Inventory">
      <div className="space-y-4">
        {/* Header with Add Product */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Product Inventory</h2>
          <AddProductDialog onProductAdded={loadProducts} />
        </div>

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
          <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
            <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors capitalize whitespace-nowrap",
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

        {/* Table Wrapper */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="overflow-x-auto min-w-full">
            <Table>
              <TableHeader>
                <TableRow className="bg-secondary/30 hover:bg-secondary/30">
                  <TableHead className="w-[180px] font-bold">Product</TableHead>
                  <TableHead className="font-bold">SKU</TableHead>
                  <TableHead className="font-bold">RFID Tag</TableHead>
                  <TableHead className="font-bold">Location</TableHead>
                  <TableHead className="font-bold">Stock</TableHead>
                  <TableHead className="font-bold">RFID Status</TableHead>
                  <TableHead className="font-bold">Last Scanned</TableHead>
                  <TableHead className="text-right font-bold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length > 0 ? (
                  filtered.map((product) => {
                    const statusKey = (product.rfidStatus || "active") as keyof typeof statusConfig;
                    const status = statusConfig[statusKey] || statusConfig.active;
                    const StatusIcon = status.icon;
                    const stockPercent = product.maxCapacity ? Math.round((product.currentStock / product.maxCapacity) * 100) : 0;
                    const isLow = product.currentStock <= (product.minThreshold || 0);
                    const isEmpty = product.currentStock === 0;

                    return (
                      <TableRow key={product.id} className="hover:bg-secondary/20 transition-colors">
                        <TableCell>
                          <div>
                            <p className="text-sm font-bold text-foreground line-clamp-1">{product.name}</p>
                            <p className="text-[10px] text-muted-foreground uppercase font-medium tracking-wider">{product.category}</p>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-xs whitespace-nowrap">{product.sku}</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center gap-1.5 font-mono text-[9px] whitespace-nowrap">
                            <Radio className="h-3 w-3 text-primary shrink-0" />
                            {product.rfidTag}
                          </span>
                        </TableCell>
                        <TableCell className="font-mono text-xs whitespace-nowrap">{product.shelfLocation}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 w-10 rounded-full bg-secondary overflow-hidden shrink-0">
                              <div
                                className={cn("h-full rounded-full transition-all", isEmpty ? "bg-critical" : isLow ? "bg-warning" : "bg-success")}
                                style={{ width: `${Math.min(stockPercent, 100)}%` }}
                              />
                            </div>
                            <span className={cn("text-[11px] font-mono font-bold", isEmpty ? "text-critical" : isLow ? "text-warning" : "text-foreground")}>
                              {product.currentStock}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={cn("gap-1 text-[9px] py-0 px-1.5 font-bold uppercase whitespace-nowrap", status.className)}>
                            <StatusIcon className="h-2.5 w-2.5" />
                            {status.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-[10px] text-muted-foreground whitespace-nowrap">
                          {product.lastScanned ? new Date(product.lastScanned).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "---"}
                        </TableCell>
                        <TableCell className="text-right flex items-center justify-end gap-1">
                          <EditProductDialog product={product} onProductUpdated={loadProducts} />
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 text-muted-foreground hover:text-critical hover:bg-critical/10"
                                disabled={isDeleting === product.id}
                              >
                                {isDeleting === product.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Trash2 className="h-4 w-4" />
                                )}
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="border-border">
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Product?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete <span className="font-bold text-foreground">"{product.name}"</span>?
                                  This will remove it from all portals permanently.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => handleDelete(product.id)}
                                  className="bg-critical hover:bg-critical/90 text-white"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="h-32 text-center text-muted-foreground italic">
                      No products found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Inventory;
