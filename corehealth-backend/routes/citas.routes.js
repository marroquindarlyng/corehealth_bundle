// corehealth-backend/routes/citas.routes.js
const router = require("express").Router();
const { query } = require("../models/common");
const { auth, authorize } = require("../middleware/auth");

// ---- helpers -------------------------------------------------
function isDateYYYYMMDD(s) {
  return /^\d{4}-\d{2}-\d{2}$/.test(String(s || "").trim());
}
function toHHMMSS(s) {
  const x = String(s || "").trim();
  if (/^\d{2}:\d{2}$/.test(x)) return `${x}:00`;
  if (/^\d{2}:\d{2}:\d{2}$/.test(x)) return x;
  return null;
}
const ESTADOS = new Set(["Pendiente", "Confirmada", "Atendida", "Cancelada"]);

// ---- CREATE (paciente) --------------------------------------
/**
 * POST /api/citas
 * Body: { medico_id, especialidad_id, consulta_id, evento_id, fecha('YYYY-MM-DD'), hora('HH:MM'|'HH:MM:SS') }
 * Requiere rol: paciente
 */
router.post("/", auth(), authorize("paciente"), async (req, res) => {
  try {
    const paciente_id = Number(req.user?.id || 0);
    const medico_id = Number(req.body.medico_id || 0);
    const especialidad_id = Number(req.body.especialidad_id || 0);
    const consulta_id = Number(req.body.consulta_id || 1);
    const evento_id = Number(req.body.evento_id || 1);
    const fecha = String(req.body.fecha || "").trim();
    const hora = toHHMMSS(req.body.hora);

    if (
      !paciente_id ||
      !medico_id ||
      !especialidad_id ||
      !consulta_id ||
      !evento_id ||
      !fecha ||
      !hora
    ) {
      return res.status(400).json({ error: "Faltan campos de la cita" });
    }
    if (!isDateYYYYMMDD(fecha))
      return res.status(400).json({ error: "fecha inválida (YYYY-MM-DD)" });
    if (!hora)
      return res
        .status(400)
        .json({ error: "hora inválida (HH:MM o HH:MM:SS)" });

    // Médico existe y activo
    const m = await query(
      "SELECT id, especialidad_id, activo FROM medicos WHERE id=? LIMIT 1",
      [medico_id]
    );
    if (!m.length || !Number(m[0].activo)) {
      return res.status(404).json({ error: "Médico no encontrado o inactivo" });
    }
    if (Number(m[0].especialidad_id) !== especialidad_id) {
      return res
        .status(422)
        .json({ error: "La especialidad no corresponde al médico" });
    }

    // No doble reserva del mismo médico en ese slot
    const clash = await query(
      `SELECT id FROM citas
       WHERE medico_id=? AND fecha=? AND hora=? AND estado<>'Cancelada' LIMIT 1`,
      [medico_id, fecha, hora]
    );
    if (clash.length) {
      return res
        .status(409)
        .json({ error: "El médico ya tiene una cita en ese horario" });
    }

    const r = await query(
      `INSERT INTO citas
       (paciente_id, medico_id, especialidad_id, consulta_id, evento_id, fecha, hora, estado)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'Pendiente')`,
      [
        paciente_id,
        medico_id,
        especialidad_id,
        consulta_id,
        evento_id,
        fecha,
        hora,
      ]
    );

    return res.status(201).json({ id: r.insertId });
  } catch (err) {
    console.error("[POST /api/citas] Error:", err);
    if (err?.code === "ER_DUP_ENTRY") {
      return res
        .status(409)
        .json({ error: "Ya existe una cita para ese horario" });
    }
    return res.status(500).json({ error: "No se pudo crear la cita" });
  }
});

// ---- READ (lista del paciente autenticado) -------------------
/**
 * GET /api/citas/paciente/me
 * Requiere rol: paciente
 */
router.get("/paciente/me", auth(), authorize("paciente"), async (req, res) => {
  try {
    const paciente_id = Number(req.user?.id || 0);
    const rows = await query(
      `SELECT c.id,
              c.medico_id,
              m.nombre AS medico,
              c.especialidad_id,
              c.fecha,
              DATE_FORMAT(c.hora,'%H:%i:%s') AS hora,
              c.estado
         FROM citas c
         JOIN medicos m ON m.id = c.medico_id
        WHERE c.paciente_id = ?
        ORDER BY c.fecha DESC, c.hora DESC`,
      [paciente_id]
    );
    res.json(rows);
  } catch (err) {
    console.error("[GET /api/citas/paciente/me] Error:", err);
    res.status(500).json({ error: "No se pudieron cargar las citas" });
  }
});

// ---- UPDATE: reprogramar (paciente) --------------------------
/**
 * PUT /api/citas/:id/reprogramar
 * Body: { fecha('YYYY-MM-DD'), hora('HH:MM'|'HH:MM:SS') }
 * Requiere rol: paciente y ser dueño de la cita
 */
