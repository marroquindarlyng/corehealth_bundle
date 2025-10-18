/**
 * Common database helpers
 */
const { getPool } = require("../config/db");

async function query(sql, params = []) {
  const pool = await getPool();
  const [rows] = await pool.execute(sql, params);
  return rows;
}

async function getConnection() {
  const pool = await getPool();
  return pool.getConnection();
}

// Ejecuta una consulta usando una conexión existente (útil en transaction)
async function queryConn(conn, sql, params = []) {
  const [rows] = await conn.execute(sql, params);
  return rows;
}

async function transaction(work) {
  const conn = await getConnection();
  try {
    await conn.beginTransaction();
    const result = await work(conn, queryConn);
    await conn.commit();
    return result;
  } catch (err) {
    await conn.rollback();
    // Re-lanzamos el error original para preservar err.code (ER_DUP_ENTRY, etc.)
    throw err;
  } finally {
    conn.release();
  }
}

module.exports = { query, getConnection, queryConn, transaction };
