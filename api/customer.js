import { supabase } from './lib/supabase.js';
import { syncStockLevel } from './lib/sync.js';

export default async function handler(req, res) {
  const { method, query } = req;
  const { path } = query;

  if (method === 'GET') {
    if (path === 'products') {
      const { data, error } = await supabase.from('customer_products').select('*');
      if (error) return res.status(500).json({ error: error.message });
      return res.status(200).json(data.map(item => ({
        id: item.id,
        name: item.name,
        category: item.category,
        price: item.price,
        inStock: item.in_stock,
        image: item.image
      })));
    }
    if (path === 'orders') {
      const { data, error } = await supabase.from('customer_orders').select('*').order('placed_at', { ascending: false });
      if (error) return res.status(500).json({ error: error.message });
      return res.status(200).json(data.map(item => ({
        id: item.id,
        items: item.items,
        total: item.total,
        status: item.status,
        placedAt: item.placed_at,
        estimatedDelivery: item.estimated_delivery
      })));
    }
  }

  if (method === 'POST' && path === 'orders') {
    const { id, items, total, status, placedAt, estimatedDelivery } = req.body;
    const itemsList = Array.isArray(items) ? items : JSON.parse(items);

    try {
      // 1. Validate Stock
      for (const item of itemsList) {
        const { data: invRows, error: fetchErr } = await supabase
          .from('inventory_products')
          .select('current_stock')
          .eq('name', item.name)
          .single();
        
        if (fetchErr || !invRows) throw new Error(`Product ${item.name} not found`);
        if (item.qty > invRows.current_stock) {
          return res.status(400).json({ error: `Insufficient stock for ${item.name}`, available: invRows.current_stock });
        }
      }

      // 2. Deduct Stock & Sync
      for (const item of itemsList) {
        // We need to fetch current stock again or use an RPC for atomic decrement
        // For simplicity here, we'll fetch and update, but RPC is better for production.
        const { data: currentItem } = await supabase.from('inventory_products').select('current_stock').eq('name', item.name).single();
        const newStock = currentItem.current_stock - item.qty;
        
        await supabase.from('inventory_products').update({ current_stock: newStock }).eq('name', item.name);
        await syncStockLevel(item.name, newStock);
      }

      // 3. Create Order
      await supabase.from('customer_orders').insert([{
        id, items: itemsList, total, status, placed_at: placedAt, estimated_delivery: estimatedDelivery
      }]);

      return res.status(201).json({ message: 'Order created successfully', id });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  res.status(404).json({ error: 'Route not found' });
}
