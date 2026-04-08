import { supabase } from '../lib/supabase.js';
import { syncStockLevel } from '../lib/sync.js';

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    res.setHeader('Allow', ['PUT']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { id, supplier_status } = req.body;
  let manager_status = 'pending';
  if (supplier_status === "new") manager_status = "pending";
  if (supplier_status === "accepted") manager_status = "approved";
  if (supplier_status === "processing") manager_status = "approved";
  if (supplier_status === "shipped") manager_status = "shipped";
  if (supplier_status === "delivered") manager_status = "delivered";

  try {
    // 1. Update order status
    const { error: updateErr } = await supabase
      .from('orders')
      .update({ supplier_status, manager_status })
      .eq('id', id);
    if (updateErr) throw updateErr;

    // 2. Auto-sync if delivered
    if (supplier_status === "delivered") {
      const { data: order, error: fetchErr } = await supabase
        .from('orders')
        .select('sku, product_name, quantity')
        .eq('id', id)
        .single();
      
      if (fetchErr) throw fetchErr;

      if (order) {
        const today = new Date().toISOString().split('T')[0];
        const expiry = new Date();
        expiry.setMonth(expiry.getMonth() + 3);
        const expiryDate = expiry.toISOString().split('T')[0];

        // Fetch current stock
        const { data: invProd } = await supabase
          .from('inventory_products')
          .select('current_stock')
          .eq('sku', order.sku)
          .single();
        
        const newStock = (invProd?.current_stock || 0) + order.quantity;

        // Update inventory
        await supabase
          .from('inventory_products')
          .update({ 
            current_stock: newStock, 
            manufacture_date: today, 
            expiry_date: expiryDate 
          })
          .eq('sku', order.sku);
        
        // Sync customer portal and alerts
        await syncStockLevel(order.product_name, newStock);
      }
    }

    return res.json({ message: 'Order status updated' });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
