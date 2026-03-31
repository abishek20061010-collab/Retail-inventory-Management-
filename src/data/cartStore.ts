// Shared cart utilities using localStorage so cart persists across page navigation

const CART_KEY = "shelf_savvy_cart";

export type CartItem = { productId: string; qty: number };

export const cartStore = {
  getItems: (): CartItem[] => {
    try {
      const raw = localStorage.getItem(CART_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  setItems: (items: CartItem[]) => {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  },

  addItem: (productId: string): CartItem[] => {
    const items = cartStore.getItems();
    const existing = items.find((i) => i.productId === productId);
    if (existing) {
      existing.qty += 1;
    } else {
      items.push({ productId, qty: 1 });
    }
    cartStore.setItems(items);
    return items;
  },

  updateQty: (productId: string, delta: number): CartItem[] => {
    const items = cartStore.getItems().map((i) =>
      i.productId === productId ? { ...i, qty: Math.max(1, i.qty + delta) } : i
    );
    cartStore.setItems(items);
    return items;
  },

  removeItem: (productId: string): CartItem[] => {
    const items = cartStore.getItems().filter((i) => i.productId !== productId);
    cartStore.setItems(items);
    return items;
  },

  clear: () => {
    localStorage.removeItem(CART_KEY);
  },

  getCount: (): number => {
    return cartStore.getItems().reduce((sum, item) => sum + item.qty, 0);
  },
};
