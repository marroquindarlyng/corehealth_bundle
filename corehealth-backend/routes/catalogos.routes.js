const router = require("express").Router();
const { query } = require("../models/common");
const { auth, authorize } = require("../middleware/auth");

// Helpers
function nombreValido(s) {
  return typeof s === "string" && s.trim().length > 0 && s.trim().length <= 150;
}

// ===================== ESPECIALIDADES =====================

// Listar (público)
router.get("/especialidades", async (req, res) => {
  try {
    const rows = await query(
      "SELECT id, nombre FROM especialidades ORDER BY id"
    );
    res.json(rows);
  } catch (err) {
    console.error("[GET /especialidades] Error:", err);
    res.status(500).json({ error: "No se pudieron listar las especialidades" });
  }
});

// Crear (solo admin)
router.post("/especialidades", auth(), authorize("admin"), async (req, res) => {
  try {
    const { nombre } = req.body;
    if (!nombreValido(nombre)) {
      return res.status(400).json({ error: "Nombre inválido" });
    }
    const r = await query("INSERT INTO especialidades (nombre) VALUES (?)", [
      nombre.trim(),
    ]);
    return res.status(201).json({ id: r.insertId });
  } catch (err) {
    console.error("[POST /especialidades] Error:", err);
    if (err?.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ error: "La especialidad ya existe" });
    }
    res.status(500).json({ error: "No se pudo crear la especialidad" });
  }
});

// Actualizar (solo admin)
router.put(
  "/especialidades/:id",
  auth(),
  authorize("admin"),
  async (req, res) => {
    try {
      const id = Number(req.params.id || 0);
      const { nombre } = req.body;
      if (!id) return res.status(400).json({ error: "ID inválido" });
      if (!nombreValido(nombre))
        return res.status(400).json({ error: "Nombre inválido" });

      const r = await query("UPDATE especialidades SET nombre=? WHERE id=?", [
        nombre.trim(),
        id,
      ]);
      if (!r.affectedRows)
        return res.status(404).json({ error: "No encontrada" });
      res.json({ ok: true });
    } catch (err) {
      console.error("[PUT /especialidades/:id] Error:", err);
      if (err?.code === "ER_DUP_ENTRY") {
        return res.status(409).json({ error: "La especialidad ya existe" });
      }
      res.status(500).json({ error: "No se pudo actualizar la especialidad" });
    }
  }
);

// Borrar (solo admin) — protege si está en uso
router.delete(
  "/especialidades/:id",
  auth(),
  authorize("admin"),
  async (req, res) => {
    try {
      const id = Number(req.params.id || 0);
      if (!id) return res.status(400).json({ error: "ID inválido" });

      // ¿Usada por médicos o por citas?
      const ref1 = await query(
        "SELECT 1 FROM medicos WHERE especialidad_id=? LIMIT 1",
        [id]
      );
      const ref2 = await query(
        "SELECT 1 FROM citas WHERE especialidad_id=? LIMIT 1",
        [id]
      );
      if (ref1.length || ref2.length) {
        return res
          .status(409)
          .json({ error: "No se puede eliminar: está en uso" });
      }

      const r = await query("DELETE FROM especialidades WHERE id=?", [id]);
      if (!r.affectedRows)
        return res.status(404).json({ error: "No encontrada" });
      res.json({ ok: true });
    } catch (err) {
      console.error("[DELETE /especialidades/:id] Error:", err);
      res.status(500).json({ error: "No se pudo eliminar la especialidad" });
    }
  }
);

// ===================== DIAGNOSTICOS =====================

router.get("/diagnosticos", async (req, res) => {
  try {
    const rows = await query("SELECT id, nombre FROM diagnosticos ORDER BY id");
    res.json(rows);
  } catch (err) {
    console.error("[GET /diagnosticos] Error:", err);
    res.status(500).json({ error: "No se pudieron listar los diagnósticos" });
  }
});

router.post("/diagnosticos", auth(), authorize("admin"), async (req, res) => {
  try {
    const { nombre } = req.body;
    if (!nombreValido(nombre))
      return res.status(400).json({ error: "Nombre inválido" });

    const r = await query("INSERT INTO diagnosticos (nombre) VALUES (?)", [
      nombre.trim(),
    ]);
    res.status(201).json({ id: r.insertId });
  } catch (err) {
    console.error("[POST /diagnosticos] Error:", err);
    if (err?.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ error: "El diagnóstico ya existe" });
    }
    res.status(500).json({ error: "No se pudo crear el diagnóstico" });
  }
});

