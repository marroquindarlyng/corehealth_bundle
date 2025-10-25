// corehealth-backend/models/recetasModel.js
const { query, transaction } = require("./common");

/**
 * Crea receta + detalle en una transacción
 * y marca la cita como 'Atendida'.
 * data = { cita_id, diagnostico_id, observaciones, medicamentos:[{medicamento_id, indicaciones, duracion_dias}] }
 */
async function createRecetaCompleta(data) {
  return await transaction(async (conn, queryConn) => {
    // Insert receta
    const recIns = await queryConn(
      conn,
      `INSERT INTO recetas (cita_id, diagnostico_id, observaciones, creado_en)
       VALUES (?, ?, ?, NOW())`,
      [data.cita_id, data.diagnostico_id, data.observaciones || null]
    );
    const receta_id = recIns.insertId;

    // Insert detalle
    const items = Array.isArray(data.medicamentos) ? data.medicamentos : [];
    for (const it of items) {
      await queryConn(
        conn,
        `INSERT INTO receta_detalle (receta_id, medicamento_id, indicaciones, duracion_dias)
         VALUES (?, ?, ?, ?)`,
        [receta_id, it.medicamento_id, it.indicaciones, it.duracion_dias || 1]
      );
    }

    // Marcar cita como atendida
    await queryConn(conn, `UPDATE citas SET estado='Atendida' WHERE id=?`, [
      data.cita_id,
    ]);

    return { id: receta_id };
  });
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
