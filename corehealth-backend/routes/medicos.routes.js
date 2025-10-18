const router = require("express").Router();
const { auth, authorize } = require("../middleware/auth"); // tu carpeta es "middleware"
const { query } = require("../models/common");

// Agenda del médico autenticado
router.get(
  "/medicos/me/citas",
  auth(),
  authorize("medico"),
  async (req, res) => {
    try {
      const medicoId = req.user.id;

      const rows = await query(
        `
      SELECT
        c.id,
        DATE_FORMAT(c.fecha, '%Y-%m-%d') AS fecha,
        DATE_FORMAT(c.hora,  '%H:%i')    AS hora,
        c.paciente_id,
        CONCAT(p.nombre, IFNULL(CONCAT(' ', p.apellido), '')) AS paciente,
        /* aquí está la clave */
        EXISTS(SELECT 1 FROM recetas r WHERE r.cita_id = c.id) AS tiene_receta
      FROM citas c
      JOIN pacientes p ON p.id = c.paciente_id
      WHERE c.medico_id = ?
      ORDER BY c.fecha DESC, c.hora DESC
      `,
        [medicoId]
      );

      // Normaliza a 0/1 explícito
      rows.forEach((r) => (r.tiene_receta = Number(r.tiene_receta) ? 1 : 0));

      res.json(rows || []);
    } catch (err) {
      console.error("[GET /medicos/me/citas] Error:", err);
      res.status(500).json({ error: "No se pudieron cargar las citas" });
    }
  }
);

module.exports = router;
