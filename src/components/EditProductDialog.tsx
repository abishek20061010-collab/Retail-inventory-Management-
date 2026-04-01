import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pencil } from "lucide-react";
import { api } from "@/data/api";
import { toast } from "sonner";

interface EditProductDialogProps {
  product: any;
  onProductUpdated: () => void;
}

export function EditProductDialog({ product, onProductUpdated }: EditProductDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [name, setName] = useState(product.name || "");
  const [sku, setSku] = useState(product.sku || "");
  const [category, setCategory] = useState(product.category || "");
  const [rfidTag, setRfidTag] = useState(product.rfidTag || "");
  const [shelfLocation, setShelfLocation] = useState(product.shelfLocation || "");
  const [currentStock, setCurrentStock] = useState(String(product.currentStock || 0));
  const [minThreshold, setMinThreshold] = useState(String(product.minThreshold || 10));
  const [maxCapacity, setMaxCapacity] = useState(String(product.maxCapacity || 100));
  const [unitPrice, setUnitPrice] = useState(String(product.unitPrice || ""));
  const [rfidStatus, setRfidStatus] = useState(product.rfidStatus || "active");
  const [manufactureDate, setManufactureDate] = useState(product.manufactureDate ? product.manufactureDate.split('T')[0] : "");
  const [expiryDate, setExpiryDate] = useState(product.expiryDate ? product.expiryDate.split('T')[0] : "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.inventory.update(product.id, {
        name,
        sku,
        category,
        rfidTag,
        shelfLocation,
        currentStock: parseInt(currentStock, 10) || 0,
        minThreshold: parseInt(minThreshold, 10) || 10,
        maxCapacity: parseInt(maxCapacity, 10) || 100,
        unitPrice: parseFloat(unitPrice) || 0,
        rfidStatus,
        manufactureDate: manufactureDate || undefined,
        expiryDate: expiryDate || undefined,
      });

      toast.success(`${name} updated successfully.`);
      setOpen(false);
      onProductUpdated();
    } catch (e: any) {
      toast.error(e.message || "Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] border-border bg-card">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-foreground">Edit Product</DialogTitle>
          <DialogDescription>
            Modify the details for <span className="text-primary font-bold">{product.name}</span>. Changes will sync across all portals.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 py-4">
            {/* Row 1: Name & SKU */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Product Name *</Label>
                <Input id="edit-name" placeholder="e.g. Organic Whole Milk" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-sku">SKU *</Label>
                <Input id="edit-sku" placeholder="e.g. DRY-001" value={sku} onChange={(e) => setSku(e.target.value)} required />
              </div>
            </div>

            {/* Row 2: Category & RFID Tag */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-category">Category *</Label>
                <Input id="edit-category" placeholder="e.g. Dairy" value={category} onChange={(e) => setCategory(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-rfid">RFID Tag ID</Label>
                <Input id="edit-rfid" placeholder="Optional" value={rfidTag} onChange={(e) => setRfidTag(e.target.value)} />
              </div>
            </div>

            {/* Row 3: Location & Status */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-location">Shelf Location *</Label>
                <Input id="edit-location" placeholder="e.g. A1-03" value={shelfLocation} onChange={(e) => setShelfLocation(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-status">RFID Status</Label>
                <Select value={rfidStatus} onValueChange={setRfidStatus}>
                  <SelectTrigger id="edit-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="error">Error</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Row 4: Stock Management */}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-stock">Current Stock *</Label>
                <Input id="edit-stock" type="number" value={currentStock} onChange={(e) => setCurrentStock(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-min">Min Threshold *</Label>
                <Input id="edit-min" type="number" value={minThreshold} onChange={(e) => setMinThreshold(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-max">Max Capacity *</Label>
                <Input id="edit-max" type="number" value={maxCapacity} onChange={(e) => setMaxCapacity(e.target.value)} required />
              </div>
            </div>

            {/* Row 5: Unit Price & Dates */}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-price">Unit Price (₹) *</Label>
                <Input id="edit-price" type="number" step="0.01" min="0.01" value={unitPrice} onChange={(e) => setUnitPrice(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-mfg">MFG Date</Label>
                <Input id="edit-mfg" type="date" value={manufactureDate} onChange={(e) => setManufactureDate(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-exp">EXP Date</Label>
                <Input id="edit-exp" type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} />
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={loading}>
              {loading ? "Saving Changes..." : "Update Product"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
