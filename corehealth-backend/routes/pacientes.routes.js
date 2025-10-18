// corehealth-backend/routes/pacientes.routes.js
const router = require("express").Router();
const bcrypt = require("bcryptjs");
const { auth, authorize } = require("../middleware/auth");
const Pacientes = require("../models/pacientesModel");

/**
 * GET /api/pacientes/me
 * Perfil del paciente autenticado
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

/**
 * PUT /api/pacientes/me
 * Actualiza datos básicos del perfil (sin email/usuario/password)
 * Body: { nombre?, apellido?, telefono?, direccion?, fecha_nacimiento?, dpi? }
 */
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

/**
 * PUT /api/pacientes/me/password
 * Cambia la contraseña del paciente
 * Body: { current_password, new_password }
 */
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

/**
 * DELETE /api/pacientes/me
 * Desactiva la cuenta (soft delete => activo=0)
 */
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

module.exports = router;
