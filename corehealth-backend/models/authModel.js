// corehealth-backend/models/authModel.js
const { query } = require("./common");

/**
 * Busca un usuario por email o usuario en la tabla indicada (pacientes | medicos)
 */
async function findUserByEmailOrUsuario(roleTable, emailOrUsuario) {
  const sql = `SELECT id, email, usuario, password_hash
               FROM ${roleTable}
               WHERE email = ? OR usuario = ?
               LIMIT 1`;
  const rows = await query(sql, [emailOrUsuario, emailOrUsuario]);
  return rows[0];
}

/**
 * Crea paciente (según tu esquema actual de 'pacientes')
 * Columnas: id, usuario, email, password_hash, nombre, apellido, telefono, direccion, fecha_nacimiento, dpi, activo, creado_en
 */
async function createPaciente(data) {
  const sql = `INSERT INTO pacientes
    (usuario, email, password_hash, nombre, apellido, telefono, direccion, fecha_nacimiento, dpi)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  const params = [
    data.usuario,
    data.email,
    data.password_hash,
    data.nombre,
    data.apellido,
    data.telefono || null,
    data.direccion || null,
    data.fecha_nacimiento || null, // 'YYYY-MM-DD' o null
    data.dpi || null,
  ];

  const result = await query(sql, params);
  return { id: result.insertId, ...data };
}

/**
 * Crea médico (según tu esquema actual de 'medicos')
 * Columnas: id, usuario, email, password_hash, nombre, colegiado, telefono, especialidad_id, activo, creado_en
 * Nota: 'colegiado' es único por el índice uq_medicos_colegiado
 */
async function createMedico(data) {
  const sql = `INSERT INTO medicos
    (usuario, email, password_hash, nombre, colegiado, telefono, especialidad_id)
    VALUES (?, ?, ?, ?, ?, ?, ?)`;

  const params = [
    data.usuario,
    data.email,
    data.password_hash,
    data.nombre,
    data.colegiado, // requerido (único)
    data.telefono || null,
    data.especialidad_id, // requerido (FK a especialidades)
  ];

  const result = await query(sql, params);
  return { id: result.insertId, ...data };
}

module.exports = {
  findUserByEmailOrUsuario,
  createPaciente,
  createMedico,
};
