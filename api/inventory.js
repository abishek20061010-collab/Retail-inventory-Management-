import { supabase } from './lib/supabase';
import { syncStockLevel } from './lib/sync';

export default async function handler(req, res) {
  const { method } = req;
  const { id } = req.query; // For PUT and DELETE

  if (method === 'GET') {
    const { data, error } = await supabase
      .from('inventory_products')
      .select('*');

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  if (method === 'POST') {
    const { 
      name, sku, category, rfidTag, shelfLocation, 
      currentStock, minThreshold, maxCapacity, unitPrice, 
      rfidStatus, manufactureDate, expiryDate 
    } = req.body;
    
    const invId = 'INV-' + Date.now();
    const suppId = 'SP-' + Date.now();
    const custId = 'CP-' + Date.now();
    const now = new Date().toISOString();

    try {
      // 1. Insert into inventory_products
      const { error: invErr } = await supabase
        .from('inventory_products')
        .insert([{
          id: invId, rfid_tag: rfidTag || 'RFID-' + Math.random().toString(36).substring(2, 8).toUpperCase(), 
          name, sku, category, shelf_location: shelfLocation, current_stock: currentStock, 
          min_threshold: minThreshold, max_capacity: maxCapacity, last_scanned: now, 
          rfid_status: rfidStatus || 'active', unit_price: unitPrice, 
          manufacture_date: manufactureDate || null, expiry_date: expiryDate || null
        }]);
      if (invErr) throw invErr;

      // 2. Insert into supplier_products
      const { error: suppErr } = await supabase
        .from('supplier_products')
        .insert([{
          id: suppId, name, sku, category, unit_price: unitPrice * 0.7, 
          stock_available: 500, lead_time_days: 2
        }]);
      if (suppErr) throw suppErr;

      // 3. Insert into customer_products
      const { error: custErr } = await supabase
        .from('customer_products')
        .insert([{
          id: custId, name, category, price: unitPrice, 
          in_stock: currentStock > 0, image: null
        }]);
      if (custErr) throw custErr;

      return res.status(201).json({ message: 'Product added and synced', id: invId });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  if (method === 'PUT') {
    const { 
      name, sku, category, rfidTag, shelfLocation, 
      currentStock, minThreshold, maxCapacity, unitPrice, 
      rfidStatus, manufactureDate, expiryDate 
    } = req.body;

    try {
      // 1. Get original product
      const { data: old, error: fetchErr } = await supabase
        .from('inventory_products')
        .select('name, sku')
        .eq('id', id)
        .single();
      if (fetchErr) throw fetchErr;

      // 2. Update inventory
      const { error: updateErr } = await supabase
        .from('inventory_products')
        .update({
          name, sku, category, rfid_tag: rfidTag, shelf_location: shelfLocation, 
          current_stock: currentStock, min_threshold: minThreshold, 
          max_capacity: maxCapacity, unit_price: unitPrice, 
          rfid_status: rfidStatus, manufacture_date: manufactureDate || null, 
          expiry_date: expiryDate || null
        })
        .eq('id', id);
      if (updateErr) throw updateErr;

      // 3. Sync
      await supabase
        .from('supplier_products')
        .update({ name, category, unit_price: unitPrice * 0.7 })
        .eq('sku', old.sku);

      await supabase
        .from('customer_products')
        .update({ name, category, price: unitPrice, in_stock: currentStock > 0 })
        .eq('name', old.name);

      await syncStockLevel(name, currentStock);

      return res.json({ message: 'Product updated successfully' });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  if (method === 'DELETE') {
    try {
      const { data: rows, error: fetchErr } = await supabase
        .from('inventory_products')
        .select('name, sku')
        .eq('id', id);
      
      if (fetchErr) throw fetchErr;

      if (rows && rows.length > 0) {
        const { name, sku } = rows[0];
        
        await supabase.from('inventory_products').delete().eq('id', id);
        await supabase.from('supplier_products').delete().eq('sku', sku);
        await supabase.from('customer_products').delete().eq('name', name);

        return res.json({ message: 'Product deleted and synced' });
      } else {
        return res.status(404).json({ error: 'Product not found' });
      }
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
  res.status(405).end(`Method ${method} Not Allowed`);
}
