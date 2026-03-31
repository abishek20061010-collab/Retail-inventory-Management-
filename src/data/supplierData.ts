export interface SupplierProduct {
  id: string;
  name: string;
  sku: string;
  category: string;
  unitPrice: number;
  stockAvailable: number;
  leadTimeDays: number;
}

export interface SupplierOrder {
  id: string;
  productName: string;
  sku: string;
  quantity: number;
  totalPrice: number;
  status: "new" | "accepted" | "processing" | "shipped" | "delivered";
  orderedBy: string;
  orderedAt: string;
  estimatedDelivery: string;
}

export interface Invoice {
  id: string;
  orderId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  status: "draft" | "sent" | "paid";
  createdAt: string;
  dueDate: string;
}

export const supplierProducts: SupplierProduct[] = [
  { id: "SP-001", name: "Organic Whole Milk 1L", sku: "DRY-001", category: "Dairy", unitPrice: 2.80, stockAvailable: 500, leadTimeDays: 1 },
  { id: "SP-002", name: "Sourdough Bread Loaf", sku: "BKR-012", category: "Bakery", unitPrice: 3.20, stockAvailable: 300, leadTimeDays: 1 },
  { id: "SP-003", name: "Free Range Eggs 12pk", sku: "DRY-045", category: "Dairy", unitPrice: 3.80, stockAvailable: 400, leadTimeDays: 2 },
  { id: "SP-004", name: "Avocado Hass (each)", sku: "PRD-089", category: "Produce", unitPrice: 1.20, stockAvailable: 800, leadTimeDays: 2 },
  { id: "SP-005", name: "Greek Yogurt 500g", sku: "DRY-067", category: "Dairy", unitPrice: 3.20, stockAvailable: 250, leadTimeDays: 1 },
  { id: "SP-006", name: "Chicken Breast 500g", sku: "MEA-034", category: "Meat", unitPrice: 6.50, stockAvailable: 200, leadTimeDays: 1 },
  { id: "SP-007", name: "Basmati Rice 1kg", sku: "GRN-011", category: "Grains", unitPrice: 2.50, stockAvailable: 600, leadTimeDays: 3 },
  { id: "SP-008", name: "Olive Oil Extra Virgin 750ml", sku: "OIL-002", category: "Oils", unitPrice: 7.00, stockAvailable: 150, leadTimeDays: 3 },
];

export const supplierOrders: SupplierOrder[] = [
  { id: "SO-001", productName: "Sourdough Bread Loaf", sku: "BKR-012", quantity: 40, totalPrice: 128.00, status: "new", orderedBy: "Store Manager", orderedAt: "2026-03-31T10:22:00", estimatedDelivery: "2026-04-01" },
  { id: "SO-002", productName: "Avocado Hass (each)", sku: "PRD-089", quantity: 50, totalPrice: 60.00, status: "accepted", orderedBy: "Store Manager", orderedAt: "2026-03-31T10:19:00", estimatedDelivery: "2026-04-02" },
  { id: "SO-003", productName: "Greek Yogurt 500g", sku: "DRY-067", quantity: 35, totalPrice: 112.00, status: "shipped", orderedBy: "Store Manager", orderedAt: "2026-03-30T14:00:00", estimatedDelivery: "2026-03-31" },
  { id: "SO-004", productName: "Olive Oil Extra Virgin 750ml", sku: "OIL-002", quantity: 20, totalPrice: 140.00, status: "delivered", orderedBy: "Store Manager", orderedAt: "2026-03-28T09:00:00", estimatedDelivery: "2026-03-30" },
];

export const invoices: Invoice[] = [
  { id: "INV-001", orderId: "SO-004", productName: "Olive Oil Extra Virgin 750ml", quantity: 20, unitPrice: 7.00, totalAmount: 140.00, status: "paid", createdAt: "2026-03-30T16:00:00", dueDate: "2026-04-15" },
  { id: "INV-002", orderId: "SO-003", productName: "Greek Yogurt 500g", quantity: 35, unitPrice: 3.20, totalAmount: 112.00, status: "sent", createdAt: "2026-03-31T08:00:00", dueDate: "2026-04-15" },
];
