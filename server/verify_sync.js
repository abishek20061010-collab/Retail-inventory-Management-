const mysql = require('mysql2/promise');
require('dotenv').config();

async function verify() {
  const db = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'shelf_savvy'
  });

  try {
    console.log('--- START VERIFICATION ---');
    
    // 1. Check stock before
    const [rowsBefore] = await db.query('SELECT currentStock FROM inventory_products WHERE name = ?', ["Organic Whole Milk 1L"]);
    const stockBefore = rowsBefore[0].currentStock;
    console.log('Stock BEFORE:', stockBefore);

    // 2. Create mock order
    console.log('Creating mock order RO-TEST...');
    // Clear old test if exists
    await db.query('DELETE FROM orders WHERE id = ?', ['RO-TEST']);
    await db.query('INSERT INTO orders (id, product_id, product_name, sku, quantity, unit_price, total_price, supplier_status, manager_status, created_at, estimated_delivery) VALUES (?,?,?,?,?,?,?,?,?,?,?)', 
      ['RO-TEST', '1', 'Organic Whole Milk 1L', 'DRY-001', 20, 3.49, 69.80, 'shipped', 'shipped', '2026-03-31 10:00:00', '2026-04-01']
    );

    // 3. Trigger delivery via API
    console.log('Triggering delivery sync via API...');
    const res = await fetch('http://localhost:5000/api/orders/RO-TEST/status', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ supplier_status: 'delivered' })
    });
    const result = await res.json();
    console.log('API Response:', result);

    // 4. Verify results
    const [rowsAfter] = await db.query('SELECT currentStock FROM inventory_products WHERE name = ?', ["Organic Whole Milk 1L"]);
    const stockAfter = rowsAfter[0].currentStock;
    console.log('Stock AFTER:', stockAfter);

    const [custRows] = await db.query('SELECT inStock FROM customer_products WHERE name = ?', ["Organic Whole Milk 1L"]);
    console.log('Customer inStock:', custRows[0].inStock);

    if (stockAfter === stockBefore + 20 && custRows[0].inStock === 1) {
      console.log('>>> SUCCESS: Inventory and Customer Portal are perfectly synced! <<<');
    } else {
      console.error('>>> FAILURE: Stock or Sync mismatch! <<<');
    }

    process.exit(0);
  } catch (err) {
    console.error('Error during verification:', err);
    process.exit(1);
  }
}

verify();
