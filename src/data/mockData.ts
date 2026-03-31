export interface Product {
  id: string;
  rfidTag: string;
  name: string;
  sku: string;
  category: string;
  shelfLocation: string;
  currentStock: number;
  minThreshold: number;
  maxCapacity: number;
  lastScanned: string;
  rfidStatus: "active" | "inactive" | "error";
  unitPrice: number;
}

export interface ReorderRequest {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  status: "pending" | "approved" | "shipped" | "delivered";
  createdAt: string;
  estimatedDelivery: string;
  supplier: string;
}

export interface Alert {
  id: string;
  type: "critical" | "warning" | "info";
  message: string;
  productName: string;
  timestamp: string;
  read: boolean;
}

export interface StockTrend {
  date: string;
  inStock: number;
  lowStock: number;
  outOfStock: number;
}

export const products: Product[] = [
  { id: "1", rfidTag: "RFID-0A1B2C", name: "Organic Whole Milk 1L", sku: "DRY-001", category: "Dairy", shelfLocation: "A1-03", currentStock: 45, minThreshold: 20, maxCapacity: 100, lastScanned: "2026-03-31T10:23:00", rfidStatus: "active", unitPrice: 3.49 },
  { id: "2", rfidTag: "RFID-3D4E5F", name: "Sourdough Bread Loaf", sku: "BKR-012", category: "Bakery", shelfLocation: "B2-01", currentStock: 8, minThreshold: 15, maxCapacity: 50, lastScanned: "2026-03-31T10:21:00", rfidStatus: "active", unitPrice: 4.99 },
  { id: "3", rfidTag: "RFID-6G7H8I", name: "Free Range Eggs 12pk", sku: "DRY-045", category: "Dairy", shelfLocation: "A1-07", currentStock: 62, minThreshold: 25, maxCapacity: 80, lastScanned: "2026-03-31T10:20:00", rfidStatus: "active", unitPrice: 5.29 },
  { id: "4", rfidTag: "RFID-9J0K1L", name: "Avocado Hass (each)", sku: "PRD-089", category: "Produce", shelfLocation: "C3-02", currentStock: 3, minThreshold: 20, maxCapacity: 60, lastScanned: "2026-03-31T10:18:00", rfidStatus: "active", unitPrice: 1.99 },
  { id: "5", rfidTag: "RFID-2M3N4O", name: "Sparkling Water 500ml", sku: "BEV-023", category: "Beverages", shelfLocation: "D1-05", currentStock: 120, minThreshold: 30, maxCapacity: 200, lastScanned: "2026-03-31T10:15:00", rfidStatus: "active", unitPrice: 1.29 },
  { id: "6", rfidTag: "RFID-5P6Q7R", name: "Greek Yogurt 500g", sku: "DRY-067", category: "Dairy", shelfLocation: "A2-01", currentStock: 0, minThreshold: 15, maxCapacity: 40, lastScanned: "2026-03-31T09:45:00", rfidStatus: "error", unitPrice: 4.49 },
  { id: "7", rfidTag: "RFID-8S9T0U", name: "Chicken Breast 500g", sku: "MEA-034", category: "Meat", shelfLocation: "E1-02", currentStock: 18, minThreshold: 10, maxCapacity: 30, lastScanned: "2026-03-31T10:22:00", rfidStatus: "active", unitPrice: 8.99 },
  { id: "8", rfidTag: "RFID-1V2W3X", name: "Basmati Rice 1kg", sku: "GRN-011", category: "Grains", shelfLocation: "F2-04", currentStock: 55, minThreshold: 20, maxCapacity: 80, lastScanned: "2026-03-31T10:10:00", rfidStatus: "active", unitPrice: 3.99 },
  { id: "9", rfidTag: "RFID-4Y5Z6A", name: "Olive Oil Extra Virgin 750ml", sku: "OIL-002", category: "Oils", shelfLocation: "F3-01", currentStock: 12, minThreshold: 10, maxCapacity: 35, lastScanned: "2026-03-31T10:05:00", rfidStatus: "inactive", unitPrice: 9.49 },
  { id: "10", rfidTag: "RFID-7B8C9D", name: "Almond Butter 250g", sku: "SPR-008", category: "Spreads", shelfLocation: "G1-03", currentStock: 28, minThreshold: 8, maxCapacity: 40, lastScanned: "2026-03-31T10:19:00", rfidStatus: "active", unitPrice: 6.99 },
];

