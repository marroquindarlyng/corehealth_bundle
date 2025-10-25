// corehealth-backend/controllers/authController.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  createPaciente,
  createMedico,
  findUserByEmailOrUsuario,
} = require("../models/authModel");

function signToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "8h" });
}

// PACIENTE
async function register(req, res) {
  try {
    const {
      nombre,
      apellido,
      email,
      usuario,
      password,
      telefono,
      direccion,
      fecha_nacimiento,
      dpi,
    } = req.body;

    if (!nombre || !apellido || !email || !usuario || !password) {
      return res.status(400).json({ error: "Faltan campos requeridos" });
    }

    const password_hash = bcrypt.hashSync(password, 10);
    const paciente = await createPaciente({
      nombre,
      apellido,
      email,
      usuario,
      password_hash,
      telefono,
      direccion,
      fecha_nacimiento,
      dpi,
    });

    return res.status(201).json({ id: paciente.id });
  } catch (err) {
    console.error("[register paciente] Error:", err);
    if (err?.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ error: "Email/usuario ya registrado" });
    }
    return res.status(500).json({ error: "Error al registrar paciente" });
  }
}

// MÉDICO
async function registerMedico(req, res) {
  try {
    const {
      nombre,
      email,
      usuario,
      password,
      colegiado,
      especialidad_id,
      telefono,
    } = req.body;

    if (
      !nombre ||
      !email ||
      !usuario ||
      !password ||
      !colegiado ||
      !especialidad_id
    ) {
      return res.status(400).json({ error: "Faltan campos requeridos" });
    }

    const password_hash = bcrypt.hashSync(password, 10);
    const medico = await createMedico({
      nombre,
      email,
      usuario,
      password_hash,
      colegiado,
      especialidad_id,
      telefono,
    });

    return res.status(201).json({ id: medico.id });
  } catch (err) {
    console.error("[register medico] Error:", err);
    if (err?.code === "ER_DUP_ENTRY") {
      return res
        .status(409)
        .json({ error: "Email/usuario/colegiado ya registrado" });
    }
    if (err?.code === "ER_NO_REFERENCED_ROW_2") {
      return res.status(422).json({ error: "especialidad_id inválido" });
    }
    return res.status(500).json({ error: "Error al registrar médico" });
  }
}

// LOGIN admin | médico | paciente
async function login(req, res) {
  try {
    const { emailOrUsuario, password } = req.body;
    if (!emailOrUsuario || !password) {
      return res.status(400).json({ error: "Credenciales incompletas" });
    }

    // 1) Admin
    let user = await findUserByEmailOrUsuario("admins", emailOrUsuario);
    let rol = user ? "admin" : null;

    // 2) Médico
    if (!user) {
      user = await findUserByEmailOrUsuario("medicos", emailOrUsuario);
      rol = user ? "medico" : null;
    }
    // 3) Paciente
    if (!user) {
      user = await findUserByEmailOrUsuario("pacientes", emailOrUsuario);
      rol = user ? "paciente" : null;
    }

    if (!user) return res.status(401).json({ error: "Usuario no encontrado" });
    if (user.activo === 0)
      return res.status(403).json({ error: "Usuario inactivo" });

    const ok = bcrypt.compareSync(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: "Credenciales inválidas" });

    const token = signToken({ id: user.id, email: user.email, rol });
    return res.json({ token, rol, id: user.id });
  } catch (err) {
    console.error("[login] Error:", err);
    return res.status(500).json({ error: "Error al iniciar sesión" });
  }
}

module.exports = { register, registerMedico, login };
