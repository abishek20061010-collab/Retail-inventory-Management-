import { type SupplierOrder } from "./supplierData";
import { type ReorderRequest } from "./mockData";
import { toast } from "sonner";

const API_BASE = `/api/orders`;

const formatDate = (date: Date) => {
  return date.toISOString().split(".")[0];
};

export const fetchOrders = async () => {
  try {
    const res = await fetch(API_BASE);
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Failed to fetch orders from server", err);
    return [];
  }
};

export const placeBulkOrder = async (
  productId: string,
  productName: string,
  sku: string,
  quantity: number,
  unitPrice: number
) => {
  const now = new Date();
  const deliveryDate = new Date();
  deliveryDate.setDate(now.getDate() + 3);

  const orderIdNum = Math.floor(1000 + Math.random() * 9000);
  const orderId = `RO-${orderIdNum}`;

  const newOrder = {
    id: orderId,
    product_id: productId,
    product_name: productName,
    sku,
    quantity,
    unit_price: unitPrice,
    total_price: quantity * unitPrice,
    supplier_status: "new",
    manager_status: "pending",
    ordered_by: "Store Manager",
    supplier_name: "Default Supplier (Bulk)",
    created_at: formatDate(now),
    estimated_delivery: deliveryDate.toISOString().split("T")[0]
  };

  try {
    await fetch(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newOrder),
    });
  } catch (err) {
    console.error("Failed to place bulk order", err);
  }
};

export const syncStatus = async (orderId: string, supplierStatus: SupplierOrder["status"]) => {
  try {
    await fetch(`${API_BASE}/update-status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: orderId, supplier_status: supplierStatus }),
    });
  } catch (err) {
    console.error("Failed to update status on server", err);
  }
};
