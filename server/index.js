const express = require('express');
const cors = require('cors');
const db = require('./db');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Utility to handle DB queries
const executeQuery = async (res, query, params = []) => {
  try {
    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database query failed' });
  }
};

// Helper: Sync customer portal availability and create alerts
const syncStockLevel = async (productName, currentStock) => {
  try {
    // 1. Sync Customer Portal "In Stock" boolean
    await db.query(
      'UPDATE customer_products SET inStock = ? WHERE name = ?',
      [currentStock > 0 ? 1 : 0, productName]
    );

    // 2. Fetch minThreshold to check for alerts
    const [invRows] = await db.query('SELECT minThreshold FROM inventory_products WHERE name = ?', [productName]);
    if (invRows.length > 0) {
      const { minThreshold } = invRows[0];
      let alertType = null;
      let alertMsg = null;

      if (currentStock === 0) {
        alertType = 'critical';
        alertMsg = `Stock depleted — auto-reorder triggered`;
      } else if (currentStock < minThreshold) {
        alertType = 'warning';
        alertMsg = `Stock below minimum threshold (${currentStock} units left)`;
      }

      if (alertType) {
        const alertId = 'ALT-' + Date.now() + Math.floor(Math.random() * 1000);
        await db.query(
          'INSERT INTO alerts (id, type, message, productName, timestamp, is_read) VALUES (?, ?, ?, ?, ?, ?)',
          [alertId, alertType, alertMsg, productName, new Date().toISOString().split('.')[0].replace('T', ' '), 0]
        );
      }
    }
  } catch (e) {
    console.error('Sync error:', e);
  }
};

// ---------------- ORDERS ----------------
app.get('/api/orders', (req, res) => executeQuery(res, 'SELECT * FROM orders ORDER BY created_at DESC'));

app.post('/api/orders', async (req, res) => {
  const { id, product_id, product_name, sku, quantity, unit_price, total_price, supplier_status, manager_status, ordered_by, supplier_name, created_at, estimated_delivery } = req.body;
  const query = `INSERT INTO orders VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  try {
    await db.query(query, [id, product_id, product_name, sku, quantity, unit_price, total_price, supplier_status, manager_status, ordered_by, supplier_name, created_at, estimated_delivery]);
    res.status(201).json({ message: 'Order created', id });
  } catch(e) { 
    console.error(e); 
    res.status(500).json({ error: 'Failed to create order' }); 
  }
});

app.put('/api/orders/:id/status', async (req, res) => {
  const { id } = req.params;
  const { supplier_status } = req.body;
  let manager_status = 'pending';
  if (supplier_status === "new") manager_status = "pending";
  if (supplier_status === "accepted") manager_status = "approved";
  if (supplier_status === "processing") manager_status = "approved";
  if (supplier_status === "shipped") manager_status = "shipped";
  if (supplier_status === "delivered") manager_status = "delivered";

  const query = `UPDATE orders SET supplier_status = ?, manager_status = ? WHERE id = ?`;
  try {
    await db.query(query, [supplier_status, manager_status, id]);

    // Auto-sync: When delivered, add the ordered quantity back to inventory stock
    if (supplier_status === "delivered") {
      const [orderRows] = await db.query('SELECT sku, product_name, quantity FROM orders WHERE id = ?', [id]);
      if (orderRows.length > 0) {
        const { sku, product_name, quantity } = orderRows[0];
        
        // Update manager inventory by SKU (reliable cross-portal link)
        const today = new Date().toISOString().split('T')[0];
        const expiry = new Date();
        expiry.setMonth(expiry.getMonth() + 3);
        const expiryDate = expiry.toISOString().split('T')[0];

        await db.query(
          'UPDATE inventory_products SET currentStock = currentStock + ?, manufactureDate = ?, expiryDate = ? WHERE sku = ?', 
          [quantity, today, expiryDate, sku]
        );
        
        // Fetch new stock level to sync customer portal and trigger alerts
        const [invRows] = await db.query('SELECT currentStock FROM inventory_products WHERE sku = ?', [sku]);
        if (invRows.length > 0) {
          await syncStockLevel(product_name, invRows[0].currentStock);
        }
      }
    }

    res.json({ message: 'Order status updated' });
  } catch(e) { 
    console.error(e); 
    res.status(500).json({ error: 'Failed to update order status' }); 
  }
});

// ---------------- INVENTORY PRODUCTS ----------------
app.get('/api/inventory', (req, res) => executeQuery(res, 'SELECT * FROM inventory_products'));

app.post('/api/inventory', async (req, res) => {
  const { name, sku, category, rfidTag, shelfLocation, currentStock, minThreshold, maxCapacity, unitPrice, rfidStatus, manufactureDate, expiryDate } = req.body;
  
  // Generate unique IDs
  const invId = 'INV-' + Date.now();
  const suppId = 'SP-' + Date.now();
  const custId = 'CP-' + Date.now();
  const now = new Date().toISOString().split('.')[0];

  try {
    // 1. Insert into inventory_products
    await db.query(
      `INSERT INTO inventory_products (id, rfidTag, name, sku, category, shelfLocation, currentStock, minThreshold, maxCapacity, lastScanned, rfidStatus, unitPrice, manufactureDate, expiryDate)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [invId, rfidTag || 'RFID-' + Math.random().toString(36).substring(2, 8).toUpperCase(), name, sku, category, shelfLocation, currentStock, minThreshold, maxCapacity, now, rfidStatus || 'active', unitPrice, manufactureDate || null, expiryDate || null]
    );

    // 2. Insert into supplier_products (so supplier sees the product)
    await db.query(
      `INSERT INTO supplier_products (id, name, sku, category, unitPrice, stockAvailable, leadTimeDays)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [suppId, name, sku, category, unitPrice * 0.7, 500, 2]
    );

    // 3. Insert into customer_products (so customer can browse it)
    await db.query(
      `INSERT INTO customer_products (id, name, category, price, inStock, image)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [custId, name, category, unitPrice, currentStock > 0 ? 1 : 0, null]
    );

    res.status(201).json({ message: 'Product added and synced across all portals', id: invId });
  } catch(e) { console.error(e); res.status(500).json({ error: 'Failed to add product' }); }
});

