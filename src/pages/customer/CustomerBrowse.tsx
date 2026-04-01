import { useState, useEffect } from "react";
import CustomerLayout from "@/components/layout/CustomerLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, ShoppingCart, Package } from "lucide-react";
import { api } from "@/data/api";
import { cartStore } from "@/data/cartStore";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const CustomerBrowse = () => {
  const navigate = useNavigate();
  const [customerProducts, setCustomerProducts] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [cartCount, setCartCount] = useState(cartStore.getCount());

  useEffect(() => {
    api.customer.getProducts().then(setCustomerProducts);
  }, []);

  const categories = ["All", ...Array.from(new Set(customerProducts.map((p) => p.category)))];

  const filtered = customerProducts.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "All" || p.category === category;
    return matchSearch && matchCat;
  });

  const addToCart = (id: string, name: string) => {
    cartStore.addItem(id);
    setCartCount(cartStore.getCount());
    toast.success(`${name} added to cart`);
  };

  return (
    <CustomerLayout title="Browse Products">
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 bg-secondary border-border text-sm" />
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-40 bg-secondary border-border text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {cartCount > 0 && (
          <Badge
            className="bg-warning text-warning-foreground px-3 py-1 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => navigate("/customer/cart")}
          >
            <ShoppingCart className="h-3.5 w-3.5 mr-1" /> {cartCount} items
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((p) => (
          <Card key={p.id} className="bg-card border-border hover:border-warning/30 transition-colors">
            <CardContent className="p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary mb-4">
                <Package className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-sm font-semibold text-foreground mb-1">{p.name}</h3>
              <p className="text-xs text-muted-foreground mb-3">{p.category}</p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-foreground">₹{Number(p.price).toFixed(2)}</span>
                {p.inStock ? (
                  <Button size="sm" onClick={() => addToCart(p.id, p.name)} className="text-xs bg-gradient-to-r from-warning to-[hsl(25,95%,53%)] text-primary-foreground">
                    Add to Cart
                  </Button>
                ) : (
                  <Badge variant="destructive" className="text-xs">Out of Stock</Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </CustomerLayout>
  );
};

export default CustomerBrowse;