router.put(
  "/diagnosticos/:id",
  auth(),
  authorize("admin"),
  async (req, res) => {
    try {
      const id = Number(req.params.id || 0);
      const { nombre } = req.body;
      if (!id) return res.status(400).json({ error: "ID inválido" });
      if (!nombreValido(nombre))
        return res.status(400).json({ error: "Nombre inválido" });

      const r = await query("UPDATE diagnosticos SET nombre=? WHERE id=?", [
        nombre.trim(),
        id,
      ]);
      if (!r.affectedRows)
        return res.status(404).json({ error: "No encontrado" });
      res.json({ ok: true });
    } catch (err) {
      console.error("[PUT /diagnosticos/:id] Error:", err);
      if (err?.code === "ER_DUP_ENTRY") {
        return res.status(409).json({ error: "El diagnóstico ya existe" });
      }
      res.status(500).json({ error: "No se pudo actualizar el diagnóstico" });
    }
  }
);

router.delete(
  "/diagnosticos/:id",
  auth(),
  authorize("admin"),
  async (req, res) => {
    try {
      const id = Number(req.params.id || 0);
      if (!id) return res.status(400).json({ error: "ID inválido" });

      // ¿en uso en recetas?
      const ref = await query(
        "SELECT 1 FROM recetas WHERE diagnostico_id=? LIMIT 1",
        [id]
      );
      if (ref.length) {
        return res
          .status(409)
          .json({ error: "No se puede eliminar: está en uso" });
      }

      const r = await query("DELETE FROM diagnosticos WHERE id=?", [id]);
      if (!r.affectedRows)
        return res.status(404).json({ error: "No encontrado" });
      res.json({ ok: true });
    } catch (err) {
      console.error("[DELETE /diagnosticos/:id] Error:", err);
      res.status(500).json({ error: "No se pudo eliminar el diagnóstico" });
    }
  }
);

// ===================== MEDICAMENTOS =====================

router.get("/medicamentos", async (req, res) => {
  try {
    const rows = await query("SELECT id, nombre FROM medicamentos ORDER BY id");
    res.json(rows);
  } catch (err) {
    console.error("[GET /medicamentos] Error:", err);
    res.status(500).json({ error: "No se pudieron listar los medicamentos" });
  }
});

router.post("/medicamentos", auth(), authorize("admin"), async (req, res) => {
  try {
    const { nombre } = req.body;
    if (!nombreValido(nombre))
      return res.status(400).json({ error: "Nombre inválido" });

    const r = await query("INSERT INTO medicamentos (nombre) VALUES (?)", [
      nombre.trim(),
    ]);
    res.status(201).json({ id: r.insertId });
  } catch (err) {
    console.error("[POST /medicamentos] Error:", err);
    if (err?.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ error: "El medicamento ya existe" });
    }
    res.status(500).json({ error: "No se pudo crear el medicamento" });
  }
});

router.put(
  "/medicamentos/:id",
  auth(),
  authorize("admin"),
  async (req, res) => {
    try {
      const id = Number(req.params.id || 0);
      const { nombre } = req.body;
      if (!id) return res.status(400).json({ error: "ID inválido" });
      if (!nombreValido(nombre))
        return res.status(400).json({ error: "Nombre inválido" });

      const r = await query("UPDATE medicamentos SET nombre=? WHERE id=?", [
        nombre.trim(),
        id,
      ]);
      if (!r.affectedRows)
        return res.status(404).json({ error: "No encontrado" });
      res.json({ ok: true });
    } catch (err) {
      console.error("[PUT /medicamentos/:id] Error:", err);
      if (err?.code === "ER_DUP_ENTRY") {
        return res.status(409).json({ error: "El medicamento ya existe" });
      }
      res.status(500).json({ error: "No se pudo actualizar el medicamento" });
    }
  }
);

router.delete(
  "/medicamentos/:id",
  auth(),
  authorize("admin"),
  async (req, res) => {
    try {
      const id = Number(req.params.id || 0);
      if (!id) return res.status(400).json({ error: "ID inválido" });

      // ¿en uso en receta_detalle?
      const ref = await query(
        "SELECT 1 FROM receta_detalle WHERE medicamento_id=? LIMIT 1",
        [id]
      );
      if (ref.length) {
        return res
          .status(409)
          .json({ error: "No se puede eliminar: está en uso" });
      }

      const r = await query("DELETE FROM medicamentos WHERE id=?", [id]);
      if (!r.affectedRows)
        return res.status(404).json({ error: "No encontrado" });
      res.json({ ok: true });
    } catch (err) {
      console.error("[DELETE /medicamentos/:id] Error:", err);
      res.status(500).json({ error: "No se pudo eliminar el medicamento" });
    }
  }
);

module.exports = router;
