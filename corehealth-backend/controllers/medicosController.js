// Core Health - Médicos Controller
const { query } = require("../models/common");

/**
 * GET /api/medicos/me/citas
 * Requiere JWT (req.user.id y req.user.rol === 'medico')
 */
async function misCitas(req, res) {
  try {
    const medicoId = Number(req.user?.id);
    if (!medicoId) return res.status(401).json({ error: "No autenticado" });
    if (req.user?.rol !== "medico")
      return res.status(403).json({ error: "No autorizado" });

    const rows = await query(
      `SELECT c.id, c.fecha, c.hora, c.paciente_id, p.nombre AS paciente
         FROM citas c
         JOIN pacientes p ON p.id = c.paciente_id
        WHERE c.medico_id = ?
        ORDER BY c.fecha DESC, c.hora DESC`,
      [medicoId]
    );

    return res.json(rows);
  } catch (err) {
    console.error("[GET /medicos/me/citas] Error:", err);
    return res.status(500).json({ error: "No se pudieron cargar las citas" });
  }
}

module.exports = { misCitas };
