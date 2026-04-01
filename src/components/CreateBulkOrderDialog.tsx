import { useState, useEffect } from "react";
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
import { api } from "@/data/api";
import { placeBulkOrder } from "@/data/orderManager";
import { toast } from "sonner";

export function CreateBulkOrderDialog({ onOrderCreated }: { onOrderCreated: () => void }) {
  const [open, setOpen] = useState(false);
  const [supplierProducts, setSupplierProducts] = useState<any[]>([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [quantity, setQuantity] = useState("10");

  useEffect(() => {
    if (open) {
      api.supplier.getProducts().then(setSupplierProducts);
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProductId || !quantity) return;

    const product = supplierProducts.find((p) => p.id === selectedProductId);
    if (!product) return;

    const qty = parseInt(quantity, 10);
    if (qty <= 0) return;

    // Place the order securely bypassing frontend limits
    await placeBulkOrder(
      product.id,
      product.name,
      product.sku,
      qty,
      product.unitPrice
    );

    toast.success(`Bulk order for ${qty}x ${product.name} placed successfully.`);
    setOpen(false);
    onOrderCreated(); // Trigger parent refresh
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Place Bulk Order</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Place Bulk Order</DialogTitle>
          <DialogDescription>
            Select a product from the supplier catalog and enter the desired bulk quantity.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="product" className="text-right">
                Product
              </Label>
              <div className="col-span-3">
                 <Select value={selectedProductId} onValueChange={setSelectedProductId} required>
                  <SelectTrigger id="product">
                    <SelectValue placeholder="Select supplier product" />
                  </SelectTrigger>
                  <SelectContent>
                    {supplierProducts.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name} - ₹{Number(p.unitPrice).toFixed(2)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="quantity" className="text-right">
                Quantity
              </Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Place Order</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
