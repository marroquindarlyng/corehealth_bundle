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

module.exports = {
  getById,
  updateById,
  getPasswordHash,
  changePassword,
  deactivate,
};
