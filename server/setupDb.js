require('dotenv').config();
const mysql = require('mysql2/promise');

const inventoryProducts = [
  { id: "1", rfidTag: "RFID-0A1B2C", name: "Organic Whole Milk 1L", sku: "DRY-001", category: "Dairy", shelfLocation: "A1-03", currentStock: 45, minThreshold: 20, maxCapacity: 100, lastScanned: "2026-03-31T10:23:00", rfidStatus: "active", unitPrice: 3.49, manufactureDate: "2026-03-01", expiryDate: "2026-04-15" },
  { id: "2", rfidTag: "RFID-3D4E5F", name: "Sourdough Bread Loaf", sku: "BKR-012", category: "Bakery", shelfLocation: "B2-01", currentStock: 8, minThreshold: 15, maxCapacity: 50, lastScanned: "2026-03-31T10:21:00", rfidStatus: "active", unitPrice: 4.99, manufactureDate: "2026-03-25", expiryDate: "2026-04-05" },
  { id: "3", rfidTag: "RFID-6G7H8I", name: "Free Range Eggs 12pk", sku: "DRY-045", category: "Dairy", shelfLocation: "A1-07", currentStock: 62, minThreshold: 25, maxCapacity: 80, lastScanned: "2026-03-31T10:20:00", rfidStatus: "active", unitPrice: 5.29, manufactureDate: "2026-03-10", expiryDate: "2026-04-20" },
  { id: "4", rfidTag: "RFID-9J0K1L", name: "Avocado Hass (each)", sku: "PRD-089", category: "Produce", shelfLocation: "C3-02", currentStock: 3, minThreshold: 20, maxCapacity: 60, lastScanned: "2026-03-31T10:18:00", rfidStatus: "active", unitPrice: 1.99, manufactureDate: "2026-03-20", expiryDate: "2026-04-10" },
  { id: "5", rfidTag: "RFID-2M3N4O", name: "Sparkling Water 500ml", sku: "BEV-023", category: "Beverages", shelfLocation: "D1-05", currentStock: 120, minThreshold: 30, maxCapacity: 200, lastScanned: "2026-03-31T10:15:00", rfidStatus: "active", unitPrice: 1.29, manufactureDate: "2026-02-15", expiryDate: "2026-05-15" },
  { id: "6", rfidTag: "RFID-5P6Q7R", name: "Greek Yogurt 500g", sku: "DRY-067", category: "Dairy", shelfLocation: "A2-01", currentStock: 0, minThreshold: 15, maxCapacity: 40, lastScanned: "2026-03-31T09:45:00", rfidStatus: "error", unitPrice: 4.49, manufactureDate: "2026-03-05", expiryDate: "2026-03-25" },
  { id: "7", rfidTag: "RFID-8S9T0U", name: "Chicken Breast 500g", sku: "MEA-034", category: "Meat", shelfLocation: "E1-02", currentStock: 18, minThreshold: 10, maxCapacity: 30, lastScanned: "2026-03-31T10:22:00", rfidStatus: "active", unitPrice: 8.99, manufactureDate: "2026-03-15", expiryDate: "2026-04-05" },
  { id: "8", rfidTag: "RFID-1V2W3X", name: "Basmati Rice 1kg", sku: "GRN-011", category: "Grains", shelfLocation: "F2-04", currentStock: 55, minThreshold: 20, maxCapacity: 80, lastScanned: "2026-03-31T10:10:00", rfidStatus: "active", unitPrice: 3.99, manufactureDate: "2026-01-15", expiryDate: "2026-06-15" },
  { id: "9", rfidTag: "RFID-4Y5Z6A", name: "Olive Oil Extra Virgin 750ml", sku: "OIL-002", category: "Oils", shelfLocation: "F3-01", currentStock: 12, minThreshold: 10, maxCapacity: 35, lastScanned: "2026-03-31T10:05:00", rfidStatus: "inactive", unitPrice: 9.49, manufactureDate: "2025-12-01", expiryDate: "2026-06-01" },
  { id: "10", rfidTag: "RFID-7B8C9D", name: "Almond Butter 250g", sku: "SPR-008", category: "Spreads", shelfLocation: "G1-03", currentStock: 28, minThreshold: 8, maxCapacity: 40, lastScanned: "2026-03-31T10:19:00", rfidStatus: "active", unitPrice: 6.99, manufactureDate: "2026-02-01", expiryDate: "2026-05-01" }
];

