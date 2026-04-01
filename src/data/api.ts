const API_BASE = `http://${window.location.hostname}:5000/api`;

export const api = {
  orders: {
    getAll: async () => {
      const res = await fetch(`${API_BASE}/orders`);
      return await res.json();
    }
  },
  // Manager Endpoints
  inventory: {
    getAll: async () => {
      const res = await fetch(`${API_BASE}/inventory`);
      return await res.json();
    },
    update: async (id: string, data: {
      name: string; sku: string; category: string; rfidTag?: string;
      shelfLocation: string; currentStock: number; minThreshold: number;
      maxCapacity: number; unitPrice: number; rfidStatus?: string;
      manufactureDate?: string; expiryDate?: string;
    }) => {
      const res = await fetch(`${API_BASE}/inventory/${id}`, { 
        method: "PUT", 
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify(data) 
      });
      return await res.json();
    },
    addProduct: async (data: {
      name: string; sku: string; category: string; rfidTag?: string;
      shelfLocation: string; currentStock: number; minThreshold: number;
      maxCapacity: number; unitPrice: number; rfidStatus?: string;
      manufactureDate?: string; expiryDate?: string;
    }) => {
      const res = await fetch(`${API_BASE}/inventory`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return await res.json();
    },
    deleteProduct: async (id: string) => {
      const res = await fetch(`${API_BASE}/inventory/${id}`, {
        method: "DELETE",
      });
      return await res.json();
    }
  },
  alerts: {
    getAll: async () => {
      const res = await fetch(`${API_BASE}/alerts`);
      return await res.json();
    },
    markRead: async () => {
      const res = await fetch(`${API_BASE}/alerts/mark-read`, { method: "PUT" });
      return await res.json();
    }
  },
  trends: {
    getAll: async () => {
      const res = await fetch(`${API_BASE}/trends`);
      return await res.json();
    }
  },
  // Supplier Endpoints
  supplier: {
    getProducts: async () => {
      const res = await fetch(`${API_BASE}/supplier/products`);
      return await res.json();
    },
    getInvoices: async () => {
      const res = await fetch(`${API_BASE}/supplier/invoices`);
      return await res.json();
    },
    createInvoice: async (data: any) => {
      const res = await fetch(`${API_BASE}/supplier/invoices`, { 
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) 
      });
      return await res.json();
    },
    updateInvoiceStatus: async (id: string, status: string) => {
      const res = await fetch(`${API_BASE}/supplier/invoices/${id}/status`, { 
        method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) 
      });
      return await res.json();
    }
  },
  // Customer Endpoints
  customer: {
    getProducts: async () => {
      const res = await fetch(`${API_BASE}/customer/products`);
      return await res.json();
    },
    getOrders: async () => {
      const res = await fetch(`${API_BASE}/customer/orders`);
      return await res.json();
    },
    placeOrder: async (orderData: any) => {
      const res = await fetch(`${API_BASE}/customer/orders`, { 
        method: "POST", 
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify(orderData) 
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to place order");
      return data;
    }
  }
};
