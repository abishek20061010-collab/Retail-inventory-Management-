const mysql = require('mysql2/promise');
require('dotenv').config();

async function fixSync() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'shelf_savvy'
  });

  try {
    console.log("Synchronizing customer_products with inventory_products...");

    // Fetch all current inventory counts
    const [invProducts] = await connection.query('SELECT name, currentStock FROM inventory_products');

    for (const p of invProducts) {
      const inStock = p.currentStock > 0 ? 1 : 0;
      await connection.query(
        'UPDATE customer_products SET inStock = ? WHERE name = ?',
        [inStock, p.name]
      );
      console.log(`Synced ${p.name}: Stock ${p.currentStock} -> InStock ${inStock}`);
    }

    console.log("Sync complete!");
    process.exit(0);
  } catch (error) {
    console.error("Error during sync:", error);
    process.exit(1);
  }
}

fixSync();