const alerts = [
  { id: "ALT-001", type: "critical", message: "Stock depleted — auto-reorder triggered", productName: "Greek Yogurt 500g", timestamp: "2026-03-31T09:46:00", read: false },
  { id: "ALT-002", type: "critical", message: "Stock critically low (3 units)", productName: "Avocado Hass (each)", timestamp: "2026-03-31T10:18:00", read: false },
  { id: "ALT-003", type: "warning", message: "Stock below minimum threshold", productName: "Sourdough Bread Loaf", timestamp: "2026-03-31T10:21:00", read: false },
  { id: "ALT-004", type: "warning", message: "RFID tag inactive — check scanner", productName: "Olive Oil Extra Virgin 750ml", timestamp: "2026-03-31T10:05:00", read: true },
  { id: "ALT-005", type: "info", message: "Reorder RO-003 shipped, arriving today", productName: "Greek Yogurt 500g", timestamp: "2026-03-31T08:30:00", read: true },
  { id: "ALT-006", type: "info", message: "Reorder RO-004 delivered successfully", productName: "Olive Oil Extra Virgin 750ml", timestamp: "2026-03-30T16:00:00", read: true }
];

const stockTrends = [
  { date: "Mar 25", inStock: 7, lowStock: 2, outOfStock: 1 },
  { date: "Mar 26", inStock: 6, lowStock: 3, outOfStock: 1 },
  { date: "Mar 27", inStock: 7, lowStock: 2, outOfStock: 1 },
  { date: "Mar 28", inStock: 6, lowStock: 3, outOfStock: 1 },
  { date: "Mar 29", inStock: 5, lowStock: 4, outOfStock: 1 },
  { date: "Mar 30", inStock: 6, lowStock: 3, outOfStock: 1 },
  { date: "Mar 31", inStock: 5, lowStock: 3, outOfStock: 2 }
];

const supplierProducts = [
  { id: "SP-001", name: "Organic Whole Milk 1L", sku: "DRY-001", category: "Dairy", unitPrice: 2.80, stockAvailable: 500, leadTimeDays: 1 },
  { id: "SP-002", name: "Sourdough Bread Loaf", sku: "BKR-012", category: "Bakery", unitPrice: 3.20, stockAvailable: 300, leadTimeDays: 1 },
  { id: "SP-003", name: "Free Range Eggs 12pk", sku: "DRY-045", category: "Dairy", unitPrice: 3.80, stockAvailable: 400, leadTimeDays: 2 },
  { id: "SP-004", name: "Avocado Hass (each)", sku: "PRD-089", category: "Produce", unitPrice: 1.20, stockAvailable: 800, leadTimeDays: 2 },
  { id: "SP-005", name: "Greek Yogurt 500g", sku: "DRY-067", category: "Dairy", unitPrice: 3.20, stockAvailable: 250, leadTimeDays: 1 },
  { id: "SP-006", name: "Chicken Breast 500g", sku: "MEA-034", category: "Meat", unitPrice: 6.50, stockAvailable: 200, leadTimeDays: 1 },
  { id: "SP-007", name: "Basmati Rice 1kg", sku: "GRN-011", category: "Grains", unitPrice: 2.50, stockAvailable: 600, leadTimeDays: 3 },
  { id: "SP-008", name: "Olive Oil Extra Virgin 750ml", sku: "OIL-002", category: "Oils", unitPrice: 7.00, stockAvailable: 150, leadTimeDays: 3 }
];

const invoices = [
  { id: "INV-001", orderId: "SO-004", productName: "Olive Oil Extra Virgin 750ml", quantity: 20, unitPrice: 7.00, totalAmount: 140.00, status: "paid", createdAt: "2026-03-30T16:00:00", dueDate: "2026-04-15" },
  { id: "INV-002", orderId: "SO-003", productName: "Greek Yogurt 500g", quantity: 35, unitPrice: 3.20, totalAmount: 112.00, status: "sent", createdAt: "2026-03-31T08:00:00", dueDate: "2026-04-15" }
];

