// corehealth-backend/config/db.js
/**
 * MySQL connection pool using mysql2/promise
 */
const mysql = require("mysql2/promise");

const config = {
  host: process.env.DB_HOST || "127.0.0.1", // usar 127.0.0.1 evita algunas rarezas en Windows
  user: process.env.DB_USER || "root",
  // Acepta DB_PASS o DB_PASSWORD
  password: process.env.DB_PASS || process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "corehealth",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

let pool;
async function getPool() {
  if (!pool) {
    pool = mysql.createPool(config);
    // prueba rápida de conexión (una vez)
    try {
      const conn = await pool.getConnection();
      await conn.ping();
      conn.release();
      console.log("[DB] Pool listo ✅");
    } catch (e) {
      console.error("[DB] Error conectando a MySQL:", e.message);
      throw e;
    }
  }
  return pool;
}

module.exports = { getPool };
