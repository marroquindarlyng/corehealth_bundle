// corehealth-backend/controllers/citasController.js
const { query } = require("../models/common");

// Normaliza HH:MM a HH:MM:SS (y valida formato)
function normalizeHora(h) {
  if (typeof h !== "string") return null;
  const m = h.match(/^(\d{2}):(\d{2})(?::(\d{2}))?$/);
  if (!m) return null;
  const hh = m[1],
    mm = m[2],
    ss = m[3] ?? "00";
  return `${hh}:${mm}:${ss}`;
}

/**
 * POST /api/citas
 * Body (snakeCase o camelCase):
 * {
 *   medico_id | medicoId,
 *   especialidad_id | especialidadId,
 *   consulta_id | consultaId,
 *   evento_id | eventoId,
 *   fecha: 'YYYY-MM-DD',
 *   hora: 'HH:MM' o 'HH:MM:SS'
 * }
 */
async function crear(req, res) {
  try {
    // Debe venir autenticado y ser paciente
    const user = req.user;
    if (!user || user.rol !== "paciente") {
      return res
        .status(403)
        .json({ error: "Solo pacientes pueden crear citas" });
    }
    const paciente_id = user.id;

    // Aceptar snake/camel
    const medico_id = Number(req.body.medico_id ?? req.body.medicoId);
    const especialidad_id = Number(
      req.body.especialidad_id ?? req.body.especialidadId
    );
    const consulta_id = Number(req.body.consulta_id ?? req.body.consultaId);
    const evento_id = Number(req.body.evento_id ?? req.body.eventoId);
    const fecha = (req.body.fecha ?? "").toString().trim();
    const horaNorm = normalizeHora(req.body.hora ?? "");

    // Validaciones mínimas
    if (
      !medico_id ||
      !especialidad_id ||
      !consulta_id ||
      !evento_id ||
      !fecha ||
      !horaNorm
    ) {
      return res.status(400).json({ error: "Faltan campos de la cita" });
    }

    // Insert
    const sql = `
      INSERT INTO citas
        (paciente_id, medico_id, especialidad_id, consulta_id, evento_id, fecha, hora, estado)
      VALUES
        (?, ?, ?, ?, ?, ?, ?, 'Pendiente')
    `;
    const params = [
      paciente_id,
      medico_id,
      especialidad_id,
      consulta_id,
      evento_id,
      fecha,
      horaNorm,
    ];
    const result = await query(sql, params);

    return res.status(201).json({ id: result.insertId });
  } catch (err) {
    console.error("[POST /api/citas] Error:", err);
    // Algunos mapeos útiles
    if (
      err?.code === "ER_NO_REFERENCED_ROW" ||
      err?.code === "ER_NO_REFERENCED_ROW_2"
    ) {
      return res
        .status(422)
        .json({
          error: "FK inválida (medico/especialidad/consulta/evento no existen)",
        });
    }
    return res.status(500).json({ error: "No se pudo crear la cita" });
  }
}

/**
 * GET /api/citas/paciente/me
 * Lista citas del paciente autenticado
 */
async function citasPacienteMe(req, res) {
  try {
    const user = req.user;
    if (!user || user.rol !== "paciente") {
      return res.status(403).json({ error: "Solo pacientes" });
    }
    const paciente_id = user.id;

    const rows = await query(
      `
      SELECT c.id, c.fecha, c.hora,
             c.medico_id,
             m.nombre AS medico,
             c.especialidad_id
      FROM citas c
      JOIN medicos m ON m.id = c.medico_id
      WHERE c.paciente_id = ?
      ORDER BY c.fecha DESC, c.hora DESC
    `,
      [paciente_id]
    );

    return res.json(rows);
  } catch (err) {
    console.error("[GET /api/citas/paciente/me] Error:", err);
    return res.status(500).json({ error: "No se pudieron cargar tus citas" });
  }
}

module.exports = { crear, citasPacienteMe };