const customerProducts = [
  { id: "CP-001", name: "Organic Whole Milk 1L", category: "Dairy", price: 3.49, inStock: true, image: null },
  { id: "CP-002", name: "Sourdough Bread Loaf", category: "Bakery", price: 4.99, inStock: true, image: null },
  { id: "CP-003", name: "Free Range Eggs 12pk", category: "Dairy", price: 5.29, inStock: true, image: null },
  { id: "CP-004", name: "Avocado Hass (each)", category: "Produce", price: 1.99, inStock: false, image: null },
  { id: "CP-005", name: "Sparkling Water 500ml", category: "Beverages", price: 1.29, inStock: true, image: null },
  { id: "CP-006", name: "Greek Yogurt 500g", category: "Dairy", price: 4.49, inStock: false, image: null },
  { id: "CP-007", name: "Chicken Breast 500g", category: "Meat", price: 8.99, inStock: true, image: null },
  { id: "CP-008", name: "Basmati Rice 1kg", category: "Grains", price: 3.99, inStock: true, image: null },
  { id: "CP-009", name: "Olive Oil Extra Virgin 750ml", category: "Oils", price: 9.49, inStock: true, image: null },
  { id: "CP-010", name: "Almond Butter 250g", category: "Spreads", price: 6.99, inStock: true, image: null }
];

const customerOrders = [
  {
    id: "CO-001",
    items: [ { name: "Organic Whole Milk 1L", qty: 2, price: 3.49 }, { name: "Sourdough Bread Loaf", qty: 1, price: 4.99 } ],
    total: 11.97, status: "delivered", placedAt: "2026-03-28T10:00:00", estimatedDelivery: "2026-03-29"
  },
  {
    id: "CO-002",
    items: [ { name: "Chicken Breast 500g", qty: 3, price: 8.99 }, { name: "Basmati Rice 1kg", qty: 2, price: 3.99 } ],
    total: 34.95, status: "out-for-delivery", placedAt: "2026-03-30T14:00:00", estimatedDelivery: "2026-03-31"
  },
  {
    id: "CO-003",
    items: [ { name: "Almond Butter 250g", qty: 1, price: 6.99 } ],
    total: 6.99, status: "placed", placedAt: "2026-03-31T09:30:00", estimatedDelivery: "2026-04-02"
  }
];

const initialBulkOrders = [
  { id: "RO-001", productId: "2", productName: "Sourdough Bread Loaf", sku: "BKR-012", quantity: 40, unitPrice: 3.20, totalPrice: 128.00, supplierStatus: "new", managerStatus: "pending", orderedBy: "Store Manager", supplierName: "Metro Bakery Co.", createdAt: "2026-03-31T10:22:00", estimatedDelivery: "2026-04-01" },
  { id: "RO-002", productId: "4", productName: "Avocado Hass (each)", sku: "PRD-089", quantity: 50, unitPrice: 1.20, totalPrice: 60.00, supplierStatus: "accepted", managerStatus: "approved", orderedBy: "Store Manager", supplierName: "Fresh Farms Ltd.", createdAt: "2026-03-31T10:19:00", estimatedDelivery: "2026-04-01" },
  { id: "RO-003", productId: "6", productName: "Greek Yogurt 500g", sku: "DRY-067", quantity: 35, unitPrice: 3.20, totalPrice: 112.00, supplierStatus: "shipped", managerStatus: "shipped", orderedBy: "Store Manager", supplierName: "Dairy Direct Inc.", createdAt: "2026-03-30T14:00:00", estimatedDelivery: "2026-03-31" },
  { id: "RO-004", productId: "9", productName: "Olive Oil Extra Virgin 750ml", sku: "OIL-002", quantity: 20, unitPrice: 7.00, totalPrice: 140.00, supplierStatus: "delivered", managerStatus: "delivered", orderedBy: "Store Manager", supplierName: "Mediterranean Imports", createdAt: "2026-03-28T09:00:00", estimatedDelivery: "2026-03-30" }
];

