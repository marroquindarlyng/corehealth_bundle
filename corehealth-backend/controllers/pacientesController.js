const { query } = require("../models/common");

async function me(req, res) {
  try {
    const id = req.user.id;
    const rows = await query(
      `SELECT id, nombre, apellido, email, telefono, direccion, fecha_nacimiento
       FROM pacientes WHERE id = ? LIMIT 1`,
      [id]
    );
    if (!rows[0])
      return res.status(404).json({ error: "Paciente no encontrado" });
    res.json(rows[0]);
  } catch (e) {
    console.error("[pacientes/me]", e);
    res.status(500).json({ error: "No se pudo cargar el perfil" });
  }
}

async function updateMe(req, res) {
  try {
    const id = req.user.id;
    const { nombre, apellido, telefono, direccion, fecha_nacimiento } =
      req.body;
    await query(
      `UPDATE pacientes SET
         nombre = COALESCE(?, nombre),
         apellido = COALESCE(?, apellido),
         telefono = ?,
         direccion = ?,
         fecha_nacimiento = ?
       WHERE id = ?`,
      [
        nombre,
        apellido,
        telefono || null,
        direccion || null,
        fecha_nacimiento || null,
        id,
      ]
    );
    res.json({ ok: true });
  } catch (e) {
    console.error("[pacientes/updateMe]", e);
    res.status(500).json({ error: "No se pudo guardar el perfil" });
  }
}

async function misCitas(req, res) {
  try {
    const id = req.user.id;
    const rows = await query(
      `SELECT
         c.id,
         DATE_FORMAT(c.fecha, '%Y-%m-%d') AS fecha,
         DATE_FORMAT(c.hora,  '%H:%i')   AS hora,
         c.estado,
         m.nombre AS medico,
         CASE WHEN r.id IS NULL THEN 0 ELSE 1 END AS tiene_receta
       FROM citas c
       JOIN medicos m ON m.id = c.medico_id
       LEFT JOIN recetas r ON r.cita_id = c.id
       WHERE c.paciente_id = ?
       ORDER BY c.fecha DESC, c.hora DESC`,
      [id]
    );
    res.json(rows);
  } catch (e) {
    console.error("[pacientes/misCitas]", e);
    res.status(500).json({ error: "No se pudieron cargar las citas" });
  }
}

async function misRecetas(req, res) {
  try {
    const id = req.user.id;
    const rows = await query(
      `SELECT r.id, r.cita_id, r.diagnostico_id, r.observaciones, r.creado_en
       FROM recetas r
       JOIN citas c ON c.id = r.cita_id
       WHERE c.paciente_id = ?
       ORDER BY r.creado_en DESC`,
      [id]
    );
    res.json(rows);
  } catch (e) {
    console.error("[pacientes/misRecetas]", e);
    res.status(500).json({ error: "No se pudieron cargar las recetas" });
  }
}

module.exports = { me, updateMe, misCitas, misRecetas };
