// corehealth-backend/models/authModel.js
"use strict";

const { query } = require("./common");

/**
 * Busca un usuario por email o usuario en una tabla whitelisteada
 * @param {'admins'|'medicos'|'pacientes'} table
 * @param {string} emailOrUsuario
 * @returns {Promise<object|null>}
 */
async function findUserByEmailOrUsuario(table, emailOrUsuario) {
  const allowed = new Set(["admins", "medicos", "pacientes"]);
  if (!allowed.has(table)) {
    throw new Error(`Tabla no permitida: ${table}`);
  }
  const t = table; // nombre seguro por whitelist
  const q = String(emailOrUsuario || "").trim();

  // Seleccionamos campos comunes. Si tu tabla tiene otros campos, no pasa nada.
  const rows = await query(
    `SELECT id, email, usuario, password_hash, activo
       FROM ${t}
      WHERE email = ? OR usuario = ?
      LIMIT 1`,
    [q, q]
  );
  return rows[0] || null;
}

/**
 * Crea un PACIENTE
 * dto: {
 *  nombre, apellido, email, usuario, password_hash,
 *  telefono?, direccion?, fecha_nacimiento?, dpi?
 * }
 * @returns {Promise<{id:number}>}
 */
async function createPaciente(dto) {
  const sql = `
    INSERT INTO pacientes
      (nombre, apellido, email, usuario, password_hash, telefono, direccion, fecha_nacimiento, dpi, activo)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
  `;
  const params = [
    dto.nombre,
    dto.apellido,
    dto.email,
    dto.usuario,
    dto.password_hash,
    dto.telefono ?? null,
    dto.direccion ?? null,
    dto.fecha_nacimiento ?? null,
    dto.dpi ?? null,
  ];
  const r = await query(sql, params);
  return { id: r.insertId };
}

/**
 * Crea un MÉDICO
 * dto: {
 *  nombre, email, usuario, password_hash,
 *  colegiado, especialidad_id, telefono?
 * }
 * @returns {Promise<{id:number}>}
 */
async function createMedico(dto) {
  const sql = `
    INSERT INTO medicos
      (nombre, email, usuario, password_hash, colegiado, especialidad_id, telefono, activo)
    VALUES (?, ?, ?, ?, ?, ?, ?, 1)
  `;
  const params = [
    dto.nombre,
    dto.email,
    dto.usuario,
    dto.password_hash,
    dto.colegiado,
    dto.especialidad_id,
    dto.telefono ?? null,
  ];
  const r = await query(sql, params);
  return { id: r.insertId };
}

/**
 * (Opcional) Crea un ADMIN — útil para siembras programáticas
 * dto: { nombre, email, usuario, password_hash }
 */
async function createAdmin(dto) {
  const sql = `
    INSERT INTO admins
      (nombre, email, usuario, password_hash, activo)
    VALUES (?, ?, ?, ?, 1)
  `;
  const params = [dto.nombre, dto.email, dto.usuario, dto.password_hash];
  const r = await query(sql, params);
  return { id: r.insertId };
}

module.exports = {
  findUserByEmailOrUsuario,
  createPaciente,
  createMedico,
  createAdmin, // opcional
};
