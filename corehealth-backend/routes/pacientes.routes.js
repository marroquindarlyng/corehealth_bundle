// corehealth-backend/routes/pacientes.routes.js
const router = require("express").Router();
const bcrypt = require("bcryptjs");
const { auth, authorize } = require("../middleware/auth");
const Pacientes = require("../models/pacientesModel");

/**
 * Rutas de perfil (mantener /me antes de /:id para evitar conflictos)
 */
router.get("/me", auth(), authorize("paciente"), async (req, res) => {
  try {
    const id = Number(req.user?.id || 0);
    if (!id) return res.status(401).json({ error: "No autenticado" });

    const me = await Pacientes.getById(id);
    if (!me) return res.status(404).json({ error: "Paciente no encontrado" });

    return res.json(me);
  } catch (err) {
    console.error("[GET /pacientes/me] Error:", err);
    return res.status(500).json({ error: "No se pudo cargar el perfil" });
  }
});

router.put("/me", auth(), authorize("paciente"), async (req, res) => {
  try {
    const id = Number(req.user?.id || 0);
    if (!id) return res.status(401).json({ error: "No autenticado" });

    const payload = {
      nombre: req.body.nombre,
      apellido: req.body.apellido,
      telefono: req.body.telefono,
      direccion: req.body.direccion,
      fecha_nacimiento: req.body.fecha_nacimiento,
      dpi: req.body.dpi,
    };

    await Pacientes.updateById(id, payload);
    const updated = await Pacientes.getById(id);
    return res.json(updated);
  } catch (err) {
    console.error("[PUT /pacientes/me] Error:", err);
    return res.status(500).json({ error: "No se pudo actualizar el perfil" });
  }
});

router.put("/me/password", auth(), authorize("paciente"), async (req, res) => {
  try {
    const id = Number(req.user?.id || 0);
    if (!id) return res.status(401).json({ error: "No autenticado" });

    const { current_password, new_password } = req.body || {};
    if (!current_password || !new_password) {
      return res
        .status(400)
        .json({ error: "current_password y new_password son requeridos" });
    }

    const hash = await Pacientes.getPasswordHash(id);
    if (!hash) return res.status(404).json({ error: "Paciente no encontrado" });

    const ok = bcrypt.compareSync(current_password, hash);
    if (!ok)
      return res.status(401).json({ error: "Contraseña actual incorrecta" });

    const newHash = bcrypt.hashSync(new_password, 10);
    await Pacientes.changePassword(id, newHash);

    return res.json({ ok: true });
  } catch (err) {
    console.error("[PUT /pacientes/me/password] Error:", err);
    return res.status(500).json({ error: "No se pudo cambiar la contraseña" });
  }
});

router.delete("/me", auth(), authorize("paciente"), async (req, res) => {
  try {
    const id = Number(req.user?.id || 0);
    if (!id) return res.status(401).json({ error: "No autenticado" });

    await Pacientes.deactivate(id);
    return res.json({ ok: true });
  } catch (err) {
    console.error("[DELETE /pacientes/me] Error:", err);
    return res.status(500).json({ error: "No se pudo desactivar la cuenta" });
  }
});

/**
 * CRUD público/administrable básico
 */

// GET /api/pacientes
router.get("/", async (_req, res) => {
  try {
    const rows = await Pacientes.findAll();
    return res.json(rows);
  } catch (err) {
    console.error("[GET /pacientes] Error:", err);
    return res.status(500).json({ error: "No se pudo listar pacientes" });
  }
});

// GET /api/pacientes/:id
router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id || 0);
    if (!id) return res.status(400).json({ error: "ID inválido" });

    const item = await Pacientes.getById(id);
    if (!item) return res.status(404).json({ error: "Paciente no encontrado" });
    return res.json(item);
  } catch (err) {
    console.error("[GET /pacientes/:id] Error:", err);
    return res.status(500).json({ error: "No se pudo obtener el paciente" });
  }
});

// POST /api/pacientes  (registro público)
router.post("/", async (req, res) => {
  try {
    const {
      usuario,
      email,
      nombre,
      apellido,
      telefono,
      direccion,
      fecha_nacimiento,
      dpi,
      password,
    } = req.body || {};

    if (!usuario || !email || !password) {
      return res
        .status(400)
        .json({ error: "usuario, email y password son requeridos" });
    }

    const password_hash = bcrypt.hashSync(password, 10);

    const created = await Pacientes.insert({
      usuario,
      email,
      nombre,
      apellido,
      telefono,
      direccion,
      fecha_nacimiento,
      dpi,
      password_hash,
    });

    const newRow = await Pacientes.getById(created.insertId || created.id);
    return res.status(201).json(newRow);
  } catch (err) {
    console.error("[POST /pacientes] Error:", err);
    if (err?.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ error: "Email/usuario ya registrado" });
    }
    return res.status(500).json({ error: "No se pudo crear el paciente" });
  }
});

/**
 * Rutas protegidas con política: admin-like o dueño
 * - admin-like: roles ["admin", "direccion", "recepcion"]
 * - dueño: rol "paciente" cuyo req.user.id === :id
 */

// PUT /api/pacientes/:id
router.put("/:id", auth(), async (req, res) => {
  try {
    const id = Number(req.params.id || 0);
    if (!id) return res.status(400).json({ error: "ID inválido" });

    const adminRoles = ["admin", "direccion", "recepcion"];

    // Admin-like puede actualizar cualquier registro
    if (req.user && adminRoles.includes(req.user.rol)) {
      await Pacientes.updateById(id, req.body);
      const updated = await Pacientes.getById(id);
      return res.json(updated);
    }

    // Paciente solo puede actualizar su propio registro
    if (req.user && req.user.rol === "paciente" && Number(req.user.id) === id) {
      await Pacientes.updateById(id, req.body);
      const updated = await Pacientes.getById(id);
      return res.json(updated);
    }

    return res.status(403).json({ error: "No autorizado" });
  } catch (err) {
    console.error("[PUT /pacientes/:id] Error:", err);
    return res.status(500).json({ error: "No se pudo actualizar el paciente" });
  }
});

// DELETE /api/pacientes/:id
router.delete("/:id", auth(), async (req, res) => {
  try {
    const id = Number(req.params.id || 0);
    if (!id) return res.status(400).json({ error: "ID inválido" });

    const adminRoles = ["admin", "direccion", "recepcion"];

    // Admin-like puede realizar hard delete (o cambia a soft delete si prefieres)
    if (req.user && adminRoles.includes(req.user.rol)) {
      await Pacientes.deleteById(id);
      return res.json({ ok: true });
    }

    // Paciente puede desactivar su propia cuenta (soft delete)
    if (req.user && req.user.rol === "paciente" && Number(req.user.id) === id) {
      await Pacientes.deactivate(id);
      return res.json({ ok: true });
    }

    return res.status(403).json({ error: "No autorizado" });
  } catch (err) {
    console.error("[DELETE /pacientes/:id] Error:", err);
    return res.status(500).json({ error: "No se pudo eliminar el paciente" });
  }
});

module.exports = router;