export const reorderRequests: ReorderRequest[] = [
  { id: "RO-001", productId: "2", productName: "Sourdough Bread Loaf", sku: "BKR-012", quantity: 40, status: "pending", createdAt: "2026-03-31T10:22:00", estimatedDelivery: "2026-04-01", supplier: "Metro Bakery Co." },
  { id: "RO-002", productId: "4", productName: "Avocado Hass (each)", sku: "PRD-089", quantity: 50, status: "approved", createdAt: "2026-03-31T10:19:00", estimatedDelivery: "2026-04-01", supplier: "Fresh Farms Ltd." },
  { id: "RO-003", productId: "6", productName: "Greek Yogurt 500g", sku: "DRY-067", quantity: 35, status: "shipped", createdAt: "2026-03-30T14:00:00", estimatedDelivery: "2026-03-31", supplier: "Dairy Direct Inc." },
  { id: "RO-004", productId: "9", productName: "Olive Oil Extra Virgin 750ml", sku: "OIL-002", quantity: 20, status: "delivered", createdAt: "2026-03-28T09:00:00", estimatedDelivery: "2026-03-30", supplier: "Mediterranean Imports" },
];

export const alerts: Alert[] = [
  { id: "ALT-001", type: "critical", message: "Stock depleted — auto-reorder triggered", productName: "Greek Yogurt 500g", timestamp: "2026-03-31T09:46:00", read: false },
  { id: "ALT-002", type: "critical", message: "Stock critically low (3 units)", productName: "Avocado Hass (each)", timestamp: "2026-03-31T10:18:00", read: false },
  { id: "ALT-003", type: "warning", message: "Stock below minimum threshold", productName: "Sourdough Bread Loaf", timestamp: "2026-03-31T10:21:00", read: false },
  { id: "ALT-004", type: "warning", message: "RFID tag inactive — check scanner", productName: "Olive Oil Extra Virgin 750ml", timestamp: "2026-03-31T10:05:00", read: true },
  { id: "ALT-005", type: "info", message: "Reorder RO-003 shipped, arriving today", productName: "Greek Yogurt 500g", timestamp: "2026-03-31T08:30:00", read: true },
  { id: "ALT-006", type: "info", message: "Reorder RO-004 delivered successfully", productName: "Olive Oil Extra Virgin 750ml", timestamp: "2026-03-30T16:00:00", read: true },
];

export const stockTrends: StockTrend[] = [
  { date: "Mar 25", inStock: 7, lowStock: 2, outOfStock: 1 },
  { date: "Mar 26", inStock: 6, lowStock: 3, outOfStock: 1 },
  { date: "Mar 27", inStock: 7, lowStock: 2, outOfStock: 1 },
  { date: "Mar 28", inStock: 6, lowStock: 3, outOfStock: 1 },
  { date: "Mar 29", inStock: 5, lowStock: 4, outOfStock: 1 },
  { date: "Mar 30", inStock: 6, lowStock: 3, outOfStock: 1 },
  { date: "Mar 31", inStock: 5, lowStock: 3, outOfStock: 2 },
];

export const categoryDistribution = [
  { name: "Dairy", value: 3, fill: "hsl(217 91% 60%)" },
  { name: "Bakery", value: 1, fill: "hsl(38 92% 50%)" },
  { name: "Produce", value: 1, fill: "hsl(142 71% 45%)" },
  { name: "Beverages", value: 1, fill: "hsl(280 70% 55%)" },
  { name: "Meat", value: 1, fill: "hsl(0 72% 51%)" },
  { name: "Grains", value: 1, fill: "hsl(180 60% 45%)" },
  { name: "Oils", value: 1, fill: "hsl(50 80% 50%)" },
  { name: "Spreads", value: 1, fill: "hsl(320 60% 50%)" },
];
