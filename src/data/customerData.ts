export interface CustomerProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  inStock: boolean;
  image?: string;
}

export interface CustomerOrder {
  id: string;
  items: { name: string; qty: number; price: number }[];
  total: number;
  status: "placed" | "confirmed" | "out-for-delivery" | "delivered";
  placedAt: string;
  estimatedDelivery: string;
}

export const customerProducts: CustomerProduct[] = [
  { id: "CP-001", name: "Organic Whole Milk 1L", category: "Dairy", price: 3.49, inStock: true },
  { id: "CP-002", name: "Sourdough Bread Loaf", category: "Bakery", price: 4.99, inStock: true },
  { id: "CP-003", name: "Free Range Eggs 12pk", category: "Dairy", price: 5.29, inStock: true },
  { id: "CP-004", name: "Avocado Hass (each)", category: "Produce", price: 1.99, inStock: false },
  { id: "CP-005", name: "Sparkling Water 500ml", category: "Beverages", price: 1.29, inStock: true },
  { id: "CP-006", name: "Greek Yogurt 500g", category: "Dairy", price: 4.49, inStock: false },
  { id: "CP-007", name: "Chicken Breast 500g", category: "Meat", price: 8.99, inStock: true },
  { id: "CP-008", name: "Basmati Rice 1kg", category: "Grains", price: 3.99, inStock: true },
  { id: "CP-009", name: "Olive Oil Extra Virgin 750ml", category: "Oils", price: 9.49, inStock: true },
  { id: "CP-010", name: "Almond Butter 250g", category: "Spreads", price: 6.99, inStock: true },
];

export const customerOrders: CustomerOrder[] = [
  {
    id: "CO-001",
    items: [
      { name: "Organic Whole Milk 1L", qty: 2, price: 3.49 },
      { name: "Sourdough Bread Loaf", qty: 1, price: 4.99 },
    ],
    total: 11.97,
    status: "delivered",
    placedAt: "2026-03-28T10:00:00",
    estimatedDelivery: "2026-03-29",
  },
  {
    id: "CO-002",
    items: [
      { name: "Chicken Breast 500g", qty: 3, price: 8.99 },
      { name: "Basmati Rice 1kg", qty: 2, price: 3.99 },
    ],
    total: 34.95,
    status: "out-for-delivery",
    placedAt: "2026-03-30T14:00:00",
    estimatedDelivery: "2026-03-31",
  },
  {
    id: "CO-003",
    items: [
      { name: "Almond Butter 250g", qty: 1, price: 6.99 },
    ],
    total: 6.99,
    status: "placed",
    placedAt: "2026-03-31T09:30:00",
    estimatedDelivery: "2026-04-02",
  },
];