app.put('/api/inventory/:id', async (req, res) => {
  const { id } = req.params;
  const { 
    name, sku, category, rfidTag, shelfLocation, 
    currentStock, minThreshold, maxCapacity, unitPrice, 
    rfidStatus, manufactureDate, expiryDate 
  } = req.body;

  try {
    // 1. Get original product to sync changes correctly
    const [oldRows] = await db.query('SELECT name, sku FROM inventory_products WHERE id = ?', [id]);
    if (oldRows.length === 0) return res.status(404).json({ error: 'Product not found' });
    const old = oldRows[0];

    // 2. Update the product in inventory
    const query = `
      UPDATE inventory_products 
      SET name = ?, sku = ?, category = ?, rfidTag = ?, shelfLocation = ?, 
          currentStock = ?, minThreshold = ?, maxCapacity = ?, unitPrice = ?, 
          rfidStatus = ?, manufactureDate = ?, expiryDate = ?
      WHERE id = ?
    `;
    await db.query(query, [
      name, sku, category, rfidTag, shelfLocation, 
      currentStock, minThreshold, maxCapacity, unitPrice, 
      rfidStatus, manufactureDate || null, expiryDate || null, 
      id
    ]);

    // 3. Sync changes to other tables
    // Update supplier portal (linked by SKU)
    await db.query(
      'UPDATE supplier_products SET name = ?, category = ?, unitPrice = ? WHERE sku = ?',
      [name, category, unitPrice * 0.7, old.sku]
    );

    // Update customer portal (linked by name)
    await db.query(
      'UPDATE customer_products SET name = ?, category = ?, price = ?, inStock = ? WHERE name = ?',
      [name, category, unitPrice, currentStock > 0 ? 1 : 0, old.name]
    );

    // 4. Check for alerts
    await syncStockLevel(name, currentStock);

    res.json({ message: 'Product updated successfully across all portals' });
  } catch(e) { 
    console.error(e); 
    res.status(500).json({ error: 'Failed to update inventory product' }); 
  }
});

app.delete('/api/inventory/:id', async (req, res) => {
  const { id } = req.params;
  console.log(`[DELETE] Received request to delete product ID: ${id}`);
  try {
    // 1. Get product name and SKU first to sync deletion
    const [rows] = await db.query('SELECT name, sku FROM inventory_products WHERE id = ?', [id]);
    
    if (rows.length > 0) {
      const { name, sku } = rows[0];
      console.log(`[DELETE] Found product: "${name}" (SKU: ${sku}). Proceeding with synced deletion.`);
      
      // 2. Delete from inventory
      await db.query('DELETE FROM inventory_products WHERE id = ?', [id]);
      
      // 3. Delete from supplier catalog
      await db.query('DELETE FROM supplier_products WHERE sku = ?', [sku]);
      
      // 4. Delete from customer portal
      await db.query('DELETE FROM customer_products WHERE name = ?', [name]);

      console.log(`[DELETE] Successfully deleted product "${name}" from all portals.`);
      res.json({ message: 'Product deleted and synced across all portals' });
    } else {
      console.warn(`[DELETE] Product ID "${id}" not found.`);
      res.status(404).json({ error: 'Product not found in inventory' });
    }
  } catch(e) { 
    console.error(`[DELETE ERROR] Error deleting product ID "${id}":`, e.message); 
    res.status(500).json({ error: 'Database error: ' + e.message }); 
  }
});