async function setup() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    });

    console.log("Connected to MySQL. Rebuilding DB and Tables...");

    await connection.query('CREATE DATABASE IF NOT EXISTS shelf_savvy');
    await connection.query('USE shelf_savvy');

    // Drop tables to recreate cleanly
    await connection.query('DROP TABLE IF EXISTS orders, inventory_products, alerts, stock_trends, supplier_products, invoices, customer_products, customer_orders');

    // 1. orders
    await connection.query(`
      CREATE TABLE orders (
        id VARCHAR(50) PRIMARY KEY, product_id VARCHAR(50), product_name VARCHAR(100), sku VARCHAR(50), 
        quantity INT, unit_price DECIMAL(10,2), total_price DECIMAL(10,2), supplier_status VARCHAR(50), 
        manager_status VARCHAR(50), ordered_by VARCHAR(100), supplier_name VARCHAR(100), created_at DATETIME, estimated_delivery DATE
      )
    `);

    // 2. inventory_products
    await connection.query(`
      CREATE TABLE inventory_products (
        id VARCHAR(50) PRIMARY KEY, rfidTag VARCHAR(100), name VARCHAR(100), sku VARCHAR(50), category VARCHAR(50),
        shelfLocation VARCHAR(50), currentStock INT, minThreshold INT, maxCapacity INT,
        lastScanned DATETIME, rfidStatus VARCHAR(50), unitPrice DECIMAL(10,2),
        manufactureDate DATE, expiryDate DATE
      )
    `);

    // 3. alerts
    await connection.query(`
      CREATE TABLE alerts (
        id VARCHAR(50) PRIMARY KEY, type VARCHAR(50), message TEXT, productName VARCHAR(100), 
        timestamp DATETIME, is_read BOOLEAN
      )
    `);

    // 4. stock_trends
    await connection.query(`
      CREATE TABLE stock_trends (
        id INT AUTO_INCREMENT PRIMARY KEY, date VARCHAR(50), inStock INT, lowStock INT, outOfStock INT
      )
    `);

    // 5. supplier_products
    await connection.query(`
      CREATE TABLE supplier_products (
        id VARCHAR(50) PRIMARY KEY, name VARCHAR(100), sku VARCHAR(50), category VARCHAR(50),
        unitPrice DECIMAL(10,2), stockAvailable INT, leadTimeDays INT
      )
    `);

    // 6. invoices
    await connection.query(`
      CREATE TABLE invoices (
        id VARCHAR(50) PRIMARY KEY, orderId VARCHAR(50), productName VARCHAR(100), quantity INT,
        unitPrice DECIMAL(10,2), totalAmount DECIMAL(10,2), status VARCHAR(50), createdAt DATETIME, dueDate DATE
      )
    `);

    // 7. customer_products
    await connection.query(`
      CREATE TABLE customer_products (
        id VARCHAR(50) PRIMARY KEY, name VARCHAR(100), category VARCHAR(50), price DECIMAL(10,2), inStock BOOLEAN, image VARCHAR(255)
      )
    `);

    // 8. customer_orders
    await connection.query(`
      CREATE TABLE customer_orders (
        id VARCHAR(50) PRIMARY KEY, items JSON, total DECIMAL(10,2), status VARCHAR(50), placedAt DATETIME, estimatedDelivery DATE
      )
    `);

    console.log("Tables created. Injecting data...");

    for (const o of initialBulkOrders) await connection.query('INSERT INTO orders VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)',
      [o.id, o.productId, o.productName, o.sku, o.quantity, o.unitPrice, o.totalPrice, o.supplierStatus, o.managerStatus, o.orderedBy, o.supplierName, o.createdAt, o.estimatedDelivery]);

    for (const p of inventoryProducts) await connection.query('INSERT INTO inventory_products VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
      [p.id, p.rfidTag, p.name, p.sku, p.category, p.shelfLocation, p.currentStock, p.minThreshold, p.maxCapacity, p.lastScanned, p.rfidStatus, p.unitPrice, p.manufactureDate, p.expiryDate]);

    for (const a of alerts) await connection.query('INSERT INTO alerts VALUES (?,?,?,?,?,?)',
      [a.id, a.type, a.message, a.productName, a.timestamp, a.read]);

    for (const t of stockTrends) await connection.query('INSERT INTO stock_trends (date, inStock, lowStock, outOfStock) VALUES (?,?,?,?)',
      [t.date, t.inStock, t.lowStock, t.outOfStock]);

    for (const sp of supplierProducts) await connection.query('INSERT INTO supplier_products VALUES (?,?,?,?,?,?,?)',
      [sp.id, sp.name, sp.sku, sp.category, sp.unitPrice, sp.stockAvailable, sp.leadTimeDays]);

    for (const inv of invoices) await connection.query('INSERT INTO invoices VALUES (?,?,?,?,?,?,?,?,?)',
      [inv.id, inv.orderId, inv.productName, inv.quantity, inv.unitPrice, inv.totalAmount, inv.status, inv.createdAt, inv.dueDate]);

    for (const cp of customerProducts) await connection.query('INSERT INTO customer_products VALUES (?,?,?,?,?,?)',
      [cp.id, cp.name, cp.category, cp.price, cp.inStock, cp.image || null]);

    for (const co of customerOrders) await connection.query('INSERT INTO customer_orders VALUES (?,?,?,?,?,?)',
      [co.id, JSON.stringify(co.items), co.total, co.status, co.placedAt, co.estimatedDelivery]);

    console.log("Database initialized and fully seeded successfully.");
    process.exit(0);

  } catch (error) {
    console.error("Error setting up the database:", error.message);
    process.exit(1);
  }
}

setup();
