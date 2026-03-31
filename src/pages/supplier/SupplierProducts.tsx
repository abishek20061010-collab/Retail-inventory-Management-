import { useState } from "react";
import SupplierLayout from "@/components/layout/SupplierLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search } from "lucide-react";
import { supplierProducts } from "@/data/supplierData";

const SupplierProducts = () => {
  const [search, setSearch] = useState("");

  const filtered = supplierProducts.filter(
    (p) => p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SupplierLayout title="Product Catalog">
      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-semibold text-foreground">My Products</CardTitle>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-secondary border-border text-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead className="text-muted-foreground">Product</TableHead>
                <TableHead className="text-muted-foreground">SKU</TableHead>
                <TableHead className="text-muted-foreground">Category</TableHead>
                <TableHead className="text-muted-foreground">Unit Price</TableHead>
                <TableHead className="text-muted-foreground">Stock Available</TableHead>
                <TableHead className="text-muted-foreground">Lead Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((p) => (
                <TableRow key={p.id} className="border-border">
                  <TableCell className="font-medium text-foreground">{p.name}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{p.sku}</TableCell>
                  <TableCell><Badge variant="secondary" className="text-xs">{p.category}</Badge></TableCell>
                  <TableCell className="text-foreground">${p.unitPrice.toFixed(2)}</TableCell>
                  <TableCell className={p.stockAvailable < 200 ? "text-warning" : "text-success"}>{p.stockAvailable}</TableCell>
                  <TableCell className="text-muted-foreground">{p.leadTimeDays}d</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </SupplierLayout>
  );
};

export default SupplierProducts;
