// corehealth-backend/models/recetasModel.js
const { query, getPool } = require("./common");

/**
 * Crea receta + detalle en una transacción
 * y marca la cita como 'Atendida'.
 * data = { cita_id, diagnostico_id, observaciones, medicamentos:[{medicamento_id, indicaciones, duracion_dias}] }
 */
async function createRecetaCompleta(data) {
  const pool = getPool();
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // Insert receta (usa 'creado_en' del esquema)
    const [recIns] = await conn.query(
      `INSERT INTO recetas (cita_id, diagnostico_id, observaciones, creado_en)
       VALUES (?, ?, ?, NOW())`,
      [data.cita_id, data.diagnostico_id, data.observaciones || null]
    );
    const receta_id = recIns.insertId;

    // Insert detalle
    const items = data.medicamentos || [];
    for (const it of items) {
      await conn.query(
        `INSERT INTO receta_detalle (receta_id, medicamento_id, indicaciones, duracion_dias)
         VALUES (?, ?, ?, ?)`,
        [receta_id, it.medicamento_id, it.indicaciones, it.duracion_dias || 1]
      );
    }

    // Marcar cita como atendida
    await conn.query(`UPDATE citas SET estado='Atendida' WHERE id=?`, [
      data.cita_id,
    ]);

    await conn.commit();
    return { id: receta_id };
  } catch (e) {
    await conn.rollback();
    throw e;
  } finally {
    conn.release();
  }
}

async function getByCitaId(citaId) {
  const rows = await query(
    `SELECT r.id, r.cita_id, r.diagnostico_id, r.observaciones, r.creado_en
     FROM recetas r
     WHERE r.cita_id = ?
     LIMIT 1`,
    [citaId]
  );
  if (!rows.length) return null;

  const receta = rows[0];
  const det = await query(
    `SELECT id, medicamento_id, indicaciones, duracion_dias
       FROM receta_detalle
      WHERE receta_id = ?
      ORDER BY id`,
    [receta.id]
  );
  return { ...receta, detalle: det };
}

module.exports = { createRecetaCompleta, getByCitaId };
