const { query } = require('./common');

async function consultasPorMedico() {
  const sql = `SELECT medico_id, COUNT(*) AS total FROM citas GROUP BY medico_id`;
  return await query(sql);
}

async function diagnosticosFrecuentes() {
  const sql = `SELECT diagnostico_id, COUNT(*) AS total FROM recetas GROUP BY diagnostico_id`;
  return await query(sql);
}

async function ausentismo() {
  const sql = `
    SELECT
      SUM(CASE WHEN estado IN ('Cancelada','No Asistida') THEN 1 ELSE 0 END) AS ausencias,
      COUNT(*) AS total,
      (SUM(CASE WHEN estado IN ('Cancelada','No Asistida') THEN 1 ELSE 0 END) / COUNT(*)) AS ratio
    FROM citas`;
  const rows = await query(sql);
  return rows[0];
}

module.exports = { consultasPorMedico, diagnosticosFrecuentes, ausentismo };