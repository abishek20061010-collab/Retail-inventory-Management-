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
import { Plus } from "lucide-react";
import { api } from "@/data/api";
import { toast } from "sonner";

const categories = ["Dairy", "Bakery", "Produce", "Beverages", "Meat", "Grains", "Oils", "Spreads", "Snacks", "Frozen"];

export function AddProductDialog({ onProductAdded }: { onProductAdded: () => void }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [category, setCategory] = useState("");
  const [rfidTag, setRfidTag] = useState("");
  const [shelfLocation, setShelfLocation] = useState("");
  const [currentStock, setCurrentStock] = useState("0");
  const [minThreshold, setMinThreshold] = useState("10");
  const [maxCapacity, setMaxCapacity] = useState("100");
  const [unitPrice, setUnitPrice] = useState("");
  const [rfidStatus, setRfidStatus] = useState("active");

  const resetForm = () => {
    setName(""); setSku(""); setCategory(""); setRfidTag("");
    setShelfLocation(""); setCurrentStock("0"); setMinThreshold("10");
    setMaxCapacity("100"); setUnitPrice(""); setRfidStatus("active");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !sku || !category || !shelfLocation || !unitPrice) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      await api.inventory.addProduct({
        name,
        sku,
        category,
        rfidTag: rfidTag || undefined,
        shelfLocation,
        currentStock: parseInt(currentStock, 10) || 0,
        minThreshold: parseInt(minThreshold, 10) || 10,
        maxCapacity: parseInt(maxCapacity, 10) || 100,
        unitPrice: parseFloat(unitPrice) || 0,
        rfidStatus,
      });

      toast.success(`${name} added to inventory and synced across all portals.`);
      resetForm();
      setOpen(false);
      onProductAdded();
    } catch (err) {
      toast.error("Failed to add product.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) resetForm(); }}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-primary to-[hsl(200,95%,45%)] text-primary-foreground gap-2">
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
          <DialogDescription>
            Fill in the product details below. The product will be synced across Manager, Supplier, and Customer portals.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Row 1: Name & SKU */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="prod-name">Product Name *</Label>
                <Input id="prod-name" placeholder="e.g. Organic Whole Milk 1L" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="prod-sku">SKU *</Label>
                <Input id="prod-sku" placeholder="e.g. DRY-100" value={sku} onChange={(e) => setSku(e.target.value)} required />
              </div>
            </div>

            {/* Row 2: Category & Shelf Location */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category *</Label>
                <Select value={category} onValueChange={setCategory} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="prod-shelf">Shelf Location *</Label>
                <Input id="prod-shelf" placeholder="e.g. A1-05" value={shelfLocation} onChange={(e) => setShelfLocation(e.target.value)} required />
              </div>
            </div>

            {/* Row 3: RFID Tag & RFID Status */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="prod-rfid">RFID Tag</Label>
                <Input id="prod-rfid" placeholder="Auto-generated if empty" value={rfidTag} onChange={(e) => setRfidTag(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>RFID Status</Label>
                <Select value={rfidStatus} onValueChange={setRfidStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Row 4: Stock numbers */}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="prod-stock">Current Stock</Label>
                <Input id="prod-stock" type="number" min="0" value={currentStock} onChange={(e) => setCurrentStock(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="prod-min">Min Threshold</Label>
                <Input id="prod-min" type="number" min="0" value={minThreshold} onChange={(e) => setMinThreshold(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="prod-max">Max Capacity</Label>
                <Input id="prod-max" type="number" min="1" value={maxCapacity} onChange={(e) => setMaxCapacity(e.target.value)} />
              </div>
            </div>

            {/* Row 5: Unit Price */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="prod-price">Unit Price ($) *</Label>
                <Input id="prod-price" type="number" step="0.01" min="0.01" placeholder="e.g. 3.49" value={unitPrice} onChange={(e) => setUnitPrice(e.target.value)} required />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add Product"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
