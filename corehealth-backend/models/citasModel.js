const { query } = require('./common');

async function createCita(data) {
  const sql = `INSERT INTO citas (paciente_id, medico_id, especialidad_id, consulta_id, evento_id, fecha, hora, estado)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  const params = [data.paciente_id, data.medico_id, data.especialidad_id, data.consulta_id, data.evento_id, data.fecha, data.hora, data.estado || 'Programada'];
  const result = await query(sql, params);
  return { id: result.insertId, ...data };
}

async function getHistorialPaciente(pacienteId) {
  const sql = `SELECT c.*, m.nombre AS medico_nombre, e.nombre AS especialidad_nombre
               FROM citas c
               LEFT JOIN medicos m ON m.id = c.medico_id
               LEFT JOIN especialidades e ON e.id = c.especialidad_id
               WHERE c.paciente_id = ?
               ORDER BY c.fecha DESC, c.hora DESC`;
  return await query(sql, [pacienteId]);
}

async function getAgendaMedico(medicoId) {
  const sql = `SELECT c.*, p.nombre AS paciente_nombre, p.apellido AS paciente_apellido
               FROM citas c
               LEFT JOIN pacientes p ON p.id = c.paciente_id
               WHERE c.medico_id = ?
               ORDER BY c.fecha ASC, c.hora ASC`;
  return await query(sql, [medicoId]);
}

async function updateEstado(citaId, estado) {
  const sql = `UPDATE citas SET estado = ? WHERE id = ?`;
  await query(sql, [estado, citaId]);
  return { id: citaId, estado };
}

module.exports = { createCita, getHistorialPaciente, getAgendaMedico, updateEstado };