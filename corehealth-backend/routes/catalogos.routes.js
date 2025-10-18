// corehealth-backend/routes/catalogos.routes.js
const router = require("express").Router();
const { query } = require("../models/common");
// OJO: tu carpeta es "middleware"
const { auth, authorize } = require("../middleware/auth");

/* Utilidades */
async function safeDeleteCheck(sql, params = []) {
  const rows = await query(sql, params);
  const count = Number(rows?.[0]?.c || 0);
  return count === 0;
}

/* ========= ESPECIALIDADES ========= */
/**
 * GET /api/especialidades  (pública)
 */
router.get("/especialidades", async (_req, res) => {
  try {
    const rows = await query(
      "SELECT id, nombre FROM especialidades ORDER BY id"
    );
    res.json(rows);
  } catch (err) {
    console.error("[GET /especialidades] Error:", err);
    res.status(500).json({ error: "No se pudieron cargar las especialidades" });
  }
});

/**
 * GET /api/especialidades/:id  (pública)
 */
router.get("/especialidades/:id", async (req, res) => {
  try {
    const id = Number(req.params.id || 0);
    const rows = await query(
      "SELECT id, nombre FROM especialidades WHERE id=? LIMIT 1",
      [id]
    );
    if (!rows.length) return res.status(404).json({ error: "No encontrado" });
    res.json(rows[0]);
  } catch (err) {
    console.error("[GET /especialidades/:id] Error:", err);
    res.status(500).json({ error: "Error" });
  }
});

/**
 * POST /api/especialidades  (solo 'direccion')
 * body: { nombre }
 */
router.post(
  "/especialidades",
  auth(),
  authorize("direccion"),
  async (req, res) => {
    try {
      const nombre = String(req.body.nombre || "").trim();
      if (!nombre) return res.status(400).json({ error: "nombre requerido" });

      const r = await query("INSERT INTO especialidades (nombre) VALUES (?)", [
        nombre,
      ]);
      res.status(201).json({ id: r.insertId, nombre });
    } catch (err) {
      console.error("[POST /especialidades] Error:", err);
      if (err?.code === "ER_DUP_ENTRY") {
        return res.status(409).json({ error: "Nombre ya existe" });
      }
      res.status(500).json({ error: "No se pudo crear" });
    }
  }
);

/**
 * PUT /api/especialidades/:id  (solo 'direccion')
 * body: { nombre }
 */
router.put(
  "/especialidades/:id",
  auth(),
  authorize("direccion"),
  async (req, res) => {
    try {
      const id = Number(req.params.id || 0);
      const nombre = String(req.body.nombre || "").trim();
      if (!id || !nombre)
        return res.status(400).json({ error: "id y nombre requeridos" });

      await query("UPDATE especialidades SET nombre=? WHERE id=?", [
        nombre,
        id,
      ]);
      const rows = await query(
        "SELECT id, nombre FROM especialidades WHERE id=?",
        [id]
      );
      if (!rows.length) return res.status(404).json({ error: "No encontrado" });
      res.json(rows[0]);
    } catch (err) {
      console.error("[PUT /especialidades/:id] Error:", err);
      if (err?.code === "ER_DUP_ENTRY") {
        return res.status(409).json({ error: "Nombre ya existe" });
      }
      res.status(500).json({ error: "No se pudo actualizar" });
    }
  }
);

/**
 * DELETE /api/especialidades/:id  (solo 'direccion')
 * Protegido por uso en medicos y citas
 */
router.delete(
  "/especialidades/:id",
  auth(),
  authorize("direccion"),
  async (req, res) => {
    try {
      const id = Number(req.params.id || 0);
      if (!id) return res.status(400).json({ error: "id requerido" });

      // ¿está referenciada?
      const libre =
        (await safeDeleteCheck(
          "SELECT COUNT(*) c FROM medicos WHERE especialidad_id=?",
          [id]
        )) &&
        (await safeDeleteCheck(
          "SELECT COUNT(*) c FROM citas WHERE especialidad_id=?",
          [id]
        ));

      if (!libre) {
        return res
          .status(409)
          .json({ error: "No se puede eliminar: especialidad en uso" });
      }

      await query("DELETE FROM especialidades WHERE id=?", [id]);
      res.json({ ok: true });
    } catch (err) {
      console.error("[DELETE /especialidades/:id] Error:", err);
      res.status(500).json({ error: "No se pudo eliminar" });
    }
  }
);

/* ========= DIAGNOSTICOS ========= */

/**
 * GET /api/diagnosticos (pública)
 */
router.get("/diagnosticos", async (_req, res) => {
  try {
    const rows = await query("SELECT id, nombre FROM diagnosticos ORDER BY id");
    res.json(rows);
  } catch (err) {
    console.error("[GET /diagnosticos] Error:", err);
    res.status(500).json({ error: "No se pudieron cargar los diagnósticos" });
  }
});

/**
 * POST /api/diagnosticos (direccion)
 */
router.post(
  "/diagnosticos",
  auth(),
  authorize("direccion"),
  async (req, res) => {
    try {
      const nombre = String(req.body.nombre || "").trim();
      if (!nombre) return res.status(400).json({ error: "nombre requerido" });
      const r = await query("INSERT INTO diagnosticos (nombre) VALUES (?)", [
        nombre,
      ]);
      res.status(201).json({ id: r.insertId, nombre });
    } catch (err) {
      console.error("[POST /diagnosticos] Error:", err);
      if (err?.code === "ER_DUP_ENTRY")
        return res.status(409).json({ error: "Nombre ya existe" });
      res.status(500).json({ error: "No se pudo crear" });
    }
  }
);

