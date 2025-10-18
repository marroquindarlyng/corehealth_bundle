// Core Health - Recetas Controller
const Recetas = require("../models/recetasModel");

/**
 * Normaliza el array de items de receta para ajustarse al esquema actual:
 * receta_detalle(medicamento_id, indicaciones, duracion_dias)
 * - Acepta alias "items" o "medicamentos" como entrada
 * - Si falta duracion_dias => 1
 * - Si falta indicaciones pero hay "dosis" => usa "dosis" como indicaciones
 */
function normalizeMedicamentos(payload) {
  const raw = Array.isArray(payload.items)
    ? payload.items
    : Array.isArray(payload.medicamentos)
    ? payload.medicamentos
    : [];

  return raw.map((it, idx) => {
    const medicamento_id = Number(it.medicamento_id || it.medicamento || it.id);
    if (!medicamento_id) {
      throw new Error(`Item #${idx + 1}: 'medicamento_id' es requerido`);
    }

    const indicaciones = (it.indicaciones ?? it.dosis ?? "").toString().trim();
    if (!indicaciones) {
      throw new Error(
        `Item #${idx + 1}: 'indicaciones' es requerido (o provee 'dosis')`
      );
    }

    let duracion_dias = Number(it.duracion_dias ?? it.dias ?? it.duracion ?? 1);
    if (!Number.isFinite(duracion_dias) || duracion_dias <= 0)
      duracion_dias = 1;

    return { medicamento_id, indicaciones, duracion_dias };
  });
}

/**
 * POST /api/recetas
 * Body:
 * {
 *   cita_id: number (req),
 *   diagnostico_id: number (req),
 *   observaciones?: string,
 *   medicamentos?: [{ medicamento_id, indicaciones|dosis, duracion_dias? }],
 *   // alias: items: [...]
 * }
 */
async function crear(req, res) {
  try {
    const cita_id = Number(req.body.cita_id);
    const diagnostico_id = Number(req.body.diagnostico_id);
    const observaciones = req.body.observaciones ?? null;

    if (!cita_id || !diagnostico_id) {
      return res
        .status(400)
        .json({ error: "cita_id y diagnostico_id son requeridos" });
    }

    let medicamentos = [];
    try {
      medicamentos = normalizeMedicamentos(req.body);
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }

    const result = await Recetas.createRecetaCompleta({
      cita_id,
      diagnostico_id,
      observaciones,
      medicamentos,
    });

    const id = result?.id ?? result?.receta_id ?? result?.insertId ?? null;
    return res.status(201).json(id ? { id, ...result } : result);
  } catch (err) {
    if (
      err?.code === "ER_NO_REFERENCED_ROW_2" ||
      err?.code === "ER_NO_REFERENCED_ROW"
    ) {
      return res.status(422).json({
        error: "FK inválida (cita_id/diagnostico_id/medicamento_id no existen)",
      });
    }
    if (err?.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ error: "Registro duplicado" });
    }
    console.error("[POST /recetas] Error:", err);
    return res.status(500).json({ error: "No se pudo crear la receta" });
  }
}

/**
 * GET /api/recetas/cita/:id
 */
async function porCita(req, res) {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: "id inválido" });

    const data = await Recetas.getByCitaId(id);
    if (!data)
      return res.status(404).json({ error: "No hay receta para la cita" });

    return res.json(data);
  } catch (err) {
    console.error("[GET /recetas/cita/:id] Error:", err);
    return res.status(500).json({ error: "No se pudo obtener receta" });
  }
}

module.exports = { crear, porCita };
