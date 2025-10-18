const { query } = require("./common");

async function findCitasByMedico(medicoId) {
  const sql = `
    SELECT
      c.id,
      DATE_FORMAT(c.fecha, '%Y-%m-%d') AS fecha,
      TIME_FORMAT(c.hora,  '%H:%i')    AS hora,
      p.id AS paciente_id,
      CONCAT(p.nombre, ' ', COALESCE(p.apellido, '')) AS paciente
    FROM citas c
    JOIN pacientes p ON p.id = c.paciente_id
    WHERE c.medico_id = ?
    ORDER BY c.fecha, c.hora, c.id
  `;
  return query(sql, [medicoId]);
}

module.exports = { findCitasByMedico };