router.put(
  "/:id/reprogramar",
  auth(),
  authorize("paciente"),
  async (req, res) => {
    try {
      const id = Number(req.params.id || 0);
      const paciente_id = Number(req.user?.id || 0);
      const fecha = String(req.body.fecha || "").trim();
      const hora = toHHMMSS(req.body.hora);

      if (!id || !fecha || !hora) {
        return res
          .status(400)
          .json({ error: "id, fecha y hora son requeridos" });
      }
      if (!isDateYYYYMMDD(fecha))
        return res.status(400).json({ error: "fecha inválida (YYYY-MM-DD)" });
      if (!hora)
        return res
          .status(400)
          .json({ error: "hora inválida (HH:MM o HH:MM:SS)" });

      const cit = await query(
        "SELECT id, paciente_id, medico_id, estado FROM citas WHERE id=? LIMIT 1",
        [id]
      );
      if (!cit.length)
        return res.status(404).json({ error: "Cita no encontrada" });
      if (Number(cit[0].paciente_id) !== paciente_id)
        return res.status(403).json({ error: "No autorizado" });
      if (cit[0].estado === "Cancelada")
        return res.status(409).json({ error: "La cita está cancelada" });

      // evitar choque con otras citas del mismo médico
      const clash = await query(
        `SELECT id FROM citas
       WHERE medico_id=? AND fecha=? AND hora=? AND estado<>'Cancelada' AND id<>? LIMIT 1`,
        [cit[0].medico_id, fecha, hora, id]
      );
      if (clash.length) {
        return res
          .status(409)
          .json({ error: "Ese horario ya está ocupado por el médico" });
      }

      await query("UPDATE citas SET fecha=?, hora=? WHERE id=?", [
        fecha,
        hora,
        id,
      ]);
      const updated = await query(
        `SELECT id, medico_id, fecha, DATE_FORMAT(hora,'%H:%i:%s') AS hora, estado
         FROM citas WHERE id=?`,
        [id]
      );
      res.json(updated[0]);
    } catch (err) {
      console.error("[PUT /api/citas/:id/reprogramar] Error:", err);
      res.status(500).json({ error: "No se pudo reprogramar la cita" });
    }
  }
);

// ---- UPDATE: cambiar estado (médico) -------------------------
/**
 * PATCH /api/citas/:id/estado
 * Body: { estado: 'Pendiente'|'Confirmada'|'Atendida'|'Cancelada' }
 * Requiere rol: medico y que sea su cita
 */
router.patch("/:id/estado", auth(), authorize("medico"), async (req, res) => {
  try {
    const id = Number(req.params.id || 0);
    const medico_id = Number(req.user?.id || 0);
    const estado = String(req.body.estado || "").trim();

    if (!ESTADOS.has(estado))
      return res.status(400).json({ error: "Estado inválido" });

    const cit = await query(
      "SELECT id, medico_id, estado FROM citas WHERE id=? LIMIT 1",
      [id]
    );
    if (!cit.length)
      return res.status(404).json({ error: "Cita no encontrada" });
    if (Number(cit[0].medico_id) !== medico_id)
      return res.status(403).json({ error: "No autorizado" });

    await query("UPDATE citas SET estado=? WHERE id=?", [estado, id]);
    const updated = await query(
      "SELECT id, estado, fecha, DATE_FORMAT(hora,'%H:%i:%s') AS hora FROM citas WHERE id=?",
      [id]
    );
    res.json(updated[0]);
  } catch (err) {
    console.error("[PATCH /api/citas/:id/estado] Error:", err);
    res.status(500).json({ error: "No se pudo actualizar el estado" });
  }
});

// ---- CANCEL: paciente o médico --------------------------------
/**
 * PATCH /api/citas/:id/cancel
 * Requiere rol: paciente (dueño) o medico (asignado)
 */
router.patch(
  "/:id/cancel",
  auth(),
  authorize("paciente", "medico"),
  async (req, res) => {
    try {
      const id = Number(req.params.id || 0);
      const userId = Number(req.user?.id || 0);
      const rol = req.user?.rol;

      const cit = await query(
        "SELECT id, paciente_id, medico_id, estado FROM citas WHERE id=? LIMIT 1",
        [id]
      );
      if (!cit.length)
        return res.status(404).json({ error: "Cita no encontrada" });

      const own =
        (rol === "paciente" && Number(cit[0].paciente_id) === userId) ||
        (rol === "medico" && Number(cit[0].medico_id) === userId);
      if (!own) return res.status(403).json({ error: "No autorizado" });

      if (cit[0].estado === "Cancelada") {
        return res.status(409).json({ error: "La cita ya está cancelada" });
      }

      await query("UPDATE citas SET estado='Cancelada' WHERE id=?", [id]);
      res.json({ ok: true });
    } catch (err) {
      console.error("[PATCH /api/citas/:id/cancel] Error:", err);
      res.status(500).json({ error: "No se pudo cancelar la cita" });
    }
  }
);

module.exports = router;
