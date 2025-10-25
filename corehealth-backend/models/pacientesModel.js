// corehealth-backend/models/pacientesModel.js
const { query } = require("./common");

// Campos editables del perfil (NO toca email/usuario/password aquí)
const EDITABLE_FIELDS = [
  "nombre",
  "apellido",
  "telefono",
  "direccion",
  "fecha_nacimiento",
  "dpi",
];

async function findAll() {
  // Ajusta WHERE si quieres solo activos: WHERE activo = 1
  return await query(
    `SELECT id, usuario, email, nombre, apellido, telefono, direccion,
            fecha_nacimiento, dpi, activo, creado_en
       FROM pacientes
      ORDER BY id DESC`
  );
}

async function getById(id) {
  const rows = await query(
    `SELECT id, usuario, email, nombre, apellido, telefono, direccion,
            fecha_nacimiento, dpi, activo, creado_en
       FROM pacientes
      WHERE id = ?
      LIMIT 1`,
    [id]
  );
  return rows[0] || null;
}

async function insert(data) {
  // Espera: usuario, email, nombre, apellido, telefono, direccion, fecha_nacimiento, dpi, password_hash
  const {
    usuario,
    email,
    nombre,
    apellido,
    telefono,
    direccion,
    fecha_nacimiento,
    dpi,
    password_hash,
  } = data;

  const result = await query(
    `INSERT INTO pacientes (usuario, email, nombre, apellido, telefono, direccion, fecha_nacimiento, dpi, password_hash, activo, creado_en)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, NOW())`,
    [
      usuario,
      email,
      nombre || null,
      apellido || null,
      telefono || null,
      direccion || null,
      fecha_nacimiento || null,
      dpi || null,
      password_hash || null,
    ]
  );

  return result; // result.insertId disponible para el llamador
}

async function updateById(id, data) {
  const set = [];
  const params = [];
  for (const col of EDITABLE_FIELDS) {
    if (data[col] !== undefined) {
      set.push(`${col} = ?`);
      params.push(data[col] === "" ? null : data[col]);
    }
  }
  if (!set.length) return { affectedRows: 0 };
  params.push(id);
  return await query(
    `UPDATE pacientes SET ${set.join(", ")} WHERE id = ?`,
    params
  );
}

async function getPasswordHash(id) {
  const rows = await query(
    `SELECT password_hash FROM pacientes WHERE id = ? LIMIT 1`,
    [id]
  );
  return rows[0]?.password_hash || null;
}

async function changePassword(id, newHash) {
  return await query(`UPDATE pacientes SET password_hash = ? WHERE id = ?`, [
    newHash,
    id,
  ]);
}

async function deactivate(id) {
  return await query(`UPDATE pacientes SET activo = 0 WHERE id = ?`, [id]);
}

async function deleteById(id) {
  // Si prefieres soft delete usa deactivate en su lugar
  return await query(`DELETE FROM pacientes WHERE id = ?`, [id]);
}

module.exports = {
  findAll,
  getById,
  insert,
  updateById,
  getPasswordHash,
  changePassword,
  deactivate,
  deleteById,
};
