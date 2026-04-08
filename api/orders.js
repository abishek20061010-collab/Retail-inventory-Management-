import { supabase } from './lib/supabase.js';

export default async function handler(req, res) {
  const { method } = req;

  if (method === 'GET') {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data.map(item => ({
      id: item.id,
      productId: item.product_id,
      productName: item.product_name,
      sku: item.sku,
      quantity: item.quantity,
      unitPrice: item.unit_price,
      totalPrice: item.total_price,
      supplierStatus: item.supplier_status,
      managerStatus: item.manager_status,
      orderedBy: item.ordered_by,
      supplierName: item.supplier_name,
      createdAt: item.created_at,
      estimatedDelivery: item.estimated_delivery
    })));
  }

  if (method === 'POST') {
    const { 
      id, productId, productName, sku, quantity, unitPrice, 
      totalPrice, supplierStatus, managerStatus, orderedBy, 
      supplierName, createdAt, estimatedDelivery 
    } = req.body;

    const { error } = await supabase
      .from('orders')
      .insert([{
        id, 
        product_id: productId, 
        product_name: productName, 
        sku, 
        quantity, 
        unit_price: unitPrice, 
        total_price: totalPrice, 
        supplier_status: supplierStatus, 
        manager_status: managerStatus, 
        ordered_by: orderedBy, 
        supplier_name: supplierName, 
        created_at: createdAt, 
        estimated_delivery: estimatedDelivery
      }]);

    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json({ message: 'Order created', id });
  }

  // Handle PUT for status updates (special case /api/orders/[id]/status)
  // Since Vercel doesn't easily support dynamic segments in the root api/ folder without file structure
  // We'll handle it via query params or a separate file.
  // Let's use a separate file for status updates for clarity: api/orders/status.js
  
  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${method} Not Allowed`);
}