// ---------------- ALERTS ----------------
app.get('/api/alerts', (req, res) => executeQuery(res, 'SELECT * FROM alerts ORDER BY timestamp DESC'));

app.put('/api/alerts/mark-read', async (req, res) => {
  try {
    await db.query(`UPDATE alerts SET is_read = 1 WHERE is_read = 0`);
    res.json({ message: 'All alerts marked read' });
  } catch(e) { 
    console.error(e); 
    res.status(500).json({ error: 'Failed to mark alerts as read' }); 
  }
});

// ---------------- STOCK TRENDS ----------------
app.get('/api/trends', (req, res) => executeQuery(res, 'SELECT * FROM stock_trends ORDER BY id ASC'));

// ---------------- SUPPLIER ----------------
app.get('/api/supplier/products', (req, res) => executeQuery(res, 'SELECT * FROM supplier_products'));
app.get('/api/supplier/invoices', (req, res) => executeQuery(res, 'SELECT * FROM invoices ORDER BY createdAt DESC'));

app.post('/api/supplier/invoices', async (req, res) => {
  const { id, orderId, productName, quantity, unitPrice, totalAmount, status, createdAt, dueDate } = req.body;
  const query = `INSERT INTO invoices VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  try {
    await db.query(query, [id, orderId, productName, quantity, unitPrice, totalAmount, status, createdAt, dueDate]);
    res.status(201).json({ message: 'Invoice created' });
  } catch(e) { 
    console.error(e); 
    res.status(500).json({ error: 'Failed to create invoice' }); 
  }
});

app.put('/api/supplier/invoices/:id/status', async (req, res) => {
  const { status } = req.body;
  const query = `UPDATE invoices SET status = ? WHERE id = ?`;
  try {
    await db.query(query, [status, req.params.id]);
    res.json({ message: 'Invoice status updated' });
  } catch(e) { 
    console.error(e); 
    res.status(500).json({ error: 'Failed to update invoice status' }); 
  }
});

// ---------------- CUSTOMER ----------------
app.get('/api/customer/products', (req, res) => executeQuery(res, 'SELECT * FROM customer_products'));
app.get('/api/customer/orders', (req, res) => executeQuery(res, 'SELECT * FROM customer_orders ORDER BY placedAt DESC'));

app.post('/api/customer/orders', async (req, res) => {
  const { id, items, total, status, placedAt, estimatedDelivery } = req.body;
  const itemsList = Array.isArray(items) ? items : JSON.parse(items);
  
  try {
    // 1. STRICT VALIDATION: Check stock for all items before fulfilling order
    for (const item of itemsList) {
      const [invRows] = await db.query('SELECT currentStock FROM inventory_products WHERE name = ?', [item.name]);
      if (invRows.length === 0) {
        return res.status(400).json({ error: `Product ${item.name} not found in inventory.` });
      }
      const stock = invRows[0].currentStock;
      if (item.qty > stock) {
        return res.status(400).json({ 
          error: `Insufficient stock for ${item.name}.`,
          available: stock 
        });
      }
    }

    // 2. STOCK DEDUCTION & SYNC
    for (const item of itemsList) {
      // Deduct quantity
      await db.query(
        'UPDATE inventory_products SET currentStock = currentStock - ? WHERE name = ?',
        [item.qty, item.name]
      );
      
      // Get new stock level to sync portals and trigger alerts
      const [newStockRows] = await db.query('SELECT currentStock FROM inventory_products WHERE name = ?', [item.name]);
      if (newStockRows.length > 0) {
        await syncStockLevel(item.name, newStockRows[0].currentStock);
      }
    }

    // 3. CREATE ORDER RECORD
    const query = `INSERT INTO customer_orders VALUES (?, ?, ?, ?, ?, ?)`;
    await db.query(query, [id, JSON.stringify(items), total, status, placedAt, estimatedDelivery]);

    res.status(201).json({ message: 'Order created successfully', id });
  } catch(e) { 
    console.error(e); 
    res.status(500).json({ error: "An error occurred while placing your order." }); 
  }
});

// Catch-all for non-existent API routes
app.use((req, res) => {
  console.log(`[404] Missing Route: ${req.method} ${req.url}`);
  res.status(404).json({ 
    error: `Route not found: ${req.method} ${req.url}`,
    tip: 'Ensure the URL and HTTP method match the server definitions.'
  });
});

// Final error handler
app.use((err, req, res, next) => {
  console.error('[500] Unhandled Error:', err);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: err.message
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
