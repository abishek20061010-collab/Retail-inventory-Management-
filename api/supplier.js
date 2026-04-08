import { supabase } from './lib/supabase.js';

export default async function handler(req, res) {
  const { method, query } = req;
  const { path } = query; // We'll use a query param 'path' to distinguish between products and invoices

  if (method === 'GET') {
    if (path === 'products') {
      const { data, error } = await supabase.from('supplier_products').select('*');
      if (error) return res.status(500).json({ error: error.message });
      return res.status(200).json(data.map(item => ({
        id: item.id,
        name: item.name,
        sku: item.sku,
        category: item.category,
        unitPrice: item.unit_price,
        stockAvailable: item.stock_available,
        leadTimeDays: item.lead_time_days
      })));
    }
    if (path === 'invoices') {
      const { data, error } = await supabase.from('invoices').select('*').order('created_at', { ascending: false });
      if (error) return res.status(500).json({ error: error.message });
      return res.status(200).json(data.map(item => ({
        id: item.id,
        orderId: item.order_id,
        productName: item.product_name,
        quantity: item.quantity,
        unitPrice: item.unit_price,
        totalAmount: item.total_amount,
        status: item.status,
        createdAt: item.created_at,
        dueDate: item.due_date
      })));
    }
  }

  if (method === 'POST' && path === 'invoices') {
    const { id, orderId, productName, quantity, unitPrice, totalAmount, status, createdAt, dueDate } = req.body;
    const { error } = await supabase
      .from('invoices')
      .insert([{
        id, order_id: orderId, product_name: productName, quantity, 
        unit_price: unitPrice, total_amount: totalAmount, status, 
        created_at: createdAt, due_date: dueDate
      }]);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json({ message: 'Invoice created' });
  }

  if (method === 'PUT' && path === 'invoices') {
    const { id, status } = req.body;
    const { error } = await supabase
      .from('invoices')
      .update({ status })
      .eq('id', id);
    if (error) return res.status(500).json({ error: error.message });
    return res.json({ message: 'Invoice status updated' });
  }

  res.status(404).json({ error: 'Route not found' });
}