/**
 * PUT /api/diagnosticos/:id (direccion)
 */
router.put(
  "/diagnosticos/:id",
  auth(),
  authorize("direccion"),
  async (req, res) => {
    try {
      const id = Number(req.params.id || 0);
      const nombre = String(req.body.nombre || "").trim();
      if (!id || !nombre)
        return res.status(400).json({ error: "id y nombre requeridos" });
      await query("UPDATE diagnosticos SET nombre=? WHERE id=?", [nombre, id]);
      const rows = await query(
        "SELECT id, nombre FROM diagnosticos WHERE id=?",
        [id]
      );
      if (!rows.length) return res.status(404).json({ error: "No encontrado" });
      res.json(rows[0]);
    } catch (err) {
      console.error("[PUT /diagnosticos/:id] Error:", err);
      if (err?.code === "ER_DUP_ENTRY")
        return res.status(409).json({ error: "Nombre ya existe" });
      res.status(500).json({ error: "No se pudo actualizar" });
    }
  }
);

/**
 * DELETE /api/diagnosticos/:id (direccion)
 * Protegido por uso en recetas
 */
router.delete(
  "/diagnosticos/:id",
  auth(),
  authorize("direccion"),
  async (req, res) => {
    try {
      const id = Number(req.params.id || 0);
      if (!id) return res.status(400).json({ error: "id requerido" });

      const libre = await safeDeleteCheck(
        "SELECT COUNT(*) c FROM recetas WHERE diagnostico_id=?",
        [id]
      );
      if (!libre)
        return res
          .status(409)
          .json({ error: "No se puede eliminar: diagnóstico en uso" });

      await query("DELETE FROM diagnosticos WHERE id=?", [id]);
      res.json({ ok: true });
    } catch (err) {
      console.error("[DELETE /diagnosticos/:id] Error:", err);
      res.status(500).json({ error: "No se pudo eliminar" });
    }
  }
);

/* ========= MEDICAMENTOS ========= */

/**
 * GET /api/medicamentos (pública)
 */
router.get("/medicamentos", async (_req, res) => {
  try {
    const rows = await query("SELECT id, nombre FROM medicamentos ORDER BY id");
    res.json(rows);
  } catch (err) {
    console.error("[GET /medicamentos] Error:", err);
    res.status(500).json({ error: "No se pudieron cargar los medicamentos" });
  }
});

/**
 * POST /api/medicamentos (direccion)
 */
router.post(
  "/medicamentos",
  auth(),
  authorize("direccion"),
  async (req, res) => {
    try {
      const nombre = String(req.body.nombre || "").trim();
      if (!nombre) return res.status(400).json({ error: "nombre requerido" });
      const r = await query("INSERT INTO medicamentos (nombre) VALUES (?)", [
        nombre,
      ]);
      res.status(201).json({ id: r.insertId, nombre });
    } catch (err) {
      console.error("[POST /medicamentos] Error:", err);
      if (err?.code === "ER_DUP_ENTRY")
        return res.status(409).json({ error: "Nombre ya existe" });
      res.status(500).json({ error: "No se pudo crear" });
    }
  }
);

/**
 * PUT /api/medicamentos/:id (direccion)
 */
router.put(
  "/medicamentos/:id",
  auth(),
  authorize("direccion"),
  async (req, res) => {
    try {
      const id = Number(req.params.id || 0);
      const nombre = String(req.body.nombre || "").trim();
      if (!id || !nombre)
        return res.status(400).json({ error: "id y nombre requeridos" });
      await query("UPDATE medicamentos SET nombre=? WHERE id=?", [nombre, id]);
      const rows = await query(
        "SELECT id, nombre FROM medicamentos WHERE id=?",
        [id]
      );
      if (!rows.length) return res.status(404).json({ error: "No encontrado" });
      res.json(rows[0]);
    } catch (err) {
      console.error("[PUT /medicamentos/:id] Error:", err);
      if (err?.code === "ER_DUP_ENTRY")
        return res.status(409).json({ error: "Nombre ya existe" });
      res.status(500).json({ error: "No se pudo actualizar" });
    }
  }
);

/**
 * DELETE /api/medicamentos/:id (direccion)
 * Protegido por uso en receta_detalle
 */
router.delete(
  "/medicamentos/:id",
  auth(),
  authorize("direccion"),
  async (req, res) => {
    try {
      const id = Number(req.params.id || 0);
      if (!id) return res.status(400).json({ error: "id requerido" });

      const libre = await safeDeleteCheck(
        "SELECT COUNT(*) c FROM receta_detalle WHERE medicamento_id=?",
        [id]
      );
      if (!libre)
        return res
          .status(409)
          .json({ error: "No se puede eliminar: medicamento en uso" });

      await query("DELETE FROM medicamentos WHERE id=?", [id]);
      res.json({ ok: true });
    } catch (err) {
      console.error("[DELETE /medicamentos/:id] Error:", err);
      res.status(500).json({ error: "No se pudo eliminar" });
    }
  }
);

module.exports = router;
