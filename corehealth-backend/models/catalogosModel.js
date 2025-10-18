const { query } = require('./common');

async function getEspecialidades() {
  return await query('SELECT id, nombre FROM especialidades ORDER BY nombre');
}

async function getMedicos() {
  const sql = `SELECT m.id, m.nombre, m.apellido, m.email, m.usuario, m.especialidad_id, e.nombre AS especialidad
               FROM medicos m
               LEFT JOIN especialidades e ON e.id = m.especialidad_id
               ORDER BY m.nombre, m.apellido`;
  return await query(sql);
}

async function getMedicamentos() {
  return await query('SELECT id, nombre FROM medicamentos ORDER BY nombre');
}

async function getDiagnosticos() {
  return await query('SELECT id, nombre FROM diagnosticos ORDER BY nombre');
}

async function getConsultas() {
  return await query('SELECT id, nombre FROM consultas ORDER BY nombre');
}

async function getEventos() {
  return await query('SELECT id, nombre FROM eventos ORDER BY nombre');
}

module.exports = { getEspecialidades, getMedicos, getMedicamentos, getDiagnosticos, getConsultas, getEventos };